'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ClipboardList, Settings, LogOut, ChefHat, UtensilsCrossed, BookOpen, TrendingUp, Menu as MenuIcon, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { dutchDayBounds } from '@/lib/utils/dutch-time'

interface NavBadges {
  orders: number
  catering: number
}

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [badges, setBadges] = useState<NavBadges>({ orders: 0, catering: 0 })
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    fetchBadges()

    const channel = supabase
      .channel('sidebar-badges')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => fetchBadges())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_requests' }, () => fetchBadges())
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  // Drawer sluiten bij navigatie
  useEffect(() => { setMobileOpen(false) }, [pathname])

  async function fetchBadges() {
    // "Vandaag" in Amsterdamse tijd
    const { start: startOfDay } = dutchDayBounds()

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
    { href: '/admin/menu', label: 'Menu', icon: BookOpen, badge: 0 },
    { href: '/admin/menu/insights', label: 'Insights', icon: TrendingUp, badge: 0 },
    { href: '/admin/catering', label: 'Catering', icon: UtensilsCrossed, badge: badges.catering },
    { href: '/admin/settings', label: 'Settings', icon: Settings, badge: 0 },
  ]

  // Langste passende href wint, zodat /admin/menu/insights alléén Insights
  // oplicht (en niet ook Menu).
  const activeHref = navItems
    .filter((item) => pathname === item.href || pathname.startsWith(item.href + '/'))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const navigation = (
    <nav className="flex-1 p-4 space-y-1">
      {navItems.map((item) => {
        const isActive = item.href === activeHref
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
  )

  const footer = (
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
  )

  const totalBadges = badges.orders + badges.catering

  return (
    <>
      {/* Mobiel: topbar met hamburger */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between bg-espresso text-white px-4 py-3">
        <Link href="/admin" className="flex items-center gap-2.5">
          <img src="/assets/logo.png" alt="Wake N' Bake" className="w-8 h-8 object-contain" />
          <span className="font-oswald text-base uppercase tracking-wider">Wake N&apos; Bake Admin</span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="relative p-2 -mr-1 text-white/80 hover:text-white transition"
          aria-label="Open menu"
        >
          <MenuIcon className="w-6 h-6" />
          {totalBadges > 0 && (
            <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-tomato text-[10px] font-bold flex items-center justify-center">
              {totalBadges > 9 ? '9+' : totalBadges}
            </span>
          )}
        </button>
      </header>

      {/* Mobiel: uitschuifmenu */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-espresso text-white flex flex-col shadow-2xl">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/assets/logo.png" alt="Wake N' Bake" className="w-9 h-9 object-contain" />
                <div>
                  <h1 className="font-oswald text-base uppercase tracking-wider">Wake N&apos; Bake</h1>
                  <p className="text-xs text-white/50 font-lato">Admin Panel</p>
                </div>
              </div>
              <button onClick={() => setMobileOpen(false)} className="p-2 text-white/60 hover:text-white transition" aria-label="Close menu">
                <X className="w-5 h-5" />
              </button>
            </div>
            {navigation}
            {footer}
          </div>
        </div>
      )}

      {/* Desktop: vaste sidebar */}
      <aside className="hidden lg:flex w-64 bg-espresso text-white flex-col min-h-screen">
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
        {navigation}
        {footer}
      </aside>
    </>
  )
}
