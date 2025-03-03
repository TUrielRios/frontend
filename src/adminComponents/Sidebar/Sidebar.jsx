import { Home, BarChart2, Users, Settings, HelpCircle } from "lucide-react"
import styles from "./Sidebar.module.css"
import logo from "../../assets/logo.png"

const menuItems = [
  { id: "dashboard", icon: Home, label: "Dashboard" },
  { id: "stats", icon: BarChart2, label: "Estadísticas" },
  { id: "users", icon: Users, label: "Usuarios" },
  { id: "settings", icon: Settings, label: "Configuración" },
  { id: "help", icon: HelpCircle, label: "Ayuda" },
]

const Sidebar = ({ activeSection, onSectionChange }) => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <img src={logo || "/placeholder.svg"} alt="La Cocina" className={styles.logo} />
      </div>

      <nav className={styles.nav}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`${styles.navItem} ${activeSection === item.id ? styles.active : ""}`}
            onClick={() => onSectionChange(item.id)}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar

