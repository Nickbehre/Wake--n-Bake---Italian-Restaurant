import { NextResponse } from "next/server";
import { Resend } from "resend";
import { customerConfirmationEmail, storeNotificationEmail, type OrderEmailData } from "@/lib/email/templates";

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

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'info@order.wakenbake.nl';
const FROM_NAME = "Wake N' Bake Panificio";
const STORE_EMAIL = process.env.ORDER_NOTIFICATION_EMAIL || 'info@wakenbake.nl';

export async function POST(request: Request) {
    try {
        const { email, orderDetails, pickupTimeFormatted } = await request.json();

        if (!email) {
            return NextResponse.json({ error: "Email required" }, { status: 400 });
        }

        const orderId = orderDetails.orderId || generateOrderId();

        const resend = getResend();

        const emailData: OrderEmailData = {
            orderId,
            items: orderDetails.items || [],
            customer: {
                name: orderDetails.customerDetails?.name || "Klant",
                email,
                phone: orderDetails.customerDetails?.phone || "",
            },
            total: orderDetails.totals?.total ?? 0,
            pickupTime: pickupTimeFormatted || "Onbekend",
        };

        // Send both customer confirmation and store notification
        const results = await Promise.allSettled([
            // Email 1: Customer confirmation
            resend.emails.send({
                from: `${FROM_NAME} <${FROM_EMAIL}>`,
                to: [email],
                subject: `Orderbevestiging ${orderId} - Wake N' Bake`,
                html: customerConfirmationEmail(emailData),
            }),
            // Email 2: Store notification
            resend.emails.send({
                from: `${FROM_NAME} <${FROM_EMAIL}>`,
                to: [STORE_EMAIL],
                subject: `NIEUWE BESTELLING ${orderId} - Ophalen ${emailData.pickupTime}`,
                html: storeNotificationEmail(emailData),
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
