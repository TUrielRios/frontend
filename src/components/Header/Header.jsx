import { User } from "lucide-react"
import styles from "./Header.module.css"

const Header = ({ logo }) => {
  return (
    <header className={styles.header}>
      <img src={logo || "/placeholder.svg"} alt="La Cocina" className={styles.logo} />
      <button className={styles.userButton}>
        <User size={24} />
      </button>
    </header>
  )
}

export default Header

