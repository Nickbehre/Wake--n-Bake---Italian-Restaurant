import { describe, it, expect } from 'vitest'
import { priceCart, basePrice, MAX_QUANTITY_PER_ITEM, type PricingCartItem } from '@/lib/server/pricing'
import type { DbProduct } from '@/lib/data/menu-types'

function product(overrides: Partial<DbProduct> = {}): DbProduct {
  return {
    id: 'mortadella',
    category_id: 'pork',
    name_nl: 'Mortadella',
    name_en: 'Mortadella',
    description_nl: '',
    description_en: '',
    price: 12.5,
    has_sizes: false,
    price_regular: null,
    price_large: null,
    extras: [],
    available_at: null,
    sold_out: false,
    hidden: false,
    sort_order: 0,
    image_url: null,
    ...overrides,
  }
}

function item(overrides: Partial<PricingCartItem> = {}): PricingCartItem {
  return { id: 'cart-1', productId: 'mortadella', name: 'Mortadella', price: 12.5, quantity: 1, ...overrides }
}

const catalog = (...products: DbProduct[]) => new Map(products.map((p) => [p.id, p]))

describe('basePrice', () => {
  const sized = product({ has_sizes: true, price: 10, price_regular: 11, price_large: 15 })

  it('uses the size-specific price when the product has sizes', () => {
    expect(basePrice(sized, 'regular')).toBe(11)
    expect(basePrice(sized, 'large')).toBe(15)
  })

  it('falls back to the base price without a size', () => {
    expect(basePrice(sized, null)).toBe(10)
    expect(basePrice(product(), 'large')).toBe(12.5)
  })
})

describe('priceCart', () => {
  it('ignores client prices and uses database prices', () => {
    const result = priceCart([item({ price: 0.01, quantity: 2 })], catalog(product()))
    expect(result).toMatchObject({ ok: true, subtotal: 25 })
    if (result.ok) expect(result.items[0].price).toBe(12.5)
  })

  it('adds validated extras at their database price', () => {
    const p = product({ extras: [{ id: 'burrata', name: 'Burrata', price: 3 }] })
    const result = priceCart(
      [item({ extras: [{ id: 'burrata', name: 'Burrata', price: 0 }], quantity: 2 })],
      catalog(p)
    )
    expect(result).toMatchObject({ ok: true, subtotal: 31 })
    if (result.ok) expect(result.items[0].extras).toEqual([{ id: 'burrata', name: 'Burrata', price: 3 }])
  })

  it('rejects extras that do not belong to the product', () => {
    const result = priceCart([item({ extras: [{ id: 'gold-leaf', name: 'Gold', price: 0 }] })], catalog(product()))
    expect(result).toMatchObject({ ok: false, reason: 'invalid_extra', itemId: 'cart-1' })
  })

  it('rejects unknown, hidden and sold-out products', () => {
    expect(priceCart([item({ productId: 'nope' })], catalog(product()))).toMatchObject({ ok: false, reason: 'not_available' })
    expect(priceCart([item()], catalog(product({ hidden: true })))).toMatchObject({ ok: false, reason: 'not_available' })
    expect(priceCart([item()], catalog(product({ sold_out: true })))).toMatchObject({ ok: false, reason: 'sold_out' })
  })

  it('rejects zero or invalid prices instead of creating a free order', () => {
    expect(priceCart([item()], catalog(product({ price: 0 })))).toMatchObject({ ok: false, reason: 'invalid_price' })
    expect(priceCart([item()], catalog(product({ price: NaN })))).toMatchObject({ ok: false, reason: 'invalid_price' })
  })

  it('rejects non-integer, negative and excessive quantities', () => {
    for (const quantity of [0, -1, 1.5, MAX_QUANTITY_PER_ITEM + 1]) {
      expect(priceCart([item({ quantity })], catalog(product()))).toMatchObject({ ok: false, reason: 'invalid_quantity' })
    }
  })

  it('rounds the subtotal to whole cents', () => {
    const result = priceCart([item({ quantity: 3 })], catalog(product({ price: 0.1 })))
    expect(result).toMatchObject({ ok: true, subtotal: 0.3 })
  })

  it('falls back to item.id when productId is missing', () => {
    const result = priceCart([{ id: 'mortadella', name: 'M', price: 1, quantity: 1 }], catalog(product()))
    expect(result).toMatchObject({ ok: true, subtotal: 12.5 })
  })
})
