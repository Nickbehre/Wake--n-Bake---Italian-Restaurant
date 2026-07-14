'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { X, Loader2, Upload, ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import ExtrasEditor from '@/components/admin/ExtrasEditor'
import type { DbProduct, DbCategory } from '@/lib/data/menu-types'
import type { ProductExtra } from '@/lib/types/order'
import type { LocationId } from '@/lib/data/locations'

interface ProductEditModalProps {
  /** null = nieuw product */
  product: DbProduct | null
  categories: DbCategory[]
  /** Voorgeselecteerde categorie bij "add product" */
  defaultCategoryId?: string
  onClose: () => void
  onSaved: () => void
}

interface FormState {
  category_id: string
  name_nl: string
  name_en: string
  description_nl: string
  description_en: string
  price: string
  has_sizes: boolean
  price_regular: string
  price_large: string
  extras: ProductExtra[]
  available_original: boolean
  available_express: boolean
  sold_out: boolean
  hidden: boolean
  image_url: string | null
}

function slugifyExtra(name: string): string {
  return 'extra-' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

/** Foto's van telefoons zijn vaak >4 MB; verklein client-side vóór upload. */
async function resizeImage(file: File, maxDim = 1600): Promise<Blob> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height))
  if (scale === 1 && file.size < 1.5 * 1024 * 1024) return file
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  return new Promise((resolve) =>
    canvas.toBlob((blob) => resolve(blob ?? file), 'image/jpeg', 0.85)
  )
}

export default function ProductEditModal({
  product,
  categories,
  defaultCategoryId,
  onClose,
  onSaved,
}: ProductEditModalProps) {
  const isNew = product === null
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [form, setForm] = useState<FormState>(() => ({
    category_id: product?.category_id ?? defaultCategoryId ?? categories[0]?.id ?? '',
    name_nl: product?.name_nl ?? '',
    name_en: product?.name_en ?? '',
    description_nl: product?.description_nl ?? '',
    description_en: product?.description_en ?? '',
    price: product ? String(product.price) : '',
    has_sizes: product?.has_sizes ?? false,
    price_regular: product?.price_regular != null ? String(product.price_regular) : '',
    price_large: product?.price_large != null ? String(product.price_large) : '',
    extras: product?.extras ?? [],
    available_original: !product?.available_at || product.available_at.includes('original'),
    available_express: !product?.available_at || product.available_at.includes('express'),
    sold_out: product?.sold_out ?? false,
    hidden: product?.hidden ?? false,
    image_url: product?.image_url ?? null,
  }))

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  // Escape sluit de modal
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  async function handleImageSelect(file: File) {
    setUploading(true)
    try {
      const blob = await resizeImage(file)
      const fd = new FormData()
      fd.append('file', new File([blob], file.name, { type: blob.type || file.type }))
      fd.append('productId', product?.id ?? slugifyExtra(form.name_en || 'nieuw').replace('extra-', ''))
      const res = await fetch('/api/admin/menu/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      set('image_url', data.url)
      toast.success('Photo uploaded')
    } catch (err: any) {
      toast.error(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  async function handleSave() {
    if (!form.name_en.trim() || !form.name_nl.trim()) {
      toast.error('Name (NL and EN) is required')
      return
    }
    const priceNum = parseFloat(form.price)
    const regularNum = form.price_regular ? parseFloat(form.price_regular) : null
    const largeNum = form.price_large ? parseFloat(form.price_large) : null
    if (form.has_sizes && (!regularNum || !largeNum)) {
      toast.error('Both sizes need a price')
      return
    }
    const effectivePrice = form.has_sizes ? (largeNum ?? regularNum) : priceNum
    if (!effectivePrice || effectivePrice <= 0) {
      toast.error('Enter a valid price')
      return
    }
    if (!form.available_original && !form.available_express) {
      toast.error('Select at least one location')
      return
    }

    const available_at: LocationId[] | null =
      form.available_original && form.available_express
        ? null
        : form.available_original
          ? ['original']
          : ['express']

    const extras = form.extras
      .filter((e) => e.name.trim())
      .map((e) => ({ ...e, id: e.id || slugifyExtra(e.name), price: Number(e.price) || 0 }))

    const body = {
      category_id: form.category_id,
      name_nl: form.name_nl.trim(),
      name_en: form.name_en.trim(),
      description_nl: form.description_nl.trim(),
      description_en: form.description_en.trim(),
      price: effectivePrice,
      has_sizes: form.has_sizes,
      price_regular: form.has_sizes ? regularNum : null,
      price_large: form.has_sizes ? largeNum : null,
      extras,
      available_at,
      sold_out: form.sold_out,
      hidden: form.hidden,
      image_url: form.image_url,
    }

    setSaving(true)
    try {
      const res = await fetch(
        isNew ? '/api/admin/menu/products' : `/api/admin/menu/products/${product!.id}`,
        {
          method: isNew ? 'POST' : 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      )
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Save failed')
      }
      toast.success(isNew ? 'Product added' : 'Product saved')
      onSaved()
      onClose()
    } catch (err: any) {
      toast.error(err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const inputCls =
    'w-full px-3 py-2 border border-gray-300 rounded font-lato text-sm focus:border-tomato focus:ring-1 focus:ring-tomato outline-none'
  const labelCls = 'block font-oswald uppercase text-xs text-gray-500 mb-1 tracking-wider'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto z-10"
      >
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="font-oswald text-xl uppercase tracking-wider text-espresso">
            {isNew ? 'New product' : `Edit — ${product!.name_en}`}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-espresso transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Foto */}
          <div>
            <label className={labelCls}>Photo</label>
            <div className="flex items-center gap-4">
              <div className="relative w-32 h-24 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                {form.image_url ? (
                  <Image src={form.image_url} alt="" fill className="object-cover" sizes="128px" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-gray-300" />
                )}
              </div>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg font-oswald uppercase text-xs tracking-wider text-espresso hover:border-tomato transition disabled:opacity-50"
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {form.image_url ? 'Replace photo' : 'Upload photo'}
                </button>
                {form.image_url && (
                  <button
                    type="button"
                    onClick={() => set('image_url', null)}
                    className="block text-xs text-gray-400 hover:text-red-600 font-lato transition"
                  >
                    Remove photo
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) handleImageSelect(f)
                  e.target.value = ''
                }}
              />
            </div>
          </div>

          {/* Namen */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Name (Nederlands)</label>
              <input type="text" value={form.name_nl} onChange={(e) => set('name_nl', e.target.value)} className={inputCls} placeholder="Bijv. Mortadella Original" />
            </div>
            <div>
              <label className={labelCls}>Name (English)</label>
              <input type="text" value={form.name_en} onChange={(e) => set('name_en', e.target.value)} className={inputCls} placeholder="E.g. Mortadella Original" />
            </div>
          </div>

          {/* Beschrijvingen */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Description (Nederlands)</label>
              <textarea rows={3} value={form.description_nl} onChange={(e) => set('description_nl', e.target.value)} className={inputCls} placeholder="Ingrediënten…" />
            </div>
            <div>
              <label className={labelCls}>Description (English)</label>
              <textarea rows={3} value={form.description_en} onChange={(e) => set('description_en', e.target.value)} className={inputCls} placeholder="Ingredients…" />
            </div>
          </div>

          {/* Categorie */}
          <div>
            <label className={labelCls}>Category</label>
            <select value={form.category_id} onChange={(e) => set('category_id', e.target.value)} className={inputCls}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name_en} ({c.menu === 'schiacciata' ? 'Schiacciata' : 'To-Go'})
                </option>
              ))}
            </select>
          </div>

          {/* Prijzen */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer mb-3">
              <input
                type="checkbox"
                checked={form.has_sizes}
                onChange={(e) => set('has_sizes', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-tomato focus:ring-tomato cursor-pointer"
              />
              <span className="font-oswald uppercase text-xs text-gray-600 tracking-wider">Two sizes (Regular / Large)</span>
            </label>
            {form.has_sizes ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Price Regular (€)</label>
                  <input type="number" min={0} step={0.5} value={form.price_regular} onChange={(e) => set('price_regular', e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Price Large (€)</label>
                  <input type="number" min={0} step={0.5} value={form.price_large} onChange={(e) => set('price_large', e.target.value)} className={inputCls} />
                </div>
              </div>
            ) : (
              <div className="w-40">
                <label className={labelCls}>Price (€)</label>
                <input type="number" min={0} step={0.5} value={form.price} onChange={(e) => set('price', e.target.value)} className={inputCls} />
              </div>
            )}
          </div>

          {/* Extra's */}
          <div>
            <label className={labelCls}>Extras (optional add-ons)</label>
            <ExtrasEditor extras={form.extras} onChange={(extras) => set('extras', extras)} />
          </div>

          {/* Locaties */}
          <div>
            <label className={labelCls}>Available at</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.available_original} onChange={(e) => set('available_original', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-tomato focus:ring-tomato cursor-pointer" />
                <span className="font-lato text-sm text-espresso">Panificio (Vijzelstraat)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.available_express} onChange={(e) => set('available_express', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-tomato focus:ring-tomato cursor-pointer" />
                <span className="font-lato text-sm text-espresso">Xpress (Heisteeg)</span>
              </label>
            </div>
          </div>

          {/* Status */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.sold_out} onChange={(e) => set('sold_out', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-tomato focus:ring-tomato cursor-pointer" />
              <span className="font-lato text-sm text-espresso">Sold out today</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.hidden} onChange={(e) => set('hidden', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-tomato focus:ring-tomato cursor-pointer" />
              <span className="font-lato text-sm text-espresso">Hidden from menu</span>
            </label>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 border border-gray-300 rounded-lg font-oswald uppercase text-sm tracking-wider text-gray-600 hover:border-gray-400 transition">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || uploading}
            className="flex items-center gap-2 px-6 py-2.5 bg-tomato text-white rounded-lg font-oswald uppercase text-sm tracking-wider hover:bg-red-700 transition disabled:opacity-50"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {isNew ? 'Add product' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
