'use client'

import { useState, useEffect } from 'react'
import { Loading } from '@/components/Loading'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [heroVisible, setHeroVisible] = useState(false)

  useEffect(() => {
    document.body.style.cursor = heroVisible ? 'auto' : 'none'
  }, [heroVisible])

  return (
    <>
      <Loading
        onEnter={() => setHeroVisible(true)}
        onLeave={() => setHeroVisible(false)}
      />
      <div style={{
        opacity: heroVisible ? 1 : 0,
        transition: heroVisible ? 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
        pointerEvents: heroVisible ? 'auto' : 'none',
      }}>
        {children}
      </div>
    </>
  )
}
