'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { FluidSimulation } from './FluidSimulation'

const config = {
  simResolution: 256,
  dyeResolution: 1024,
  curl: 25,
  pressureIterations: 50,
  velocityDissipation: 0.95,
  dyeDissipation: 0.95,
  splatRadius: 0.275,
  forceStrength: 7.5,
  pressureDecay: 0.75,
  threshold: 1.0,
  edgeSoftness: 0.0,
  inkColor: new THREE.Color(0xe8e8f0),
}

export function FluidCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    const sim = new FluidSimulation(canvasRef.current, config)
    return () => sim.destroy()
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 100,
        mixBlendMode: 'difference',
      }}
    />
  )
}
