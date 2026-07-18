// Amsterdam-tijdzone helpers voor "vandaag"/"deze week" grenzen.
// Werkt in zowel browser als server (geen deps).

/** Datum (YYYY-MM-DD) van `date` in Europe/Amsterdam. */
export function dutchDateString(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Amsterdam' }).format(date)
}

/** UTC-offset (uren) van Amsterdam op de gegeven Amsterdamse datum (1 = CET, 2 = CEST). */
function amsterdamOffsetHours(dutchDate: string): number {
  const ref = new Date(`${dutchDate}T12:00:00Z`)
  const amsterdamHour = parseInt(
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'Europe/Amsterdam',
      hour: 'numeric',
      hour12: false,
    }).format(ref)
  )
  return amsterdamHour - 12
}

/** Begin (00:00) en eind (23:59:59.999) van een Amsterdamse dag, als UTC ISO-strings. */
export function dutchDayBounds(dutchDate: string = dutchDateString()): { start: string; end: string } {
  const offsetMs = amsterdamOffsetHours(dutchDate) * 3600000
  return {
    start: new Date(new Date(`${dutchDate}T00:00:00Z`).getTime() - offsetMs).toISOString(),
    end: new Date(new Date(`${dutchDate}T23:59:59.999Z`).getTime() - offsetMs).toISOString(),
  }
}

/** Bereik van de laatste `days` Amsterdamse dagen t/m vandaag, als UTC ISO-strings. */
export function dutchLastDaysBounds(days: number): { start: string; end: string } {
  const today = dutchDateString()
  const firstDay = dutchDateString(new Date(Date.now() - (days - 1) * 24 * 3600000))
  return {
    start: dutchDayBounds(firstDay).start,
    end: dutchDayBounds(today).end,
  }
}
