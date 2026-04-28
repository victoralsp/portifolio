import styles from './styles.module.scss'

export function Header() {
  return (
    <header className={styles.header}>
      <span className={styles.logo}>VP</span>

      <nav className={styles.nav}>
        <a href="#trabalhos" className={styles.navLink}>TRABALHOS</a>
        <a href="#sobre"     className={styles.navLink}>SOBRE</a>
      </nav>

      <a href="#contato" className={styles.cta}>
        INICIAR PROJETO <span aria-hidden>→</span>
      </a>
    </header>
  )
}
