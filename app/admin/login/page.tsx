'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError('Ongeldige inloggegevens')
      setLoading(false)
    } else {
      router.push('/admin')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-flour flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img
            src="/assets/logo.png"
            alt="Wake N' Bake"
            className="w-20 h-20 mx-auto mb-4 object-contain"
          />
          <h1 className="font-oswald text-2xl uppercase tracking-wider text-espresso">
            Admin Panel
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-lato">
            Wake N&apos; Bake Panificio
          </p>
        </div>

        <form onSubmit={handleLogin} className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <div>
            <label className="block font-oswald uppercase text-xs text-gray-500 mb-1 tracking-wider">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded focus:border-tomato focus:ring-1 focus:ring-tomato outline-none transition font-lato"
              placeholder="info@wakenbake.nl"
              required
            />
          </div>

          <div>
            <label className="block font-oswald uppercase text-xs text-gray-500 mb-1 tracking-wider">
              Wachtwoord
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded focus:border-tomato focus:ring-1 focus:ring-tomato outline-none transition font-lato"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded text-sm border border-red-100">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-tomato text-white rounded font-oswald uppercase tracking-wider hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Inloggen...
              </>
            ) : (
              'Inloggen'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
