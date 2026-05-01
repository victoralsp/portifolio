import styles from './styles.module.scss'

export function Header() {
  return (
    <header className={styles.header}>
      <span className={styles.logo}>VA</span>

      <nav className={styles.nav}>

        <a href="#sobre-mim" className={styles.navLink}>
          <span className={styles.navArrow}>↗</span>Sobre mim
        </a>

        <a href="#experiencias" className={styles.navLink}>
          <span className={styles.navArrow}>↗</span>Experiência
        </a>

        <a href="#projetos" className={styles.navLink}>
          <span className={styles.navArrow}>↗</span>Projetos
        </a>

      </nav>
      
      <a href="#contato" className={styles.cta}>
        Contato <span aria-hidden>→</span>
      </a>
    </header>
  )
}
