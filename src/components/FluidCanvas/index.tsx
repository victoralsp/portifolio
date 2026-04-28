'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { FluidSimulation } from './FluidSimulation'

// Set raw sRGB floats directly to bypass Three.js linear color management
const inkColor = new THREE.Color()
inkColor.r = 242 / 255
inkColor.g = 242 / 255
inkColor.b = 255 / 255

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
  inkColor,
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
