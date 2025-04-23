import styles from "./Header.module.css"

const Header = ({ logoLight, logoDark, theme="dark" }) => {
  // Use the appropriate logo based on the current theme
  const logoSrc = theme === "light" ? logoDark : logoLight;
  
  return (
    <header className={styles.header}>
      <img src={logoSrc || "/placeholder.svg"} alt="La Cocina" className={styles.logo} />
    </header>
  )
}

export default Header