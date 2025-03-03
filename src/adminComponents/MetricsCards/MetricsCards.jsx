import { Users, UserCheck, Target, TrendingUp } from "lucide-react"
import styles from "./MetricsCards.module.css"

const MetricsCards = ({ data }) => {
  const metrics = [
    {
      title: "Total Usuarios",
      value: data.totalUsers,
      icon: Users,
      trend: "+12%",
      positive: true,
    },
    {
      title: "Usuarios Activos",
      value: data.activeUsers,
      icon: UserCheck,
      trend: "+5%",
      positive: true,
    },
    {
      title: "Promedio General",
      value: data.averageScore.toFixed(1),
      icon: Target,
      trend: "-0.3",
      positive: false,
    },
    {
      title: "Tasa de Finalización",
      value: `${data.completionRate}%`,
      icon: TrendingUp,
      trend: "+2%",
      positive: true,
    },
  ]

  return (
    <>
      {metrics.map((metric, index) => (
        <div key={index} className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>{metric.title}</h3>
            <metric.icon className={styles.icon} />
          </div>
          <div className={styles.cardBody}>
            <span className={styles.value}>{metric.value}</span>
            <span className={`${styles.trend} ${metric.positive ? styles.positive : styles.negative}`}>
              {metric.trend}
            </span>
          </div>
        </div>
      ))}
    </>
  )
}

export default MetricsCards

