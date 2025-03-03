"use client"

import { useState } from "react"
import styles from "./AdminDashboard.module.css"
import AdminHeader from "../AdminHeader/AdminHeader"
import MetricsCards from "../MetricsCards/MetricsCards"
import UserChart from "../UserChart/UserChart"
import UsersList from "../UsersList/UsersList"
import { BarChart, PieChart, MapPin, Clock, Users, TrendingUp } from "lucide-react"

const AdminDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  // Mock data - En un caso real, esto vendría del backend
  const mockData = {
    totalUsers: 98,
    activeUsers: 45,
    averageScore: 7.8,
    completionRate: 85,
    usersByIndustry: {
      Tecnología: 35,
      Marketing: 25,
      Retail: 20,
      Servicios: 18,
    },
    usersByRole: {
      CEO: 28,
      Director: 22,
      Gerente: 18,
      Emprendedor: 15,
      Freelancer: 10,
      Otros: 5,
    },
    usersByLocation: {
      España: 45,
      México: 20,
      Argentina: 15,
      Colombia: 10,
      Chile: 8,
    },
    factorScores: {
      ATRACTIVO: 8.2,
      "VALIDACIÓN SOCIAL": 7.5,
      RECIPROCIDAD: 6.8,
      AUTORIDAD: 7.9,
      AUTENTICIDAD: 8.5,
      "CONSISTENCIA Y COMPROMISO": 7.2,
    },
    completionTime: {
      "Menos de 5 min": 15,
      "5-10 min": 35,
      "10-15 min": 30,
      "Más de 15 min": 20,
    },
    recentUsers: [
      {
        id: 1,
        name: "Ana García",
        company: "Tech Solutions",
        industry: "Tecnología",
        position: "CEO",
        completionDate: "2024-03-01",
        score: 8.5,
      },
      {
        id: 2,
        name: "Carlos López",
        company: "Marketing Pro",
        industry: "Marketing",
        position: "Director",
        completionDate: "2024-02-28",
        score: 7.9,
      },
      {
        id: 3,
        name: "Laura Martínez",
        email: "laura@freelance.com",
        company: "Freelance",
        role: "Freelancer",
        industry: "Diseño",
        completionDate: "2024-03-05",
        score: 8.2,
      },
      {
        id: 4,
        name: "Miguel Rodríguez",
        email: "miguel@ventas.com",
        company: "Ventas Express",
        role: "Fundador",
        industry: "Ventas",
        completionDate: "2024-03-10",
        score: 7.5,
      },
    ],
  }

  // Opciones de período
  const periodOptions = [
    { value: "week", label: "Esta semana" },
    { value: "month", label: "Este mes" },
    { value: "quarter", label: "Este trimestre" },
    { value: "year", label: "Este año" },
  ]

  return (
    <div className={styles.dashboard}>
      <AdminHeader username="Administrador" />

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

      <div className={styles.content}>
        <div className={styles.metricsSection}>
          <MetricsCards data={mockData} />
        </div>

        <div className={styles.dashboardSection}>
          <h2 className={styles.sectionTitle}>Demografía de Usuarios</h2>
          <div className={styles.chartsGrid}>
            <div className={styles.chartCard}>
              <div className={styles.chartHeader}>
                <div className={styles.chartTitle}>
                  <PieChart size={18} />
                  <h3>Distribución por Industria</h3>
                </div>
              </div>
              <div className={styles.chartBody}>
                <UserChart data={mockData.usersByIndustry} type="doughnut" />
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
                <UserChart data={mockData.usersByRole} type="pie" />
              </div>
            </div>

            <div className={styles.chartCard}>
              <div className={styles.chartHeader}>
                <div className={styles.chartTitle}>
                  <MapPin size={18} />
                  <h3>Distribución Geográfica</h3>
                </div>
              </div>
              <div className={styles.chartBody}>
                <UserChart data={mockData.usersByLocation} type="polarArea" />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.dashboardSection}>
          <h2 className={styles.sectionTitle}>Análisis de Factores</h2>
          <div className={styles.chartsGrid}>
            <div className={styles.chartCard}>
              <div className={styles.chartHeader}>
                <div className={styles.chartTitle}>
                  <BarChart size={18} />
                  <h3>Puntuación por Factor</h3>
                </div>
              </div>
              <div className={styles.chartBody}>
                <UserChart data={mockData.factorScores} type="polarArea" theme="light" />
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
                <UserChart data={mockData.completionTime} type="pie" />
              </div>
            </div>

            <div className={styles.chartCard}>
              <div className={styles.chartHeader}>
                <div className={styles.chartTitle}>
                  <TrendingUp size={18} />
                  <h3>Promedio de Resultados</h3>
                </div>
              </div>
              <div className={styles.chartBody}>
                <UserChart
                  data={mockData.recentUsers.reduce(
                    (acc, user) => ({
                      ...acc,
                      [user.company]: user.score,
                    }),
                    {},
                  )}
                  type="pie"
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.usersSection}>
          <UsersList users={mockData.recentUsers} />
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

