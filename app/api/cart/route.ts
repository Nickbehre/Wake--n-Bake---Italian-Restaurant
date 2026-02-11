import { NextRequest, NextResponse } from 'next/server';
import { getProductById } from '@/lib/data/products';
import type { OrderCartItem } from '@/lib/types/order';

interface AddToCartRequestBody {
  productId: string;
  quantity?: number;
}

interface UpdateCartRequestBody {
  itemId: string;
  quantity: number;
}

/**
 * POST /api/cart
 * Add item to cart (validation endpoint)
 * Note: Cart state is managed client-side with Zustand
 * This endpoint validates the product and returns formatted cart item data
 */
export async function POST(request: NextRequest) {
  try {
    const body: AddToCartRequestBody = await request.json();

    if (!body.productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const product = getProductById(body.productId);

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    const quantity = body.quantity || 1;

    if (quantity < 1 || quantity > 99) {
      return NextResponse.json(
        { success: false, error: 'Quantity must be between 1 and 99' },
        { status: 400 }
      );
    }

    // Return validated cart item data
    const cartItem: Omit<OrderCartItem, 'id'> = {
      productId: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      quantity,
      categoryId: product.categoryId,
    };

    return NextResponse.json({
      success: true,
      item: cartItem,
      message: `${product.name} ready to add to cart`,
    });
  } catch (error) {
    console.error('Cart add error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process cart request' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/cart
 * Validate cart update (quantity change)
 */
export async function PUT(request: NextRequest) {
  try {
    const body: UpdateCartRequestBody = await request.json();

    if (!body.itemId) {
      return NextResponse.json(
        { success: false, error: 'Item ID is required' },
        { status: 400 }
      );
    }

    if (typeof body.quantity !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Quantity is required' },
        { status: 400 }
      );
    }

    if (body.quantity < 0 || body.quantity > 99) {
      return NextResponse.json(
        { success: false, error: 'Quantity must be between 0 and 99' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      itemId: body.itemId,
      quantity: body.quantity,
      action: body.quantity === 0 ? 'remove' : 'update',
      message:
        body.quantity === 0
          ? 'Item will be removed from cart'
          : `Quantity updated to ${body.quantity}`,
    });
  } catch (error) {
    console.error('Cart update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process cart update' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cart
 * Validate cart item removal
 */
export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const itemId = searchParams.get('itemId');

  if (!itemId) {
    return NextResponse.json(
      { success: false, error: 'Item ID is required' },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    itemId,
    message: 'Item can be removed from cart',
  });
}
