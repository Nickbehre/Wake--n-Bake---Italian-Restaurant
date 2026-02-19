import { NextResponse } from "next/server";
import { Resend } from "resend";
import OrderReceipt from "@/components/emails/OrderReceipt";

// Initialize Resend lazily to avoid build-time errors
function getResend() {
    if (!process.env.RESEND_API_KEY) {
        throw new Error("RESEND_API_KEY is not set");
    }
    return new Resend(process.env.RESEND_API_KEY);
}

function generateOrderId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 6);
    return `WNB-${timestamp}-${random}`.toUpperCase();
}

const STORE_EMAIL = process.env.ORDER_NOTIFICATION_EMAIL || 'info@wakenbake.nl';

export async function POST(request: Request) {
    try {
        const { email, orderDetails, pickupTimeFormatted } = await request.json();

        if (!email) {
            return NextResponse.json({ error: "Email required" }, { status: 400 });
        }

        // Use env var for from address, fallback to Resend sandbox for testing
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
        const orderId = orderDetails.orderId || generateOrderId();

        const resend = getResend();

        const receiptProps = {
            customerName: orderDetails.customerDetails?.name || "Customer",
            orderId,
            pickupTimeFormatted: pickupTimeFormatted,
            items: orderDetails.items || [],
            totals: orderDetails.totals || { subtotal: 0, tax: 0, total: 0 },
        };

        // Send both customer confirmation and store notification
        const results = await Promise.allSettled([
            // Email 1: Customer confirmation
            resend.emails.send({
                from: `Wake n Bake <${fromEmail}>`,
                to: [email],
                subject: `Order Confirmation - Wake n Bake #${orderId}`,
                react: OrderReceipt(receiptProps),
            }),
            // Email 2: Store notification
            resend.emails.send({
                from: `Wake n Bake <${fromEmail}>`,
                to: [STORE_EMAIL],
                subject: `NEW ORDER #${orderId} - Pickup ${pickupTimeFormatted}`,
                react: OrderReceipt(receiptProps),
            }),
        ]);

        const customerResult = results[0];
        const storeResult = results[1];

        if (customerResult.status === 'rejected') {
            console.error("Customer email error:", customerResult.reason);
        }
        if (storeResult.status === 'rejected') {
            console.error("Store email error:", storeResult.reason);
        }

        return NextResponse.json({
            customerEmail: customerResult.status === 'fulfilled' ? customerResult.value.data : null,
            storeEmail: storeResult.status === 'fulfilled' ? storeResult.value.data : null,
        });
    } catch (error: any) {
        console.error("Email error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
