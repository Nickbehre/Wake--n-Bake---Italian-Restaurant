import { NextRequest, NextResponse } from 'next/server';
import type { OrderCartItem, CustomerInfo, Order } from '@/lib/types/order';
import { sendOrderEmails } from '@/lib/email/send';
import { createAdminClient } from '@/lib/supabase/admin';
import { getAllProducts } from '@/lib/data/products';
import { menuData } from '@/lib/data/menu';

const menuItems = menuData.categories.flatMap((c) => c.items);
const productItems = getAllProducts();

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

    // Verify prices server-side
    let verifiedTotal = 0;
    const verifiedItems = body.items.map((item) => {
      const productId = (item as any).productId || item.id;
      const size = (item as any).size;
      const menuItem = menuItems.find((i) => i.id === productId);
      const productItem = productItems.find((i) => i.id === productId);

      let priceVal = item.price;

      if (menuItem) {
        if (menuItem.hasSizes && size) {
          if (size === 'large' && menuItem.priceLarge) priceVal = menuItem.priceLarge;
          else if (size === 'regular' && menuItem.priceRegular) priceVal = menuItem.priceRegular;
          else priceVal = parseFloat(menuItem.price.replace('€', '').split('|')[0].trim());
        } else {
          priceVal = parseFloat(menuItem.price.replace('€', '').replace(',', '.').trim());
        }
      } else if (productItem) {
        if (productItem.hasSizes && size) {
          if (size === 'large' && productItem.priceLarge) priceVal = productItem.priceLarge;
          else if (size === 'regular' && productItem.priceRegular) priceVal = productItem.priceRegular;
          else priceVal = productItem.price;
        } else {
          priceVal = productItem.price;
        }
      }

      if (!isNaN(priceVal)) verifiedTotal += priceVal * item.quantity;
      return { ...item, price: priceVal };
    });

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
 * Get order by ID (query param)
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

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { success: false, error: 'Order not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, order: data });
}
