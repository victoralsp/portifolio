'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import styles from './styles.module.scss'

gsap.registerPlugin(ScrollTrigger)

interface LoadingProps {
  onEnter: () => void
  onLeave: () => void
}

export function Loading({ onEnter, onLeave }: LoadingProps) {
  const groupRef       = useRef<HTMLDivElement>(null)
  const svgRef         = useRef<SVGSVGElement>(null)
  const pathRef        = useRef<SVGPathElement>(null)
  const loaderRef      = useRef<HTMLDivElement>(null)
  const barTrackRef    = useRef<HTMLDivElement>(null)
  const barFillRef     = useRef<HTMLDivElement>(null)
  const pctRef         = useRef<HTMLDivElement>(null)
  const scrollHintRef  = useRef<HTMLDivElement>(null)
  const scrollSpaceRef = useRef<HTMLDivElement>(null)
  const onEnterRef     = useRef(onEnter)
  const onLeaveRef     = useRef(onLeave)

  useEffect(() => { onEnterRef.current = onEnter })
  useEffect(() => { onLeaveRef.current = onLeave })

  useEffect(() => {
    let lenis: Lenis | null = null
    let rafTicker: ((time: number) => void) | null = null
    const createdEls: HTMLElement[] = []
    let didEnter = false

    document.fonts.load('700 200px "Barlow Condensed"').then(init)

    function init() {
      const vSvg  = svgRef.current
      const vPath = pathRef.current
      if (!vSvg || !vPath || !groupRef.current) return

      // Block scroll during loading
      document.body.style.overflow = 'hidden'

      // Lenis smooth scroll
      lenis = new Lenis({
        duration: 1.4,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 2,
      })
      lenis.stop()
      lenis.on('scroll', () => ScrollTrigger.update())
      rafTicker = (time: number) => lenis?.raf(time * 1000)
      gsap.ticker.add(rafTicker)
      gsap.ticker.lagSmoothing(0)

      const W = window.innerWidth
      const H = window.innerHeight
      const CV = 600
      const FS = 480

      // Extract V glyph contour via canvas
      const cv  = document.createElement('canvas')
      cv.width  = cv.height = CV
      const ctx = cv.getContext('2d')!
      ctx.font         = `700 ${FS}px "Barlow Condensed"`
      ctx.textBaseline = 'alphabetic'
      ctx.fillStyle    = '#fff'
      const m0 = ctx.measureText('V')
      ctx.fillText('V', (CV - m0.width) / 2, CV * 0.80)

      const data = ctx.getImageData(0, 0, CV, CV).data
      const isOn = (px: number, py: number) =>
        px >= 0 && py >= 0 && px < CV && py < CV &&
        data[(py * CV + px) * 4 + 3] > 128

      let gMinX = CV, gMinY = CV, gMaxX = 0, gMaxY = 0
      for (let py = 0; py < CV; py++)
        for (let px = 0; px < CV; px++) {
          if (!isOn(px, py)) continue
          if (px < gMinX) gMinX = px
          if (px > gMaxX) gMaxX = px
          if (py < gMinY) gMinY = py
          if (py > gMaxY) gMaxY = py
        }
      const glyphPxW    = gMaxX - gMinX
      const glyphPxH    = gMaxY - gMinY
      const glyphAspect = glyphPxW / glyphPxH

      // Moore neighborhood contour tracing
      let sx = -1, sy = -1
      outer: for (let py = 0; py < CV; py++)
        for (let px = 0; px < CV; px++)
          if (isOn(px, py) && !isOn(px - 1, py)) { sx = px; sy = py; break outer }

      const DX = [1, 1, 0, -1, -1, -1, 0, 1]
      const DY = [0, 1, 1, 1,  0, -1, -1, -1]
      const contour: [number, number][] = []
      let bx = sx, by = sy, dir = 3, steps = 0
      do {
        contour.push([bx, by])
        for (let i = 0; i < 8; i++) {
          const nd = (dir + 1 + i) % 8
          const nx = bx + DX[nd], ny = by + DY[nd]
          if (isOn(nx, ny)) { dir = (nd + 4) % 8; bx = nx; by = ny; break }
        }
        steps++
      } while ((bx !== sx || by !== sy) && steps < CV * CV)

      // Ramer-Douglas-Peucker simplification
      function rdp(pts: [number, number][], eps: number): [number, number][] {
        if (pts.length <= 2) return pts
        const [x1, y1] = pts[0], [x2, y2] = pts[pts.length - 1]
        const len = Math.hypot(x2 - x1, y2 - y1)
        let maxD = 0, maxI = 0
        for (let i = 1; i < pts.length - 1; i++) {
          const [px, py] = pts[i]
          const d = len === 0
            ? Math.hypot(px - x1, py - y1)
            : Math.abs((y2 - y1) * px - (x2 - x1) * py + x2 * y1 - y2 * x1) / len
          if (d > maxD) { maxD = d; maxI = i }
        }
        if (maxD > eps)
          return [...rdp(pts.slice(0, maxI + 1), eps).slice(0, -1), ...rdp(pts.slice(maxI), eps)]
        return [pts[0], pts[pts.length - 1]]
      }
      const simp = rdp(contour, 1.5)

      let pathD = `M ${(simp[0][0] - gMinX).toFixed(1)},${(simp[0][1] - gMinY).toFixed(1)}`
      for (let i = 1; i < simp.length; i++)
        pathD += ` L ${(simp[i][0] - gMinX).toFixed(1)},${(simp[i][1] - gMinY).toFixed(1)}`
      pathD += ' Z'

      vSvg.setAttribute('viewBox', `0 0 ${glyphPxW} ${glyphPxH}`)
      vPath.setAttribute('d', pathD)

      // Helpers
      const measureText = (text: string, fs: number) => {
        const s = document.createElement('span')
        s.style.cssText = `font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:${fs}px;line-height:1;white-space:nowrap;position:fixed;opacity:0;top:0;left:0;`
        s.textContent = text
        document.body.appendChild(s)
        const r = s.getBoundingClientRect()
        document.body.removeChild(s)
        return { w: r.width, h: r.height }
      }

      const setStroke = (w: number) => {
        vPath.setAttribute('stroke-width', (glyphPxW / w * 1.5).toFixed(2))
      }

      // Initial V size and position
      const loadH = H * 0.22
      const loadW = loadH * glyphAspect

      gsap.set(vSvg, {
        width: loadW, height: loadH,
        x: W / 2 - loadW / 2,
        y: H / 2 - loadH / 2,
      })
      setStroke(loadW)

      barTrackRef.current!.style.width = loadW + 'px'
      gsap.set(loaderRef.current!, { top: H / 2 + loadH / 2 + 52, xPercent: -50 })

      const totalLen = vPath.getTotalLength()
      gsap.set(vPath, { strokeDasharray: totalLen, strokeDashoffset: totalLen })

      let letterEls: HTMLElement[] = []

      // Phase 4: scroll zoom centered on T — bidirectional
      const initScrollZoom = () => {
        document.body.style.overflow = ''
        lenis?.start()

        const tEl      = letterEls[2]
        const tRect    = tEl.getBoundingClientRect()
        const tCenterX = tRect.left + tRect.width  / 2
        const tCenterY = tRect.top  + tRect.height / 2

        const group = groupRef.current!
        group.style.transformOrigin = `${tCenterX}px ${tCenterY}px`
        const maxScale = (W * 35) / (W * 0.85)

        ScrollTrigger.create({
          trigger: scrollSpaceRef.current!,
          start: 'top top',
          end:   'bottom top',
          onUpdate(self) {
            const p = self.progress
            const s = 1 + (maxScale - 1) * Math.pow(p, 3)
            group.style.transform = `scale(${s})`

            // Fade out loading overlay as zoom completes
            const fadeProgress = Math.max(0, (p - 0.9) * 10)
            group.style.opacity = String(1 - fadeProgress)

            // Switch body bg at the start of the fade so dark never shows through
            if (p >= 0.9) {
              document.body.style.backgroundColor = '#e8e8f0'
            } else {
              document.body.style.backgroundColor = '#0a0a0f'
            }

            gsap.set(scrollHintRef.current!, { opacity: Math.max(0, 1 - p * 10) })

            if (p >= 0.99 && !didEnter) {
              didEnter = true
              onEnterRef.current()
            } else if (p < 0.9 && didEnter) {
              didEnter = false
              onLeaveRef.current()
            }
          },
        })
      }

      // Phase 3: scale VICTOR to 85% viewport width
      const scaleUp = (
        fontSize: number,
        _letterEls: HTMLElement[],
        victorW: number,
        vW: number,
        vH: number
      ) => {
        const ratio         = (W * 0.85) / victorW
        const finalFS       = fontSize * ratio
        const targetVW      = vW * ratio
        const targetVH      = vH * ratio
        const targetVictorW = victorW * ratio
        const finalVX       = W / 2 - targetVictorW / 2
        const finalVY       = H / 2 - targetVH / 2

        const LETTERS     = ['I', 'C', 'T', 'O', 'R']
        const newLetterWs = LETTERS.map(l => measureText(l, finalFS).w)
        const newTextBoxH = measureText('I', finalFS).h
        const newLetterY  = finalVY - (newTextBoxH - targetVH) / 2 - targetVH * 0.06

        let curX = finalVX + targetVW
        const newLetterXs = newLetterWs.map(w => { const x = curX; curX += w; return x })

        gsap.timeline({ onComplete: initScrollZoom })
          .to(vSvg, {
            x: finalVX, y: finalVY,
            width: targetVW, height: targetVH,
            duration: 1.6, ease: 'expo.inOut',
            onUpdate() { setStroke(parseFloat(vSvg.style.width) || targetVW) },
          }, 0)
          .to(_letterEls.map((el, i) => gsap.to(el, {
            left: newLetterXs[i], top: newLetterY,
            fontSize: finalFS,
            duration: 1.6, ease: 'expo.inOut',
          })), {}, 0)
          .to(scrollHintRef.current!, { opacity: 1, duration: 0.8 }, 1.4)
      }

      // Phase 2: ICTOR letters appear
      const onLoadDone = () => {
        const fontSize = FS * (loadH / glyphPxH)
        const LETTERS  = ['I', 'C', 'T', 'O', 'R']
        const victorM  = measureText('VICTOR', fontSize)
        const letterWs = LETTERS.map(l => measureText(l, fontSize).w)
        const victorW  = victorM.w
        const vFinalX  = W / 2 - victorW / 2
        const vFinalY  = H / 2 - loadH / 2
        const textBoxH = measureText('I', fontSize).h
        const letterY  = vFinalY - (textBoxH - loadH) / 2 - loadH * 0.06

        const group = groupRef.current!
        let curX = vFinalX + loadW
        letterEls = LETTERS.map((char, i) => {
          const el = document.createElement('span')
          el.className      = styles.lt
          el.textContent    = char
          el.style.fontSize = fontSize + 'px'
          el.style.top      = letterY + 'px'
          el.style.left     = curX + 'px'
          group.appendChild(el)
          createdEls.push(el)
          gsap.set(el, { opacity: 0, y: 28 })
          curX += letterWs[i]
          return el
        })

        gsap.timeline({ delay: 0.2 })
          .to(loaderRef.current!, { opacity: 0, duration: 0.6, ease: 'power2.inOut' }, 0)
          .to(vSvg, { x: vFinalX, y: vFinalY, duration: 1.1, ease: 'expo.inOut' }, 0.15)
          .to(letterEls, { opacity: 1, y: 0, duration: 0.7, ease: 'power4.out', stagger: 0.1 }, 1.2)
          .add(() => scaleUp(fontSize, letterEls, victorW, loadW, loadH), 2.4)
      }

      // Stroke draw + progress bar — starts after all callbacks are declared
      const prog = { v: 0 }
      gsap.to(prog, {
        v: 1,
        duration: 3.5,
        ease: 'power2.inOut',
        onUpdate() {
          const p = prog.v
          vPath.style.strokeDashoffset = String(totalLen * (1 - p))
          barFillRef.current!.style.width = (p * 100).toFixed(1) + '%'
          pctRef.current!.textContent = String(Math.round(p * 100)).padStart(3, '0')
        },
        onComplete: onLoadDone,
      })
    }

    return () => {
      if (rafTicker) gsap.ticker.remove(rafTicker)
      lenis?.destroy()
      ScrollTrigger.getAll().forEach(t => t.kill())
      gsap.killTweensOf('*')
      document.body.style.overflow = ''
      document.body.style.backgroundColor = ''
      createdEls.forEach(el => el.remove())
    }
  }, [])

  return (
    <>
      <div ref={groupRef} className={styles.group}>
        <svg ref={svgRef} className={styles.vSvg} xmlns="http://www.w3.org/2000/svg">
          <path ref={pathRef} className={styles.vPath} d="" />
        </svg>
      </div>

      <div ref={loaderRef} className={styles.loader}>
        <div ref={barTrackRef} className={styles.barTrack}>
          <div ref={barFillRef} className={styles.barFill} />
        </div>
        <div ref={pctRef} className={styles.pct}>000</div>
      </div>

      <div ref={scrollHintRef} className={styles.scrollHint}>
        <div className={styles.mouse}>
          <div className={styles.mouseWheel} />
        </div>
        <span className={styles.scrollLabel}>scroll</span>
      </div>

      <div ref={scrollSpaceRef} className={styles.scrollSpace} />
    </>
  )
}
