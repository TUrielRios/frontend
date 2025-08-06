import { Home, BarChart2, Users, Settings, HelpCircle,Key, Bot } from "lucide-react"
import styles from "./Sidebar.module.css"
import logo from "../../assets/logo.png"

const menuItems = [
  { id: "dashboard", icon: Home, label: "Dashboard" },
  { id: "dashboardSOS", icon: BarChart2, label: "Dashboard SOS" },
  { id: "users", icon: Users, label: "Usuarios" },
  { id: "accessCodes", icon: Key, label: "Códigos de Acceso" },
  { id: "settings", icon: Settings, label: "Configuración" },
  { id: "help", icon: HelpCircle, label: "Ayuda" },
  { id: "nicoloAI", icon: Bot, label: "Nicolo AI" }, // New Nicolo AI section
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
            <span className={styles.navItemText}>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar

