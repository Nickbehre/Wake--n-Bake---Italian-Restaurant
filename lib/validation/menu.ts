// Zod-schema's voor de admin menu-API (app/api/admin/menu/*)

import { z } from 'zod'

export const extraSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  price: z.number().min(0),
  description: z.string().optional(),
})

export const productBodySchema = z.object({
  category_id: z.string().min(1),
  name_nl: z.string().min(1),
  name_en: z.string().min(1),
  description_nl: z.string().default(''),
  description_en: z.string().default(''),
  price: z.number().positive(),
  has_sizes: z.boolean().default(false),
  price_regular: z.number().positive().nullable().default(null),
  price_large: z.number().positive().nullable().default(null),
  extras: z.array(extraSchema).default([]),
  available_at: z.array(z.enum(['original', 'express'])).nullable().default(null),
  sold_out: z.boolean().default(false),
  hidden: z.boolean().default(false),
  image_url: z.string().nullable().default(null),
})

// PATCH mag elk deelveld wijzigen (incl. category_id voor verplaatsen)
export const productPatchSchema = productBodySchema.partial()

export const categoryBodySchema = z.object({
  name_nl: z.string().min(1),
  name_en: z.string().min(1),
  menu: z.enum(['schiacciata', 'togo']),
  available_at: z.array(z.enum(['original', 'express'])).nullable().default(null),
})

export const categoryPatchSchema = categoryBodySchema.partial()

export const reorderSchema = z.object({
  type: z.enum(['products', 'categories']),
  ids: z.array(z.string().min(1)).min(1),
})

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}
