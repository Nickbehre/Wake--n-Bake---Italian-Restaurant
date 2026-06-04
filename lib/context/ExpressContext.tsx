'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface ExpressContextType {
  isExpress: boolean
  setExpress: (value: boolean) => void
  toggleExpress: () => void
}

const ExpressContext = createContext<ExpressContextType | undefined>(undefined)

function applyExpressAttribute(value: boolean) {
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.express = value ? 'true' : 'false'
  }
}

export function ExpressProvider({ children }: { children: ReactNode }) {
  const [isExpress, setIsExpressState] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('expressMode')
    const initial = saved === 'true'
    setIsExpressState(initial)
    applyExpressAttribute(initial)
  }, [])

  const setExpress = (value: boolean) => {
    setIsExpressState(value)
    localStorage.setItem('expressMode', value ? 'true' : 'false')
    applyExpressAttribute(value)
  }

  const toggleExpress = () => setExpress(!isExpress)

  const contextValue: ExpressContextType = {
    isExpress: mounted ? isExpress : false,
    setExpress,
    toggleExpress,
  }

  return (
    <ExpressContext.Provider value={contextValue}>
      {children}
    </ExpressContext.Provider>
  )
}

export function useExpress() {
  const context = useContext(ExpressContext)
  if (context === undefined) {
    throw new Error('useExpress must be used within an ExpressProvider')
  }
  return context
}
