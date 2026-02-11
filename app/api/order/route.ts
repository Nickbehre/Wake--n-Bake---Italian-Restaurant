import { NextRequest, NextResponse } from 'next/server';
import type { OrderCartItem, CustomerInfo, Order } from '@/lib/types/order';
import { sendOrderEmails } from '@/lib/email/send';

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

    // Create order object
    const order: Order = {
      id: generateOrderId(),
      items: body.items,
      customer: body.customer,
      subtotal: body.subtotal,
      total: body.total,
      pickupTime: body.pickupTime,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    console.log('New order received:', order);

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

  // In production, fetch from database
  // For now, return a placeholder response
  return NextResponse.json({
    success: true,
    message: 'Order lookup not implemented in demo mode',
    orderId,
  });
}
