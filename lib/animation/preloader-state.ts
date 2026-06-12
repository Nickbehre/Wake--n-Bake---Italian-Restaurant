// Gedeelde preloader-staat zodat hero-entrances exact aansluiten
// op het moment dat het preloader-doek oplicht — ongeacht de
// volgorde waarin componenten mounten.

const SESSION_KEY = 'wnb-preloader-shown'

/** Seconden totdat de hero mag starten als de preloader draait */
export const PRELOADER_HOLD = 1.9

const state = { willShow: null as boolean | null }

/** Eerste aanroep beslist (en cachet) of de preloader deze sessie toont. */
export function preloaderWillShow(): boolean {
  if (state.willShow !== null) return state.willShow
  if (typeof window === 'undefined') return false
  const alreadyShown = window.sessionStorage.getItem(SESSION_KEY)
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  state.willShow = !alreadyShown && !reduced
  return state.willShow
}

export function markPreloaderShown() {
  window.sessionStorage.setItem(SESSION_KEY, '1')
}

/** Aanroepen zodra het doek weg is: latere mounts wachten niet meer. */
export function markPreloaderDone() {
  state.willShow = false
}

/** Vertraging voor entrance-animaties die met de preloader moeten wachten. */
export function heroDelay(): number {
  return preloaderWillShow() ? PRELOADER_HOLD : 0.15
}
