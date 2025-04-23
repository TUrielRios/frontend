import { useState } from "react"
import styles from "./Admin.module.css"
import AdminDashboard from "../AdminDashboard/AdminDashboard"
import Users from "../../pages/Users/Users"
import Sidebar from "../Sidebar/Sidebar"
import Settings from "../../pages/Settings/Settings"
import AccessCodes from "../../pages/AccessCodes/AccessCodes"

const Admin = () => {
  const [activeSection, setActiveSection] = useState("dashboard")

  // Renderizar la sección activa
  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <AdminDashboard />
      case "accessCodes":
        return <AccessCodes />
      case "users":
        return <Users />
      case "settings":
        return <Settings />
      case "help":
        return <div className={styles.comingSoon}>Ayuda - Próximamente</div>
      default:
        return <AdminDashboard />
    }
  }

  return (
    <div className={styles.adminLayout}>
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className={styles.mainContent}>{renderSection()}</div>
    </div>
  )
}

export default Admin

