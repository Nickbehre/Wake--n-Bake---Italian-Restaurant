'use client'

import { Plus, Trash2 } from 'lucide-react'
import type { ProductExtra } from '@/lib/types/order'

interface ExtrasEditorProps {
  extras: ProductExtra[]
  onChange: (extras: ProductExtra[]) => void
}

/** Editor voor extra's (bv. "Oat Milk +€0.50") in het productformulier. */
export default function ExtrasEditor({ extras, onChange }: ExtrasEditorProps) {
  function update(index: number, field: keyof ProductExtra, value: string | number) {
    const next = extras.map((e, i) => (i === index ? { ...e, [field]: value } : e))
    onChange(next)
  }

  function add() {
    // id wordt bij opslaan afgeleid van de naam (ProductEditModal)
    onChange([...extras, { id: '', name: '', price: 0.5 }])
  }

  function remove(index: number) {
    onChange(extras.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-2">
      {extras.map((extra, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="text"
            value={extra.name}
            onChange={(e) => update(i, 'name', e.target.value)}
            placeholder="E.g. Oat Milk"
            className="flex-1 px-3 py-2 border border-gray-300 rounded font-lato text-sm focus:border-tomato focus:ring-1 focus:ring-tomato outline-none"
          />
          <div className="flex items-center gap-1">
            <span className="text-gray-400 text-sm">+€</span>
            <input
              type="number"
              min={0}
              step={0.05}
              value={extra.price}
              onChange={(e) => update(i, 'price', parseFloat(e.target.value) || 0)}
              className="w-20 px-2 py-2 border border-gray-300 rounded font-lato text-sm focus:border-tomato outline-none"
            />
          </div>
          <button
            type="button"
            onClick={() => remove(i)}
            className="p-2 text-gray-400 hover:text-red-600 transition"
            title="Remove extra"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="flex items-center gap-1.5 text-sm font-oswald uppercase tracking-wider text-tomato hover:text-red-700 transition"
      >
        <Plus className="w-4 h-4" /> Add extra
      </button>
    </div>
  )
}
