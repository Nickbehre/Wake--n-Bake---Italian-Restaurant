import { NextRequest, NextResponse } from 'next/server';
import type { OrderCartItem, CustomerInfo, Order } from '@/lib/types/order';
import { sendOrderEmails } from '@/lib/email/send';
import { createAdminClient } from '@/lib/supabase/admin';
import { fetchProductsByIds } from '@/lib/data/menu-db';

interface OrderRequestBody {
  items: OrderCartItem[];
  customer: CustomerInfo;
  pickupTime: string;
  subtotal: number;
  total: number;
}

/**
 * Generate a unique order ID
 */
function generateOrderId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `WNB-${timestamp}-${random}`.toUpperCase();
}

/**
 * Validate order request body
 */
function validateOrderRequest(body: OrderRequestBody): string | null {
  if (!body.items || body.items.length === 0) {
    return 'Order must contain at least one item';
  }

  if (!body.customer) {
    return 'Customer information is required';
  }

  if (!body.customer.name || body.customer.name.trim() === '') {
    return 'Customer name is required';
  }

  if (!body.customer.email || !body.customer.email.includes('@')) {
    return 'Valid email address is required';
  }

  if (!body.customer.phone || body.customer.phone.trim() === '') {
    return 'Phone number is required';
  }

  if (!body.pickupTime) {
    return 'Pickup time is required';
  }

  return null;
}

/**
 * POST /api/order
 * Create a new order
 */
export async function POST(request: NextRequest) {
  try {
    const body: OrderRequestBody = await request.json();

    // Validate request
    const validationError = validateOrderRequest(body);
    if (validationError) {
      return NextResponse.json(
        { success: false, error: validationError },
        { status: 400 }
      );
    }

    // Verify prices server-side tegen de menuproducten in Supabase
    const productIds = [...new Set(body.items.map((item) => (item as any).productId || item.id))];
    const products = await fetchProductsByIds(productIds as string[]);
    const productById = new Map(products.map((p) => [p.id, p]));

    let verifiedTotal = 0;
    const verifiedItems: OrderCartItem[] = [];
    for (const item of body.items) {
      const productId = (item as any).productId || item.id;
      const size = (item as any).size;
      const product = productById.get(productId);

      if (!product || product.hidden || product.sold_out) {
        return NextResponse.json(
          { success: false, error: `"${item.name}" is currently unavailable. Please remove it from your cart.` },
          { status: 400 }
        );
      }

      let priceVal: number;
      if (product.has_sizes && size === 'large' && product.price_large != null) {
        priceVal = Number(product.price_large);
      } else if (product.has_sizes && size === 'regular' && product.price_regular != null) {
        priceVal = Number(product.price_regular);
      } else {
        priceVal = Number(product.price);
      }

      // Extras (indien meegestuurd) valideren tegen het product
      const sentExtras = (item as any).extras as { id: string; name: string; price: number }[] | undefined;
      if (sentExtras?.length) {
        const allowed = new Map((product.extras ?? []).map((e) => [e.id, e]));
        for (const extra of sentExtras) {
          const match = allowed.get(extra.id);
          if (!match) {
            return NextResponse.json(
              { success: false, error: `Extra "${extra.name}" is not available for "${item.name}".` },
              { status: 400 }
            );
          }
          priceVal += Number(match.price);
        }
      }

      verifiedTotal += priceVal * item.quantity;
      verifiedItems.push({ ...item, price: priceVal });
    }

    // Create order object with verified prices
    const order: Order = {
      id: generateOrderId(),
      items: verifiedItems,
      customer: body.customer,
      subtotal: verifiedTotal,
      total: verifiedTotal,
      pickupTime: body.pickupTime,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    console.log('New order received:', order);

    // Save order to Supabase
    const supabase = createAdminClient();
    await supabase.from('orders').insert({
      id: order.id,
      items: order.items,
      customer_name: order.customer.name,
      customer_email: order.customer.email,
      customer_phone: order.customer.phone,
      subtotal: order.subtotal,
      total: order.total,
      pickup_time: order.pickupTime,
      status: 'pending',
      payment_method: 'cash',
    });

    // Send confirmation emails
    const emailResults = await sendOrderEmails({
      orderId: order.id,
      items: order.items,
      customer: order.customer,
      total: order.total,
      pickupTime: order.pickupTime,
    });

    console.log('Email results:', emailResults);

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        status: order.status,
        pickupTime: order.pickupTime,
        total: order.total,
      },
      message: 'Order placed successfully',
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process order' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/order
 * Get order by ID (query param) - only returns limited public fields
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const orderId = searchParams.get('id');

  if (!orderId) {
    return NextResponse.json(
      { success: false, error: 'Order ID is required' },
      { status: 400 }
    );
  }

  // Validate order ID format to prevent enumeration
  if (!/^WNB-[A-Z0-9]+-[A-Z0-9]+$/i.test(orderId)) {
    return NextResponse.json(
      { success: false, error: 'Invalid order ID format' },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('orders')
    .select('id, status, total, pickup_time, created_at, items')
    .eq('id', orderId)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { success: false, error: 'Order not found' },
      { status: 404 }
    );
  }

  // Only return non-sensitive fields (no customer PII)
  return NextResponse.json({
    success: true,
    order: {
      id: data.id,
      status: data.status,
      total: data.total,
      pickup_time: data.pickup_time,
      created_at: data.created_at,
      items: data.items,
    },
  });
}
