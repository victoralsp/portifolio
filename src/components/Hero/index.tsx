import styles from './styles.module.scss'

export function Hero() {
  return (
    <section className={styles.hero}>
      <p className={styles.description}>
        Lorem ipsum dolor sit amet,<br />
        consectetur adipiscing elit ut
        aliquam, purus sit amet luctus.
      </p>

      <div className={styles.lines}>
        <span className={styles.line1}>VICTOR ALVES</span>
        <span className={styles.line2}>DESENVOLVEDOR</span>
        <span className={styles.line3}>FRONT END</span>
      </div>
    </section>
  )
}
