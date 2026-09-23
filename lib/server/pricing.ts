// Server-side prijsberekening voor een winkelmand. Vertrouwt NOOIT de
// prijzen van de client: alles wordt herberekend uit de producten in
// Supabase. Gedeeld door /api/order (contant) en /api/create-payment-intent
// (Stripe), en puur zodat het zonder database te testen is.

import type { DbProduct } from '@/lib/data/menu-types'

export interface PricingExtra {
  id: string
  name: string
  price: number
}

export interface PricingCartItem {
  id: string
  productId?: string
  name: string
  size?: 'regular' | 'large' | null
  price: number
  extras?: PricingExtra[]
  quantity: number
}

export type PricingFailureReason =
  | 'not_available'
  | 'sold_out'
  | 'invalid_extra'
  | 'invalid_price'
  | 'invalid_quantity'

export type PricingResult<T extends PricingCartItem> =
  | { ok: true; items: T[]; subtotal: number }
  | { ok: false; reason: PricingFailureReason; itemId: string; error: string }

/** Max. aantal van één item per bestelling — vangt typefouten/misbruik af */
export const MAX_QUANTITY_PER_ITEM = 50

/** Basisprijs van een product voor de gekozen maat. */
export function basePrice(product: DbProduct, size: PricingCartItem['size']): number {
  if (product.has_sizes && size === 'large' && product.price_large != null) {
    return Number(product.price_large)
  }
  if (product.has_sizes && size === 'regular' && product.price_regular != null) {
    return Number(product.price_regular)
  }
  return Number(product.price)
}

export function priceCart<T extends PricingCartItem>(
  items: T[],
  productById: Map<string, DbProduct>
): PricingResult<T> {
  let subtotal = 0
  const verified: T[] = []

  for (const item of items) {
    const productId = item.productId || item.id
    const product = productById.get(productId)

    // Onbekend/verborgen/uitverkocht: bestelling weigeren i.p.v. item
    // stilletjes laten vallen — de checkout toont welk item het is.
    if (!product || product.hidden || product.sold_out) {
      return {
        ok: false,
        reason: product?.sold_out ? 'sold_out' : 'not_available',
        itemId: item.id,
        error: `"${item.name}" is momenteel niet beschikbaar. Verwijder het uit je winkelmand. / "${item.name}" is currently unavailable. Please remove it from your cart.`,
      }
    }

    if (
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > MAX_QUANTITY_PER_ITEM
    ) {
      return {
        ok: false,
        reason: 'invalid_quantity',
        itemId: item.id,
        error: `Ongeldig aantal voor "${item.name}". / Invalid quantity for "${item.name}".`,
      }
    }

    let unitPrice = basePrice(product, item.size)

    // Extras valideren tegen de extras van het product zelf
    const verifiedExtras: PricingExtra[] = []
    if (item.extras && item.extras.length > 0) {
      const allowed = new Map((product.extras ?? []).map((e) => [e.id, e]))
      for (const extra of item.extras) {
        const match = allowed.get(extra.id)
        if (!match) {
          return {
            ok: false,
            reason: 'invalid_extra',
            itemId: item.id,
            error: `Extra "${extra.name}" is niet beschikbaar voor "${item.name}". / Extra "${extra.name}" is not available for "${item.name}".`,
          }
        }
        verifiedExtras.push({ id: match.id, name: match.name, price: Number(match.price) })
        unitPrice += Number(match.price)
      }
    }

    if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
      return {
        ok: false,
        reason: 'invalid_price',
        itemId: item.id,
        error: 'Ongeldige productprijs. / Invalid item price.',
      }
    }

    subtotal += unitPrice * item.quantity
    verified.push({
      ...item,
      price: unitPrice,
      extras: verifiedExtras.length > 0 ? verifiedExtras : undefined,
    })
  }

  // Afronden op centen om float-ruis (0.1 + 0.2) te voorkomen
  return { ok: true, items: verified, subtotal: Math.round(subtotal * 100) / 100 }
}
