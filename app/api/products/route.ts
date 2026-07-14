import { NextRequest, NextResponse } from 'next/server';
import { fetchMenu } from '@/lib/data/menu-db';

// Menu-wijzigingen uit het dashboard moeten direct zichtbaar zijn
export const dynamic = 'force-dynamic';

/**
 * GET /api/products
 * Volledige menustructuur uit Supabase (zonder verborgen producten).
 * Beide talen zitten in de payload; de client kiest o.b.v. taalinstelling.
 */
export async function GET(_request: NextRequest) {
  try {
    const categories = await fetchMenu(false);
    return NextResponse.json({
      success: true,
      categoryCount: categories.length,
      productCount: categories.reduce((n, c) => n + c.products.length, 0),
      categories,
    });
  } catch (error) {
    console.error('Error fetching menu:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch menu' },
      { status: 500 }
    );
  }
}
