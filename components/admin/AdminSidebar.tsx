'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ClipboardList, Settings, LogOut, ChefHat, UtensilsCrossed } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface NavBadges {
  orders: number
  catering: number
}

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [badges, setBadges] = useState<NavBadges>({ orders: 0, catering: 0 })

  useEffect(() => {
    fetchBadges()

    const channel = supabase
      .channel('sidebar-badges')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => fetchBadges())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_requests' }, () => fetchBadges())
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  async function fetchBadges() {
    // Use Dutch timezone for correct "today" filter
    const dutchDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Amsterdam' }).format(new Date())
    const ref = new Date(`${dutchDate}T12:00:00Z`)
    const amsterdamHour = parseInt(new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Amsterdam', hour: 'numeric', hour12: false }).format(ref))
    const offsetHours = amsterdamHour - 12
    const startOfDay = new Date(new Date(`${dutchDate}T00:00:00Z`).getTime() - offsetHours * 3600000).toISOString()

    const [ordersRes, cateringRes] = await Promise.all([
      supabase
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .in('status', ['pending', 'confirmed', 'preparing'])
        .gte('created_at', startOfDay),
      supabase
        .from('contact_requests')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'new'),
    ])

    setBadges({
      orders: ordersRes.count || 0,
      catering: cateringRes.count || 0,
    })
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, badge: 0 },
    { href: '/admin/orders', label: 'Orders', icon: ClipboardList, badge: badges.orders },
    { href: '/admin/catering', label: 'Catering', icon: UtensilsCrossed, badge: badges.catering },
    { href: '/admin/settings', label: 'Settings', icon: Settings, badge: 0 },
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className="w-64 bg-espresso text-white flex flex-col min-h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-3">
          <img
            src="/assets/logo.png"
            alt="Wake N' Bake"
            className="w-10 h-10 object-contain"
          />
          <div>
            <h1 className="font-oswald text-lg uppercase tracking-wider">Wake N&apos; Bake</h1>
            <p className="text-xs text-white/50 font-lato">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/admin' && pathname.startsWith(item.href))
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-oswald uppercase text-sm tracking-wider transition-all ${
                isActive
                  ? 'bg-tomato text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
              {item.badge > 0 && (
                <span className={`ml-auto text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ${
                  isActive ? 'bg-white text-tomato' : 'bg-tomato text-white'
                }`}>
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-2 text-white/50 hover:text-white text-sm font-lato transition"
        >
          <ChefHat className="w-4 h-4" />
          Go to website
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 text-white/50 hover:text-red-400 text-sm font-lato transition w-full"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>
    </aside>
  )
}
