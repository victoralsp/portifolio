'use client'

import { useState } from 'react'
import { Loading } from '@/components/Loading'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <>
      {!isLoaded && <Loading onComplete={() => setIsLoaded(true)} />}
      <div style={{ visibility: isLoaded ? 'visible' : 'hidden' }}>
        {children}
      </div>
    </>
  )
}
