'use client'

import { usePathname } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Toaster } from 'sonner'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  if (isLoginPage) {
    return (
      <>
        {children}
        <Toaster position="bottom-right" />
      </>
    )
  }

  return (
    // Mobiel: kolom (topbar boven content); desktop: rij (sidebar naast content)
    <div className="flex flex-col lg:flex-row h-screen bg-flour text-espresso">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
      <Toaster position="bottom-right" />
    </div>
  )
}
