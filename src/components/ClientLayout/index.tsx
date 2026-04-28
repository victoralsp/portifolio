'use client'

import { useState } from 'react'
import { Loading } from '@/components/Loading'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [heroVisible, setHeroVisible] = useState(false)

  return (
    <>
      <Loading
        onEnter={() => setHeroVisible(true)}
        onLeave={() => setHeroVisible(false)}
      />
      <div style={{ visibility: heroVisible ? 'visible' : 'hidden' }}>
        {children}
      </div>
    </>
  )
}
