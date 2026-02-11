import { NextRequest, NextResponse } from 'next/server';
import {
  productCategories,
  getAllProducts,
  getProductById,
  getCategoryById,
  getProductsByCategoryId,
  searchProducts,
} from '@/lib/data/products';

/**
 * GET /api/products
 * Get products with optional filtering
 *
 * Query params:
 * - id: Get specific product by ID
 * - categoryId: Get products by category
 * - search: Search products by name/description
 * - all: Get all products as flat array (default: false, returns categories)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Get specific product by ID
  const productId = searchParams.get('id');
  if (productId) {
    const product = getProductById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      product,
    });
  }

  // Get specific category
  const categoryId = searchParams.get('categoryId');
  if (categoryId) {
    const category = getCategoryById(categoryId);
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      category,
    });
  }

  // Search products
  const searchQuery = searchParams.get('search');
  if (searchQuery) {
    const results = searchProducts(searchQuery);
    return NextResponse.json({
      success: true,
      query: searchQuery,
      count: results.length,
      products: results,
    });
  }

  // Return all products as flat array
  const returnAllFlat = searchParams.get('all') === 'true';
  if (returnAllFlat) {
    const allProducts = getAllProducts();
    return NextResponse.json({
      success: true,
      count: allProducts.length,
      products: allProducts,
    });
  }

  // Default: return all categories with products
  return NextResponse.json({
    success: true,
    categoryCount: productCategories.length,
    productCount: getAllProducts().length,
    categories: productCategories,
  });
}
