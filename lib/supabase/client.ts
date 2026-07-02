import { createBrowserClient } from "@supabase/ssr"

// Placeholder-fallbacks zodat de build niet crasht wanneer de Supabase-env
// nog niet is ingesteld (alleen de admin-pagina's gebruiken deze client).
// Zodra NEXT_PUBLIC_SUPABASE_* in Vercel staan, worden de echte waarden gebruikt.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ?? "placeholder-anon-key"
  )
}
