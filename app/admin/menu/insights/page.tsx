'use client'

import { useEffect, useState } from 'react'
import { TrendingUp } from 'lucide-react'

interface BestSeller {
  productId: string
  name: string
  quantity: number
  revenue: number
}

interface InsightsData {
  days: number
  location: string
  orderCount: number
  totalRevenue: number
  bestSellers: BestSeller[]
}

const RANGES = [7, 30, 90]
const LOCATIONS = [
  { value: 'all', label: 'All locations' },
  { value: 'original', label: 'Panificio (Vijzelstraat)' },
  { value: 'express', label: 'Xpress (Heisteeg)' },
]

export default function MenuInsightsPage() {
  const [days, setDays] = useState(30)
  const [location, setLocation] = useState('all')
  const [data, setData] = useState<InsightsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/admin/menu/insights?days=${days}&location=${location}`)
      .then((res) => res.json())
      .then((d) => setData(d))
      .finally(() => setLoading(false))
  }, [days, location])

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-oswald text-3xl uppercase tracking-wider text-espresso">Insights</h1>
        <p className="text-gray-500 font-lato mt-1">Best sellers based on your orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1 bg-white border border-gray-200 rounded-lg p-1">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setDays(r)}
              className={`px-4 py-1.5 rounded-md font-oswald uppercase text-xs tracking-wider transition ${
                days === r ? 'bg-espresso text-white' : 'text-espresso/60 hover:text-espresso'
              }`}
            >
              {r} days
            </button>
          ))}
        </div>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg font-lato text-sm bg-white focus:border-tomato outline-none"
        >
          {LOCATIONS.map((l) => (
            <option key={l.value} value={l.value}>{l.label}</option>
          ))}
        </select>
      </div>

      {location !== 'all' && (
        <p className="text-xs text-gray-400 font-lato">
          Note: orders placed before the location field was added count under “All locations” only.
        </p>
      )}

      {loading || !data ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin w-8 h-8 border-2 border-tomato border-t-transparent rounded-full" />
        </div>
      ) : (
        <>
          {/* Totalen */}
          <div className="grid grid-cols-2 gap-4 max-w-md">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
              <p className="font-oswald uppercase text-xs text-gray-400 tracking-wider mb-1">Orders</p>
              <p className="font-oswald text-3xl text-espresso">{data.orderCount}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
              <p className="font-oswald uppercase text-xs text-gray-400 tracking-wider mb-1">Revenue</p>
              <p className="font-oswald text-3xl text-espresso">€{data.totalRevenue.toFixed(2)}</p>
            </div>
          </div>

          {/* Best sellers */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
              <TrendingUp className="w-5 h-5 text-tomato" />
              <h2 className="font-oswald text-lg uppercase tracking-wider text-espresso">Best sellers</h2>
            </div>
            {data.bestSellers.length === 0 ? (
              <p className="px-5 py-8 text-sm text-gray-400 font-lato">No orders in this period yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 font-oswald uppercase text-xs tracking-wider">
                    <th className="px-5 py-3 w-10">#</th>
                    <th className="px-3 py-3">Product</th>
                    <th className="px-3 py-3 text-right">Sold</th>
                    <th className="px-5 py-3 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 font-lato">
                  {data.bestSellers.map((item, i) => (
                    <tr key={item.productId} className={i < 3 ? 'bg-amber-50/40' : ''}>
                      <td className="px-5 py-3 text-gray-400">{i + 1}</td>
                      <td className="px-3 py-3 text-espresso">{item.name}</td>
                      <td className="px-3 py-3 text-right font-semibold text-espresso">{item.quantity}×</td>
                      <td className="px-5 py-3 text-right text-espresso">€{item.revenue.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  )
}
