import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { fetchProductsByIds, type DbProduct } from "@/lib/data/menu-db";
import { isStoreAcceptingOrders } from "@/lib/server/store-status";
import type { LocationId } from "@/lib/data/locations";
import { isValidLocationId } from "@/lib/data/locations";

// Initialize Stripe lazily to avoid build-time errors
function getStripe() {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error("STRIPE_SECRET_KEY is not set");
    }
    return new Stripe(process.env.STRIPE_SECRET_KEY);
}

// Prices are already inclusive of BTW (VAT)

interface CartItemExtra {
    id: string;
    name: string;
    price: number;
}

interface CartItem {
    id: string;           // Unique cart ID (e.g., "mortadella-original-large")
    productId: string;    // Original menu item ID
    name: string;
    size: 'regular' | 'large' | null;
    price: number;        // Client-side price (we'll verify server-side)
    extras?: CartItemExtra[];
    quantity: number;
}

interface CustomerInfo {
    name: string;
    email: string;
    phone: string;
}

export async function POST(request: Request) {
    try {
        const { items, customer, pickupTime, location } = await request.json() as {
            items: CartItem[];
            customer?: CustomerInfo;
            pickupTime?: string;
            location?: string;
        };

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
        }

        // Server-side openingscontrole — de frontend-gate is te omzeilen
        const storeState = await isStoreAcceptingOrders();
        if (!storeState.open) {
            return NextResponse.json(
                { error: storeState.message, reason: "store_closed" },
                { status: 400 }
            );
        }

        // Calculate price on server side - DO NOT TRUST client prices.
        // Producten komen uit Supabase (beheerbaar via het dashboard).
        const productIds = [...new Set(items.map((i) => i.productId || i.id))];
        const products = await fetchProductsByIds(productIds);
        const productById = new Map<string, DbProduct>(products.map((p) => [p.id, p]));

        let subtotal = 0;
        const verifiedItems: CartItem[] = [];

        for (const item of items) {
            const productId = item.productId || item.id;
            const product = productById.get(productId);

            // Onbekend/verborgen/uitverkocht: bestelling weigeren i.p.v. item
            // stilletjes laten vallen — de checkout toont welk item het is.
            if (!product || product.hidden || product.sold_out) {
                const reason = !product
                    ? 'not_available'
                    : product.sold_out
                        ? 'sold_out'
                        : 'not_available';
                return NextResponse.json({
                    error: `"${item.name}" is momenteel niet beschikbaar. Verwijder het uit je winkelmand. / "${item.name}" is currently unavailable. Please remove it from your cart.`,
                    unavailableItemId: item.id,
                    reason,
                }, { status: 400 });
            }

            let priceVal: number;
            if (product.has_sizes && item.size === 'large' && product.price_large != null) {
                priceVal = Number(product.price_large);
            } else if (product.has_sizes && item.size === 'regular' && product.price_regular != null) {
                priceVal = Number(product.price_regular);
            } else {
                priceVal = Number(product.price);
            }

            // Extras valideren tegen de extras van het product zelf
            const verifiedExtras: CartItemExtra[] = [];
            if (item.extras && item.extras.length > 0) {
                const allowed = new Map((product.extras ?? []).map((e) => [e.id, e]));
                for (const extra of item.extras) {
                    const match = allowed.get(extra.id);
                    if (!match) {
                        return NextResponse.json({
                            error: `Extra "${extra.name}" is niet beschikbaar voor "${item.name}". / Extra "${extra.name}" is not available for "${item.name}".`,
                            unavailableItemId: item.id,
                            reason: 'invalid_extra',
                        }, { status: 400 });
                    }
                    verifiedExtras.push({ id: match.id, name: match.name, price: Number(match.price) });
                    priceVal += Number(match.price);
                }
            }

            if (isNaN(priceVal) || priceVal <= 0) {
                console.error("Invalid price for item", productId);
                return NextResponse.json({ error: "Invalid item price" }, { status: 400 });
            }

            subtotal += priceVal * item.quantity;
            verifiedItems.push({
                ...item,
                price: priceVal,
                extras: verifiedExtras.length > 0 ? verifiedExtras : undefined,
            });
        }

        // Prices already include BTW, so total = subtotal
        const total = subtotal;

        // Safety check for min amount (Stripe requires >= 50 cents)
        if (total < 0.50) {
            return NextResponse.json({ error: "Amount too low" }, { status: 400 });
        }

        const amountInCents = Math.round(total * 100);

        // Generate a unique order ID
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        const orderId = `WNB-${timestamp}-${random}`.toUpperCase();

        const orderLocation: LocationId = isValidLocationId(location ?? null)
            ? (location as LocationId)
            : 'original';

        const stripe = getStripe();

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: "eur",
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                order_id: orderId,
                total: total.toFixed(2),
                items_count: String(items.reduce((acc, i) => acc + i.quantity, 0)),
                customer_name: customer?.name || '',
                customer_email: customer?.email || '',
                customer_phone: customer?.phone || '',
                pickup_time: pickupTime || '',
                location: orderLocation,
            },
        });

        // Save order to Supabase with server-verified prices
        const supabase = createAdminClient();
        await supabase.from('orders').insert({
            id: orderId,
            items: verifiedItems,
            customer_name: customer?.name || '',
            customer_email: customer?.email || '',
            customer_phone: customer?.phone || '',
            subtotal: total,
            total: total,
            pickup_time: pickupTime || '',
            // Pas zichtbaar voor het personeel nadat Stripe de betaling
            // bevestigt (webhook zet de status dan op 'pending').
            status: 'awaiting_payment',
            payment_method: 'stripe',
            stripe_payment_intent_id: paymentIntent.id,
            stripe_payment_status: 'requires_payment_method',
            location: orderLocation,
        });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            orderId: orderId,
            calculatedTotal: total.toFixed(2),
        });

    } catch (error: any) {
        console.error("Stripe error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
