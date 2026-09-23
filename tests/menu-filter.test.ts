import { describe, it, expect } from 'vitest'
import { getMenuForLocation } from '@/lib/utils/menu-filter'
import type { Category } from '@/lib/types/order'

const p = (id: string, availableAt?: ('original' | 'express')[]) => ({ id, name: id, description: '', price: 1, categoryId: 'c', availableAt }) as any

describe('getMenuForLocation', () => {
  const menu = [
    { id: 'everywhere', name: 'A', products: [p('a1'), p('a2', ['original'])] },
    { id: 'original-only', name: 'B', availableAt: ['original'], products: [p('b1')] },
    { id: 'express-empty', name: 'C', products: [p('c1', ['original'])] },
  ] as unknown as Category[]

  it('keeps categories and products available at the location', () => {
    expect(getMenuForLocation(menu, 'original').map((c) => c.id)).toEqual(['everywhere', 'original-only', 'express-empty'])
  })

  it('filters out unavailable products and drops empty categories', () => {
    const express = getMenuForLocation(menu, 'express')
    expect(express.map((c) => c.id)).toEqual(['everywhere'])
    expect(express[0].products.map((x) => x.id)).toEqual(['a1'])
  })
})
