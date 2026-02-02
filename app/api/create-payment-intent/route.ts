import { NextResponse } from "next/server";
import Stripe from "stripe";
import { menuData } from "@/lib/data/menu";

// Helper to flatten menu items directly for easier lookup
const allItems = menuData.categories.flatMap((c) => c.items);

// Initialize Stripe lazily to avoid build-time errors
function getStripe() {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error("STRIPE_SECRET_KEY is not set");
    }
    return new Stripe(process.env.STRIPE_SECRET_KEY);
}

// Stripe Connect configuration
const CONNECTED_ACCOUNT_ID = process.env.STRIPE_CONNECTED_ACCOUNT_ID;
const APPLICATION_FEE_PERCENT = parseFloat(process.env.APPLICATION_FEE_PERCENT || "3"); // Default 3%

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
            // Use productId to find the menu item (handles sized items)
            const productId = item.productId || item.id;
            const dbItem = allItems.find((i) => i.id === productId);

            if (!dbItem) {
                console.warn(`Item not found in menu: ${productId}`);
                continue;
            }

            let priceVal: number;

            // Check if item has sizes
            if (dbItem.hasSizes && item.size) {
                // Use the correct price based on size
                if (item.size === 'large' && dbItem.priceLarge) {
                    priceVal = dbItem.priceLarge;
                } else if (item.size === 'regular' && dbItem.priceRegular) {
                    priceVal = dbItem.priceRegular;
                } else {
                    // Fallback: parse from price string
                    priceVal = parseFloat(dbItem.price.replace("€", "").split("|")[0].trim());
                }
            } else {
                // Non-sized item - parse price from string (e.g., "€2.50")
                priceVal = parseFloat(dbItem.price.replace("€", "").replace(",", ".").trim());
            }

            if (isNaN(priceVal)) {
                console.error("Invalid price format for item", dbItem.id, dbItem.price);
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

        // Calculate application fee (platform commission)
        const applicationFeeAmount = CONNECTED_ACCOUNT_ID
            ? Math.round(amountInCents * (APPLICATION_FEE_PERCENT / 100))
            : 0;

        // Build payment intent options
        const paymentIntentOptions: Stripe.PaymentIntentCreateParams = {
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
        };

        // Add Stripe Connect options if connected account is configured
        if (CONNECTED_ACCOUNT_ID) {
            paymentIntentOptions.application_fee_amount = applicationFeeAmount;
            paymentIntentOptions.transfer_data = {
                destination: CONNECTED_ACCOUNT_ID,
            };
        }

        const paymentIntent = await stripe.paymentIntents.create(paymentIntentOptions);

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
