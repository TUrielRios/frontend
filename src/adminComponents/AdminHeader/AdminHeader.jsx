import { User, Bell } from "lucide-react"
import styles from "./AdminHeader.module.css"
import logo from "../../assets/logo.png"

const AdminHeader = ({ username }) => {
  return (
    <header className={styles.header}>
      <div className={styles.logoSection}>
        <img src={logo || "/placeholder.svg"} alt="La Cocina" className={styles.logo} />
      </div>

      <div className={styles.welcomeSection}>
        <h1>¡Hola, {username}! 👋</h1>
        <p>Aquí tienes un resumen de la actividad de tus usuarios.</p>
      </div>

      <div className={styles.actions}>
        <button className={styles.iconButton}>
          <Bell size={20} />
        </button>
        <button className={styles.iconButton}>
          <User size={20} />
        </button>
      </div>
    </header>
  )
}

export default AdminHeader

