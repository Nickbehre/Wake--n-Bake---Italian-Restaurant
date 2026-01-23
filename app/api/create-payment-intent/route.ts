import { NextResponse } from "next/server";
import Stripe from "stripe";
import { menuData } from "@/lib/data/menu";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-12-18.acacia",
});

// Helper to flatten menu items directly for easier lookup
const allItems = menuData.categories.flatMap((c) => c.items);

const TAX_RATE = 0.09; // 9% BTW

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

        // Add 9% BTW (tax)
        const tax = subtotal * TAX_RATE;
        const total = subtotal + tax;

        // Safety check for min amount (Stripe requires >= 50 cents)
        if (total < 0.50) {
            return NextResponse.json({ error: "Amount too low" }, { status: 400 });
        }

        const amountInCents = Math.round(total * 100);

        // Generate a short order ID
        const orderId = `WNB-${Math.floor(1000 + Math.random() * 9000)}`;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: "eur",
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                order_id: orderId,
                subtotal: subtotal.toFixed(2),
                tax: tax.toFixed(2),
                total: total.toFixed(2),
                items_count: items.reduce((acc, i) => acc + i.quantity, 0),
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
