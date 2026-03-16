import { NextResponse } from "next/server";
import Stripe from "stripe";
import { menuData } from "@/lib/data/menu";
import { getAllProducts } from "@/lib/data/products";

// Flatten menu items from both data sources for lookup
const menuItems = menuData.categories.flatMap((c) => c.items);
const productItems = getAllProducts();

// Initialize Stripe lazily to avoid build-time errors
function getStripe() {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error("STRIPE_SECRET_KEY is not set");
    }
    return new Stripe(process.env.STRIPE_SECRET_KEY);
}

// Prices are already inclusive of BTW (VAT)

interface CartItem {
    id: string;           // Unique cart ID (e.g., "mortadella-original-large")
    productId: string;    // Original menu item ID
    name: string;
    size: 'regular' | 'large' | null;
    price: number;        // Client-side price (we'll verify server-side)
    quantity: number;
}

export async function POST(request: Request) {
    try {
        const { items } = await request.json() as { items: CartItem[] };

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
        }

        // Calculate price on server side - DO NOT TRUST client prices
        let subtotal = 0;

        for (const item of items) {
            const productId = item.productId || item.id;

            // Try menu.ts first (items like "mortadella-original")
            const menuItem = menuItems.find((i) => i.id === productId);
            // Then try products.ts (items like "schiacciata-caprese")
            const productItem = productItems.find((i) => i.id === productId);

            let priceVal: number;

            if (menuItem) {
                // Found in menu.ts — price is a string like "€8 | €12" or "€2.50"
                if (menuItem.hasSizes && item.size) {
                    if (item.size === 'large' && menuItem.priceLarge) {
                        priceVal = menuItem.priceLarge;
                    } else if (item.size === 'regular' && menuItem.priceRegular) {
                        priceVal = menuItem.priceRegular;
                    } else {
                        priceVal = parseFloat(menuItem.price.replace("€", "").split("|")[0].trim());
                    }
                } else {
                    priceVal = parseFloat(menuItem.price.replace("€", "").replace(",", ".").trim());
                }
            } else if (productItem) {
                // Found in products.ts — price is a number
                if (productItem.hasSizes && item.size) {
                    if (item.size === 'large' && productItem.priceLarge) {
                        priceVal = productItem.priceLarge;
                    } else if (item.size === 'regular' && productItem.priceRegular) {
                        priceVal = productItem.priceRegular;
                    } else {
                        priceVal = productItem.price;
                    }
                } else {
                    priceVal = productItem.price;
                }
            } else {
                console.warn(`Item not found in menu: ${productId}`);
                continue;
            }

            if (isNaN(priceVal)) {
                console.error("Invalid price format for item", productId);
                continue;
            }

            subtotal += priceVal * item.quantity;
        }

        // Prices already include BTW, so total = subtotal
        const total = subtotal;

        // Safety check for min amount (Stripe requires >= 50 cents)
        if (total < 0.50) {
            return NextResponse.json({ error: "Amount too low" }, { status: 400 });
        }

        const amountInCents = Math.round(total * 100);

        // Generate a short order ID
        const orderId = `WNB-${Math.floor(1000 + Math.random() * 9000)}`;

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
            },
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
