import styles from './styles.module.scss'

export function Hero() {
  return (
    <section className={styles.hero}>
      <p className={styles.description}>
        Do protótipo ao deploy, unindo estética e performance a cada entrega.
      </p>

      <div className={styles.lines}>
        <span className={styles.line1}>VICTOR ALVES</span>
        <span className={styles.line2}>DESENVOLVEDOR</span>
        <span className={styles.line3}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://4kwallpapers.com/images/wallpapers/spider-man-dark-artwork-2560x1440-1894.jpg"
            alt="Imagem do Victor"
            className={styles.mediaPlaceholder}
          />
          FRONT-END
        </span>
      </div>
    </section>
  )
}
