import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(request: Request) {
    try {
        // Verify authentication - only admins can update orders
        const authClient = await createClient();
        const { data: { user } } = await authClient.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { orderId, customer, pickupTime } = await request.json();

        if (!orderId) {
            return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
        }

        const supabase = createAdminClient();

        const updateData: Record<string, any> = {
            updated_at: new Date().toISOString(),
        };

        if (customer) {
            updateData.customer_name = customer.name || '';
            updateData.customer_email = customer.email || '';
            updateData.customer_phone = customer.phone || '';
        }

        if (pickupTime) {
            updateData.pickup_time = pickupTime;
        }

        const { error } = await supabase
            .from('orders')
            .update(updateData)
            .eq('id', orderId);

        if (error) {
            console.error("Supabase update error:", error);
            return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Update order error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
