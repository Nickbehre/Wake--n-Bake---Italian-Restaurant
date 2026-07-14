'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import {
  Plus, Pencil, Trash2, ChevronUp, ChevronDown, ChevronRight,
  EyeOff, ImageIcon, Loader2, FolderPlus, Check, X,
} from 'lucide-react'
import { toast } from 'sonner'
import ProductEditModal from '@/components/admin/ProductEditModal'
import type { DbCategory, DbProduct, MenuCategoryPayload } from '@/lib/data/menu-types'

type Tab = 'schiacciata' | 'togo'

export default function AdminMenuPage() {
  const [categories, setCategories] = useState<MenuCategoryPayload[] | null>(null)
  const [tab, setTab] = useState<Tab>('schiacciata')
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())
  const [editingProduct, setEditingProduct] = useState<DbProduct | null>(null)
  const [addingToCategory, setAddingToCategory] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  // Categorie-editor (inline)
  const [editingCategory, setEditingCategory] = useState<DbCategory | null>(null)
  const [addingCategory, setAddingCategory] = useState(false)
  const [catNameNl, setCatNameNl] = useState('')
  const [catNameEn, setCatNameEn] = useState('')

  const fetchMenu = useCallback(async () => {
    const res = await fetch('/api/admin/menu/products')
    if (!res.ok) {
      toast.error('Could not load menu')
      return
    }
    const data = await res.json()
    setCategories(data.categories)
  }, [])

  useEffect(() => { fetchMenu() }, [fetchMenu])

  const visibleCategories = (categories ?? []).filter((c) => c.menu === tab)
  const allCategories: DbCategory[] = categories ?? []

  /** Optimistische deelupdate van een product */
  async function patchProduct(id: string, patch: Partial<DbProduct>, successMsg: string) {
    setCategories((prev) =>
      prev?.map((c) => ({
        ...c,
        products: c.products.map((p) => (p.id === id ? { ...p, ...patch } : p)),
      })) ?? null
    )
    const res = await fetch(`/api/admin/menu/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
    if (res.ok) {
      toast.success(successMsg)
    } else {
      toast.error('Update failed')
      fetchMenu()
    }
  }

  async function deleteProduct(product: DbProduct) {
    if (!confirm(`Delete "${product.name_en}"? This cannot be undone.`)) return
    const res = await fetch(`/api/admin/menu/products/${product.id}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success('Product deleted')
      fetchMenu()
    } else {
      toast.error('Delete failed')
    }
  }

  async function moveProduct(category: MenuCategoryPayload, index: number, direction: -1 | 1) {
    const ids = category.products.map((p) => p.id)
    const target = index + direction
    if (target < 0 || target >= ids.length) return
    ;[ids[index], ids[target]] = [ids[target], ids[index]]
    // Optimistisch herschikken
    setCategories((prev) =>
      prev?.map((c) =>
        c.id === category.id
          ? { ...c, products: ids.map((id) => c.products.find((p) => p.id === id)!) }
          : c
      ) ?? null
    )
    const res = await fetch('/api/admin/menu/reorder', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'products', ids }),
    })
    if (!res.ok) { toast.error('Reorder failed'); fetchMenu() }
  }

  async function moveCategory(index: number, direction: -1 | 1) {
    // Volgorde binnen het hele menu (beide tabs delen sort_order-ruimte)
    const ids = (categories ?? []).map((c) => c.id)
    const visibleIds = visibleCategories.map((c) => c.id)
    const a = visibleIds[index]
    const b = visibleIds[index + direction]
    if (!a || !b) return
    const ai = ids.indexOf(a)
    const bi = ids.indexOf(b)
    ;[ids[ai], ids[bi]] = [ids[bi], ids[ai]]
    setCategories((prev) => {
      if (!prev) return prev
      const byId = new Map(prev.map((c) => [c.id, c]))
      return ids.map((id) => byId.get(id)!)
    })
    const res = await fetch('/api/admin/menu/reorder', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'categories', ids }),
    })
    if (!res.ok) { toast.error('Reorder failed'); fetchMenu() }
  }

  async function saveCategory() {
    if (!catNameNl.trim() || !catNameEn.trim()) {
      toast.error('Both names are required')
      return
    }
    const isNew = !editingCategory
    const res = await fetch(
      isNew ? '/api/admin/menu/categories' : `/api/admin/menu/categories/${editingCategory!.id}`,
      {
        method: isNew ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          isNew
            ? { name_nl: catNameNl.trim(), name_en: catNameEn.trim(), menu: tab, available_at: null }
            : { name_nl: catNameNl.trim(), name_en: catNameEn.trim() }
        ),
      }
    )
    if (res.ok) {
      toast.success(isNew ? 'Category added' : 'Category renamed')
      setAddingCategory(false)
      setEditingCategory(null)
      fetchMenu()
    } else {
      toast.error('Save failed')
    }
  }

  async function deleteCategory(category: DbCategory) {
    if (!confirm(`Delete category "${category.name_en}"?`)) return
    const res = await fetch(`/api/admin/menu/categories/${category.id}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success('Category deleted')
      fetchMenu()
    } else if (res.status === 409) {
      toast.error('Category is not empty — move or delete its products first')
    } else {
      toast.error('Delete failed')
    }
  }

  function toggleCollapsed(id: string) {
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  if (categories === null) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-tomato border-t-transparent rounded-full" />
      </div>
    )
  }

  const categoryForm = (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex flex-wrap items-end gap-3">
      <div>
        <label className="block font-oswald uppercase text-xs text-gray-500 mb-1 tracking-wider">Name (NL)</label>
        <input value={catNameNl} onChange={(e) => setCatNameNl(e.target.value)} className="px-3 py-2 border border-gray-300 rounded font-lato text-sm focus:border-tomato outline-none" placeholder="Bijv. Focaccia" />
      </div>
      <div>
        <label className="block font-oswald uppercase text-xs text-gray-500 mb-1 tracking-wider">Name (EN)</label>
        <input value={catNameEn} onChange={(e) => setCatNameEn(e.target.value)} className="px-3 py-2 border border-gray-300 rounded font-lato text-sm focus:border-tomato outline-none" placeholder="E.g. Focaccia" />
      </div>
      <button onClick={saveCategory} className="flex items-center gap-1.5 px-4 py-2 bg-tomato text-white rounded-lg font-oswald uppercase text-xs tracking-wider hover:bg-red-700 transition">
        <Check className="w-4 h-4" /> Save
      </button>
      <button onClick={() => { setAddingCategory(false); setEditingCategory(null) }} className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-lg font-oswald uppercase text-xs tracking-wider text-gray-500 hover:border-gray-400 transition">
        <X className="w-4 h-4" /> Cancel
      </button>
    </div>
  )

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-oswald text-3xl uppercase tracking-wider text-espresso">Menu</h1>
          <p className="text-gray-500 font-lato mt-1">
            Manage products, prices, photos and availability — changes are live immediately
          </p>
        </div>
        <button
          onClick={() => { setEditingCategory(null); setCatNameNl(''); setCatNameEn(''); setAddingCategory(true) }}
          className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg font-oswald uppercase text-sm tracking-wider text-espresso hover:border-tomato transition"
        >
          <FolderPlus className="w-4 h-4" /> New category
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(['schiacciata', 'togo'] as Tab[]).map((m) => (
          <button
            key={m}
            onClick={() => setTab(m)}
            className={`px-5 py-2.5 rounded-lg font-oswald uppercase text-sm tracking-wider transition ${
              tab === m ? 'bg-espresso text-white shadow' : 'bg-white text-espresso/60 border border-gray-200 hover:border-espresso/30'
            }`}
          >
            {m === 'schiacciata' ? 'Schiacciata' : 'To-Go'}
          </button>
        ))}
      </div>

      {addingCategory && categoryForm}

      {/* Categorieën */}
      {visibleCategories.map((category, catIndex) => {
        const isCollapsed = collapsed.has(category.id)
        const isEditingThis = editingCategory?.id === category.id
        return (
          <div key={category.id} className="bg-white rounded-lg shadow-sm border border-gray-100">
            {/* Categorie-header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
              <button onClick={() => toggleCollapsed(category.id)} className="p-1 text-gray-400 hover:text-espresso transition">
                {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              <div className="flex-1 min-w-0">
                <span className="font-oswald text-lg uppercase tracking-wider text-espresso">{category.name_en}</span>
                {category.name_nl !== category.name_en && (
                  <span className="ml-2 text-sm text-gray-400 font-lato">/ {category.name_nl}</span>
                )}
                <span className="ml-3 text-xs text-gray-400 font-lato">{category.products.length} products</span>
                {category.available_at && (
                  <span className="ml-2 text-[10px] font-oswald uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2 py-0.5">
                    {category.available_at.join(' + ')} only
                  </span>
                )}
              </div>
              <button onClick={() => moveCategory(catIndex, -1)} disabled={catIndex === 0} className="p-1.5 text-gray-400 hover:text-espresso disabled:opacity-20 transition" title="Move up">
                <ChevronUp className="w-4 h-4" />
              </button>
              <button onClick={() => moveCategory(catIndex, 1)} disabled={catIndex === visibleCategories.length - 1} className="p-1.5 text-gray-400 hover:text-espresso disabled:opacity-20 transition" title="Move down">
                <ChevronDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => { setAddingCategory(false); setEditingCategory(category); setCatNameNl(category.name_nl); setCatNameEn(category.name_en) }}
                className="p-1.5 text-gray-400 hover:text-espresso transition" title="Rename"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => deleteCategory(category)} className="p-1.5 text-gray-400 hover:text-red-600 transition" title="Delete category">
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => { setEditingProduct(null); setAddingToCategory(category.id); setModalOpen(true) }}
                className="ml-2 flex items-center gap-1.5 px-3 py-1.5 bg-tomato text-white rounded-lg font-oswald uppercase text-xs tracking-wider hover:bg-red-700 transition"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>

            {isEditingThis && <div className="px-4 pt-3">{categoryForm}</div>}

            {/* Producten */}
            {!isCollapsed && (
              <div className="divide-y divide-gray-50">
                {category.products.length === 0 && (
                  <p className="px-4 py-6 text-sm text-gray-400 font-lato">No products yet — click “Add”.</p>
                )}
                {category.products.map((product, i) => (
                  <div key={product.id} className={`flex items-center gap-3 px-4 py-2.5 ${product.hidden ? 'opacity-50' : ''}`}>
                    {/* Thumbnail */}
                    <div className="relative w-14 h-11 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                      {product.image_url ? (
                        <Image src={product.image_url} alt="" fill className="object-cover" sizes="56px" />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-gray-300" />
                      )}
                    </div>
                    {/* Naam + prijs */}
                    <div className="flex-1 min-w-0">
                      <p className="font-oswald text-sm uppercase tracking-wide text-espresso truncate">
                        {product.name_en}
                        {product.hidden && <EyeOff className="inline w-3.5 h-3.5 ml-1.5 text-gray-400" />}
                      </p>
                      <p className="text-xs text-gray-400 font-lato">
                        {product.has_sizes && product.price_regular != null && product.price_large != null
                          ? `€${Number(product.price_regular).toFixed(2)} | €${Number(product.price_large).toFixed(2)}`
                          : `€${Number(product.price).toFixed(2)}`}
                        {product.extras?.length ? ` · ${product.extras.length} extras` : ''}
                        {product.available_at ? ` · ${product.available_at.join(' + ')} only` : ''}
                      </p>
                    </div>
                    {/* Sold out toggle */}
                    <button
                      onClick={() => patchProduct(product.id, { sold_out: !product.sold_out }, product.sold_out ? 'Back in stock' : 'Marked sold out')}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-oswald font-bold uppercase tracking-wider transition ${
                        product.sold_out
                          ? 'bg-red-100 text-red-700 border border-red-200'
                          : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                      }`}
                      title="Toggle sold out"
                    >
                      {product.sold_out ? 'Sold out' : 'In stock'}
                    </button>
                    {/* Hide toggle */}
                    <button
                      onClick={() => patchProduct(product.id, { hidden: !product.hidden }, product.hidden ? 'Product visible' : 'Product hidden')}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-oswald font-bold uppercase tracking-wider transition ${
                        product.hidden
                          ? 'bg-gray-200 text-gray-600'
                          : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-400'
                      }`}
                      title="Show/hide on menu"
                    >
                      {product.hidden ? 'Hidden' : 'Visible'}
                    </button>
                    {/* Reorder */}
                    <button onClick={() => moveProduct(category, i, -1)} disabled={i === 0} className="p-1 text-gray-300 hover:text-espresso disabled:opacity-20 transition">
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button onClick={() => moveProduct(category, i, 1)} disabled={i === category.products.length - 1} className="p-1 text-gray-300 hover:text-espresso disabled:opacity-20 transition">
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    {/* Edit / delete */}
                    <button onClick={() => { setEditingProduct(product); setAddingToCategory(null); setModalOpen(true) }} className="p-1.5 text-gray-400 hover:text-espresso transition" title="Edit">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteProduct(product)} className="p-1.5 text-gray-400 hover:text-red-600 transition" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}

      {modalOpen && (
        <ProductEditModal
          product={editingProduct}
          categories={allCategories}
          defaultCategoryId={addingToCategory ?? undefined}
          onClose={() => setModalOpen(false)}
          onSaved={fetchMenu}
        />
      )}
    </div>
  )
}
