"use client"

import { useState } from "react"
import styles from "./Stats.module.css"
import AdminHeader from "../../adminComponents/AdminHeader/AdminHeader"
import UserChart from "../../adminComponents/UserChart/UserChart"
import {
  BarChart,
  PieChart,
  MapPin,
  Clock,
  Users,
  LineChart,
  Target,
  Download,
  Star,
  MessageSquare,
  Calendar,
} from "lucide-react"

const Stats = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedCategory, setSelectedCategory] = useState("demographics")

  // Mock data
  const mockData = {
    // Demografía
    industryBreakdown: {
      Tecnología: 35,
      Marketing: 25,
      Ventas: 20,
      Servicios: 15,
      Retail: 10,
      Otros: 5,
    },
    roleBreakdown: {
      CEO: 28,
      Director: 22,
      Gerente: 18,
      Emprendedor: 15,
      Freelancer: 10,
      Otros: 5,
    },
    locationBreakdown: {
      España: 45,
      México: 20,
      Argentina: 15,
      Colombia: 10,
      Chile: 8,
      Otros: 2,
    },

    // Intereses y Preferencias
    factorScores: {
      ATRACTIVO: 8.2,
      "VALIDACIÓN SOCIAL": 7.5,
      RECIPROCIDAD: 6.8,
      AUTORIDAD: 7.9,
      AUTENTICIDAD: 8.5,
      "CONSISTENCIA Y COMPROMISO": 7.2,
    },
    interestTrends: {
      Enero: 7.2,
      Febrero: 7.5,
      Marzo: 7.8,
      Abril: 8.0,
      Mayo: 8.2,
    },

    // Desempeño
    scoreByIndustry: {
      Tecnología: 8.2,
      Marketing: 7.8,
      Ventas: 7.5,
      Servicios: 8.0,
      Retail: 7.3,
      Otros: 7.0,
    },
    scoreByRole: {
      CEO: 8.5,
      Director: 8.2,
      Gerente: 7.8,
      Emprendedor: 7.5,
      Freelancer: 7.2,
      Otros: 6.8,
    },
    scoreDistribution: {
      "0-2": 5,
      "3-4": 10,
      "5-6": 20,
      "7-8": 40,
      "9-10": 25,
    },

    // Comportamiento
    completionRate: {
      Completado: 85,
      Abandonado: 15,
    },
    completionTime: {
      "Menos de 5 min": 15,
      "5-10 min": 35,
      "10-15 min": 30,
      "Más de 15 min": 20,
    },

    // Conversiones
    conversionsByIndustry: {
      Tecnología: 40,
      Marketing: 30,
      Ventas: 15,
      Servicios: 10,
      Retail: 5,
    },
    conversionsByRole: {
      CEO: 35,
      Director: 25,
      Gerente: 20,
      Emprendedor: 15,
      Freelancer: 5,
    },
    conversionRate: {
      Enero: 25,
      Febrero: 28,
      Marzo: 30,
      Abril: 32,
      Mayo: 35,
    },

    // Feedback
    satisfactionScore: {
      "5 estrellas": 45,
      "4 estrellas": 30,
      "3 estrellas": 15,
      "2 estrellas": 7,
      "1 estrella": 3,
    },
    commonFeedback: {
      Útil: 40,
      Interesante: 35,
      Práctico: 30,
      Innovador: 25,
      Completo: 20,
    },

    // Tendencias
    monthlyUsers: {
      Enero: 150,
      Febrero: 180,
      Marzo: 210,
      Abril: 250,
      Mayo: 280,
    },
  }

  // Opciones de período
  const periodOptions = [
    { value: "week", label: "Esta semana" },
    { value: "month", label: "Este mes" },
    { value: "quarter", label: "Este trimestre" },
    { value: "year", label: "Este año" },
    { value: "all", label: "Todo el tiempo" },
  ]

  // Categorías de estadísticas
  const categories = [
    { id: "demographics", label: "Demografía", icon: Users },
    { id: "interests", label: "Intereses", icon: Target },
    { id: "performance", label: "Desempeño", icon: BarChart },
    { id: "behavior", label: "Comportamiento", icon: Clock },
    { id: "conversions", label: "Conversiones", icon: Download },
    { id: "feedback", label: "Feedback", icon: MessageSquare },
    { id: "trends", label: "Tendencias", icon: LineChart },
  ]

  // Renderizar gráficos según la categoría seleccionada
  const renderCharts = () => {
    switch (selectedCategory) {
      case "demographics":
        return (
          <>
            <div className={styles.chartRow}>
              <div className={styles.chartCard}>
                <div className={styles.chartHeader}>
                  <div className={styles.chartTitle}>
                    <PieChart size={18} />
                    <h3>Distribución por Industria</h3>
                  </div>
                </div>
                <div className={styles.chartBody}>
                  <UserChart data={mockData.industryBreakdown} type="doughnut" />
                </div>
              </div>

              <div className={styles.chartCard}>
                <div className={styles.chartHeader}>
                  <div className={styles.chartTitle}>
                    <Users size={18} />
                    <h3>Distribución por Rol</h3>
                  </div>
                </div>
                <div className={styles.chartBody}>
                  <UserChart data={mockData.roleBreakdown} type="pie" />
                </div>
              </div>
            </div>

            <div className={styles.chartRow}>
              <div className={styles.chartCard}>
                <div className={styles.chartHeader}>
                  <div className={styles.chartTitle}>
                    <MapPin size={18} />
                    <h3>Distribución Geográfica</h3>
                  </div>
                </div>
                <div className={styles.chartBody}>
                  <UserChart data={mockData.locationBreakdown} type="bar" />
                </div>
              </div>
            </div>
          </>
        )

      case "interests":
        return (
          <>
            <div className={styles.chartRow}>
              <div className={styles.chartCard}>
                <div className={styles.chartHeader}>
                  <div className={styles.chartTitle}>
                    <Target size={18} />
                    <h3>Aspectos más Valorados</h3>
                  </div>
                </div>
                <div className={styles.chartBody}>
                  <UserChart data={mockData.factorScores} type="bar" theme="light" />
                </div>
              </div>

              <div className={styles.chartCard}>
                <div className={styles.chartHeader}>
                  <div className={styles.chartTitle}>
                    <LineChart size={18} />
                    <h3>Tendencias de Interés</h3>
                  </div>
                </div>
                <div className={styles.chartBody}>
                  <UserChart data={mockData.interestTrends} type="polarArea" />
                </div>
              </div>
            </div>
          </>
        )

      case "performance":
        return (
          <>
            <div className={styles.chartRow}>
              <div className={styles.chartCard}>
                <div className={styles.chartHeader}>
                  <div className={styles.chartTitle}>
                    <BarChart size={18} />
                    <h3>Puntuación por Industria</h3>
                  </div>
                </div>
                <div className={styles.chartBody}>
                  <UserChart data={mockData.scoreByIndustry} type="doughnut" />
                </div>
              </div>

              <div className={styles.chartCard}>
                <div className={styles.chartHeader}>
                  <div className={styles.chartTitle}>
                    <Users size={18} />
                    <h3>Puntuación por Rol</h3>
                  </div>
                </div>
                <div className={styles.chartBody}>
                  <UserChart data={mockData.scoreByRole} type="pie" />
                </div>
              </div>
            </div>

            <div className={styles.chartRow}>
              <div className={styles.chartCard}>
                <div className={styles.chartHeader}>
                  <div className={styles.chartTitle}>
                    <BarChart size={18} />
                    <h3>Distribución de Puntuaciones</h3>
                  </div>
                </div>
                <div className={styles.chartBody}>
                  <UserChart data={mockData.scoreDistribution} type="bar" />
                </div>
              </div>
            </div>
          </>
        )

      case "behavior":
        return (
          <>
            <div className={styles.chartRow}>
              <div className={styles.chartCard}>
                <div className={styles.chartHeader}>
                  <div className={styles.chartTitle}>
                    <PieChart size={18} />
                    <h3>Tasa de Finalización</h3>
                  </div>
                </div>
                <div className={styles.chartBody}>
                  <UserChart data={mockData.completionRate} type="pie" />
                </div>
              </div>

              <div className={styles.chartCard}>
                <div className={styles.chartHeader}>
                  <div className={styles.chartTitle}>
                    <Clock size={18} />
                    <h3>Tiempo de Finalización</h3>
                  </div>
                </div>
                <div className={styles.chartBody}>
                  <UserChart data={mockData.completionTime} type="doughnut" />
                </div>
              </div>
            </div>
          </>
        )

      case "conversions":
        return (
          <>
            <div className={styles.chartRow}>
              <div className={styles.chartCard}>
                <div className={styles.chartHeader}>
                  <div className={styles.chartTitle}>
                    <Download size={18} />
                    <h3>Conversiones por Industria</h3>
                  </div>
                </div>
                <div className={styles.chartBody}>
                  <UserChart data={mockData.conversionsByIndustry} type="bar" />
                </div>
              </div>

              <div className={styles.chartCard}>
                <div className={styles.chartHeader}>
                  <div className={styles.chartTitle}>
                    <Users size={18} />
                    <h3>Conversiones por Rol</h3>
                  </div>
                </div>
                <div className={styles.chartBody}>
                  <UserChart data={mockData.conversionsByRole} type="bar" />
                </div>
              </div>
            </div>

            <div className={styles.chartRow}>
              <div className={styles.chartCard}>
                <div className={styles.chartHeader}>
                  <div className={styles.chartTitle}>
                    <LineChart size={18} />
                    <h3>Tasa de Conversión</h3>
                  </div>
                </div>
                <div className={styles.chartBody}>
                  <UserChart data={mockData.conversionRate} type="line" />
                </div>
              </div>
            </div>
          </>
        )

      case "feedback":
        return (
          <>
            <div className={styles.chartRow}>
              <div className={styles.chartCard}>
                <div className={styles.chartHeader}>
                  <div className={styles.chartTitle}>
                    <Star size={18} />
                    <h3>Puntuación de Satisfacción</h3>
                  </div>
                </div>
                <div className={styles.chartBody}>
                  <UserChart data={mockData.satisfactionScore} type="bar" />
                </div>
              </div>

              <div className={styles.chartCard}>
                <div className={styles.chartHeader}>
                  <div className={styles.chartTitle}>
                    <MessageSquare size={18} />
                    <h3>Comentarios más Comunes</h3>
                  </div>
                </div>
                <div className={styles.chartBody}>
                  <UserChart data={mockData.commonFeedback} type="pie" />
                </div>
              </div>
            </div>
          </>
        )

      case "trends":
        return (
          <>
            <div className={styles.chartRow}>
              <div className={styles.chartCard}>
                <div className={styles.chartHeader}>
                  <div className={styles.chartTitle}>
                    <Calendar size={18} />
                    <h3>Evolución de Usuarios por Mes</h3>
                  </div>
                </div>
                <div className={styles.chartBody}>
                  <UserChart data={mockData.monthlyUsers} type="line" />
                </div>
              </div>

              <div className={styles.chartCard}>
                <div className={styles.chartHeader}>
                  <div className={styles.chartTitle}>
                    <LineChart size={18} />
                    <h3>Tendencias de Interés</h3>
                  </div>
                </div>
                <div className={styles.chartBody}>
                  <UserChart data={mockData.interestTrends} type="line" />
                </div>
              </div>
            </div>

            <div className={styles.chartRow}>
              <div className={styles.chartCard}>
                <div className={styles.chartHeader}>
                  <div className={styles.chartTitle}>
                    <BarChart size={18} />
                    <h3>Comparación de Industrias</h3>
                  </div>
                </div>
                <div className={styles.chartBody}>
                  <UserChart data={mockData.scoreByIndustry} type="bar" />
                </div>
              </div>
            </div>
          </>
        )

      default:
        return null
    }
  }

  return (
    <div className={styles.statsPage}>
      <AdminHeader username="Administrador" />

      <div className={styles.content}>
        <div className={styles.controlsSection}>
          <div className={styles.periodSelector}>
            <span>Mostrar datos de:</span>
            <div className={styles.periodOptions}>
              {periodOptions.map((option) => (
                <button
                  key={option.value}
                  className={`${styles.periodButton} ${selectedPeriod === option.value ? styles.active : ""}`}
                  onClick={() => setSelectedPeriod(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.categorySelector}>
            {categories.map((category) => (
              <button
                key={category.id}
                className={`${styles.categoryButton} ${selectedCategory === category.id ? styles.active : ""}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <category.icon size={16} />
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.chartsSection}>
          <h2 className={styles.sectionTitle}>
            {categories.find((c) => c.id === selectedCategory)?.label || "Estadísticas"}
          </h2>

          {renderCharts()}
        </div>
      </div>
    </div>
  )
}

export default Stats

