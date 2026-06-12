'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react'
import {
  DEFAULT_LOCATION,
  getLocation,
  getOtherLocation,
  isValidLocationId,
  LocationId,
  RestaurantLocation,
} from '@/lib/data/locations'

const STORAGE_KEY = 'wnb-location'

/**
 * Fases van de cinematografische switch:
 * idle → covering (overlay dekt scherm) → switching (content swapt
 * achter de overlay) → revealing (overlay wijkt) → idle
 */
export type TransitionPhase = 'idle' | 'covering' | 'switching' | 'revealing'

interface LocationContextType {
  locationId: LocationId
  location: RestaurantLocation
  otherLocation: RestaurantLocation
  isExpress: boolean
  /** Start de cinematografische switch naar het andere/gegeven filiaal */
  switchLocation: (target?: LocationId) => void
  /** Transitie-state voor de overlay-component */
  phase: TransitionPhase
  /** Het filiaal waar we naartoe onderweg zijn (tijdens transitie) */
  pendingId: LocationId | null
  /** Door de overlay aangeroepen zodra het scherm volledig bedekt is */
  commitSwitch: () => void
  /** Door de overlay aangeroepen zodra de reveal klaar is */
  finishSwitch: () => void
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined
)

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function LocationProvider({ children }: { children: ReactNode }) {
  const [locationId, setLocationId] = useState<LocationId>(DEFAULT_LOCATION)
  const [phase, setPhase] = useState<TransitionPhase>('idle')
  const [pendingId, setPendingId] = useState<LocationId | null>(null)
  const hydrated = useRef(false)

  // Init: URL-param wint van localStorage, zodat links deelbaar zijn
  useEffect(() => {
    if (hydrated.current) return
    hydrated.current = true
    const param = new URLSearchParams(window.location.search).get('loc')
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (isValidLocationId(param)) {
      setLocationId(param)
    } else if (isValidLocationId(stored)) {
      setLocationId(stored)
    }
  }, [])

  // Theming + persistence bij elke wissel
  useEffect(() => {
    document.documentElement.dataset.location = locationId
    window.localStorage.setItem(STORAGE_KEY, locationId)
    // URL-param sync zonder navigatie (alleen op public pages relevant)
    const url = new URL(window.location.href)
    if (locationId === DEFAULT_LOCATION) {
      url.searchParams.delete('loc')
    } else {
      url.searchParams.set('loc', locationId)
    }
    window.history.replaceState(window.history.state, '', url)
  }, [locationId])

  const switchLocation = useCallback(
    (target?: LocationId) => {
      const next = target ?? (locationId === 'original' ? 'express' : 'original')
      if (next === locationId || phase !== 'idle') return

      if (prefersReducedMotion()) {
        // Geen cinematografie — directe, rustige swap
        setLocationId(next)
        return
      }
      setPendingId(next)
      setPhase('covering')
    },
    [locationId, phase]
  )

  // Overlay meldt: scherm is bedekt → swap de daadwerkelijke content
  const commitSwitch = useCallback(() => {
    setPhase('switching')
    if (pendingId) setLocationId(pendingId)
    // Na de swap kort vasthouden zodat de bestemming leesbaar is,
    // daarna de reveal starten. Timing leeft in de overlay zelf;
    // hier alleen de fase doorzetten.
    requestAnimationFrame(() => setPhase('revealing'))
  }, [pendingId])

  const finishSwitch = useCallback(() => {
    setPhase('idle')
    setPendingId(null)
  }, [])

  return (
    <LocationContext.Provider
      value={{
        locationId,
        location: getLocation(locationId),
        otherLocation: getOtherLocation(locationId),
        isExpress: locationId === 'express',
        switchLocation,
        phase,
        pendingId,
        commitSwitch,
        finishSwitch,
      }}
    >
      {children}
    </LocationContext.Provider>
  )
}

export function useLocation() {
  const ctx = useContext(LocationContext)
  if (!ctx) {
    throw new Error('useLocation must be used within a LocationProvider')
  }
  return ctx
}
