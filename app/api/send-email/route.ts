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

export async function POST(request: Request) {
    try {
        const { email, orderDetails, pickupTime } = await request.json();

        if (!email) {
            return NextResponse.json({ error: "Email required" }, { status: 400 });
        }

        // In a real app, generate the PDF or Receipt here.
        // We send the React Email component.

        const resend = getResend();
        const { data, error } = await resend.emails.send({
            from: 'Wake n Bake <orders@wake-n-bake.nl>', // Requires domain verification
            to: [email],
            subject: `Bevestiging bestelling Wake n Bake`,
            react: OrderReceipt({
                customerName: orderDetails.customerDetails?.name || "Klant",
                orderId: orderDetails.orderId || "WNB-???", // Should come from Stripe metadata ideally
                pickupTime: pickupTime, // ISO string
                items: orderDetails.items || [],
                totals: orderDetails.totals || { subtotal: 0, tax: 0, total: 0 },
            }),
        });

        if (error) {
            console.error("Resend error:", error);
            return NextResponse.json({ error }, { status: 500 });
        }

        return NextResponse.json({ data });
    } catch (error: any) {
        console.error("Email error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
