'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { useHeroVisible } from '@/contexts/HeroContext'
import styles from './styles.module.scss'

gsap.registerPlugin(SplitText)

export function Hero() {
  const line1Ref     = useRef<HTMLSpanElement>(null)
  const line2Ref     = useRef<HTMLSpanElement>(null)
  const textLine3Ref = useRef<HTMLSpanElement>(null)
  const imgRef       = useRef<HTMLImageElement>(null)
  const hasAnimated  = useRef(false)
  const visible      = useHeroVisible()

  useEffect(() => {
    if (!visible || hasAnimated.current) return
    hasAnimated.current = true

    const l1  = line1Ref.current
    const l2  = line2Ref.current
    const l3  = textLine3Ref.current
    const img = imgRef.current
    if (!l1 || !l2 || !l3 || !img) return

    const split1 = SplitText.create(l1, { type: 'chars' })
    const split2 = SplitText.create(l2, { type: 'chars' })
    const split3 = SplitText.create(l3, { type: 'chars' })

    gsap.timeline({ delay: 0.4 })
      .from(split1.chars, {
        yPercent: 120,
        duration: 1,
        ease: 'power4.out',
        stagger: 0.03,
      })
      .from(split2.chars, {
        yPercent: 120,
        duration: 1,
        ease: 'power4.out',
        stagger: 0.03,
      }, '-=0.75')
      .from([img, ...split3.chars], {
        yPercent: 120,
        duration: 1,
        ease: 'power4.out',
        stagger: 0.03,
      }, '-=0.75')
  }, [visible])

  return (
    <section className={styles.hero}>
      <p className={styles.description}>
        Do protótipo ao deploy, unindo estética e performance a cada entrega.
      </p>

      <div className={styles.lines}>
        <div className={`${styles.lineWrapper} ${styles.lineWrapper1}`}>
          <span ref={line1Ref} className={styles.line1}>VICTOR ALVES</span>
        </div>
        <div className={`${styles.lineWrapper} ${styles.lineWrapper2}`}>
          <span ref={line2Ref} className={styles.line2}>DESENVOLVEDOR</span>
        </div>
        <div className={`${styles.lineWrapper} ${styles.lineWrapper3}`}>
          <span className={styles.line3}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src="https://4kwallpapers.com/images/wallpapers/spider-man-dark-artwork-2560x1440-1894.jpg"
              alt="Imagem do Victor"
              className={styles.mediaPlaceholder}
            />
            <span ref={textLine3Ref}>FRONT-END</span>
          </span>
        </div>
      </div>
    </section>
  )
}
