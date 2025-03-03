import { X, Mail, Building2, Briefcase, MapPin, Calendar, TrendingUp, TrendingDown, Award } from "lucide-react"
import styles from "./UserModal.module.css"
import UserChart from "../../adminComponents/UserChart/UserChart"

const UserModal = ({ user, onClose }) => {
  // Calcular métricas
  const averageScore = Object.values(user.results).reduce((a, b) => a + b, 0) / Object.values(user.results).length
  const highestFactor = Object.entries(user.results).reduce((a, b) => (a[1] > b[1] ? a : b))
  const lowestFactor = Object.entries(user.results).reduce((a, b) => (a[1] < b[1] ? a : b))

  // Datos simulados de progreso (para demostración)
  const progressData = {
    previousScore: 7.2,
    industryAverage: 7.8,
  }

  const metrics = [
    {
      label: "Puntuación General",
      value: averageScore.toFixed(1),
      trend: averageScore > progressData.previousScore ? "up" : "down",
      change: (((averageScore - progressData.previousScore) / progressData.previousScore) * 100).toFixed(1),
      icon: Award,
    },
    {
      label: "Promedio Industrial",
      value: progressData.industryAverage.toFixed(1),
      trend: "neutral",
      change: "0",
      icon: Building2,
    },
    {
      label: "Factor más Alto",
      value: highestFactor[1].toFixed(1),
      subLabel: highestFactor[0],
      trend: "up",
      icon: TrendingUp,
    },
    {
      label: "Factor más Bajo",
      value: lowestFactor[1].toFixed(1),
      subLabel: lowestFactor[0],
      trend: "down",
      icon: TrendingDown,
    },
  ]

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={24} />
        </button>

        <div className={styles.modalContent}>
          {/* Sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.userProfile}>
              <div className={styles.profileHeader}>
                <span className={styles.nameInitial}>{user.name.charAt(0)}</span>
                <div className={styles.profileInfo}>
                  <h2>{user.name}</h2>
                  <span className={styles.role}>{user.role}</span>
                </div>
              </div>

              <div className={styles.profileDetails}>
                <div className={styles.detailItem}>
                  <Mail size={18} />
                  <span>{user.email}</span>
                </div>
                <div className={styles.detailItem}>
                  <Building2 size={18} />
                  <span>{user.company}</span>
                </div>
                <div className={styles.detailItem}>
                  <Briefcase size={18} />
                  <span>{user.industry}</span>
                </div>
                <div className={styles.detailItem}>
                  <Calendar size={18} />
                  <span>{new Date(user.completionDate).toLocaleDateString()}</span>
                </div>
                <div className={styles.detailItem}>
                  <MapPin size={18} />
                  <span>España</span>
                </div>
              </div>
            </div>

            <div className={styles.factorsList}>
              <h3>Factores de Influencia</h3>
              {Object.entries(user.results).map(([factor, score]) => (
                <div key={factor} className={styles.factorItem}>
                  <div className={styles.factorInfo}>
                    <span className={styles.factorName}>{factor}</span>
                    <span className={styles.factorScore}>{score.toFixed(1)}</span>
                  </div>
                  <div className={styles.factorBar}>
                    <div className={styles.factorProgress} style={{ width: `${(score / 10) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className={styles.mainContent}>
          <div className={styles.chartsSection}>
              <div className={styles.chartCard}>
                <h3>Análisis de Factores</h3>
                <div className={styles.chartContainer}>
                  <UserChart data={user.results} type="radar" theme="light" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default UserModal

