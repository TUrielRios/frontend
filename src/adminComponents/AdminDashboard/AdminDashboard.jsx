"use client"

import { useState, useRef } from "react"
import { Download, Users, UserCheck, TrendingUp } from "lucide-react"
import AdminUserChart from "../AdminUserChart/AdminUserChart"
import styles from "./AdminDashboard.module.css"
import html2canvas from "html2canvas"
import AdminHeader from "../AdminHeader/AdminHeader"

// Datos de ejemplo para los gráficos de radar (escala 1-10)
const directoryData = {
  ATRACTIVO: 8,
  RECIPROCIDAD: 7,
  AUTORIDAD: 9,
  AUTENTICIDAD: 7,
  "CONSISTENCIA Y COMPROMISO": 6,
  "VALIDACIÓN SOCIAL": 8,
}

const adminData = {
  ATRACTIVO: 7,
  RECIPROCIDAD: 6,
  AUTORIDAD: 8,
  AUTENTICIDAD: 9,
  "CONSISTENCIA Y COMPROMISO": 8,
  "VALIDACIÓN SOCIAL": 7,
}

const commercialData = {
  ATRACTIVO: 6,
  RECIPROCIDAD: 9,
  AUTORIDAD: 7,
  AUTENTICIDAD: 8,
  "CONSISTENCIA Y COMPROMISO": 7,
  "VALIDACIÓN SOCIAL": 9,
}

const marketingData = {
  ATRACTIVO: 9,
  RECIPROCIDAD: 7,
  AUTORIDAD: 6,
  AUTENTICIDAD: 7,
  "CONSISTENCIA Y COMPROMISO": 8,
  "VALIDACIÓN SOCIAL": 7,
}

const designData = {
  ATRACTIVO: 8,
  RECIPROCIDAD: 6,
  AUTORIDAD: 8,
  AUTENTICIDAD: 9,
  "CONSISTENCIA Y COMPROMISO": 7,
  "VALIDACIÓN SOCIAL": 6,
}

const hrData = {
  ATRACTIVO: 7,
  RECIPROCIDAD: 8,
  AUTORIDAD: 7,
  AUTENTICIDAD: 6,
  "CONSISTENCIA Y COMPROMISO": 9,
  "VALIDACIÓN SOCIAL": 8,
}

// Datos para el gráfico de resultado promedio
const averageData = {
  ATRACTIVO: 7.5,
  RECIPROCIDAD: 7.2,
  AUTORIDAD: 7.5,
  AUTENTICIDAD: 7.7,
  "CONSISTENCIA Y COMPROMISO": 7.5,
  "VALIDACIÓN SOCIAL": 7.5,
}

// Datos para el gráfico de gap entre áreas
const gapData = {
  Directorio: directoryData,
  Administración: adminData,
  Comercial: commercialData,
  Marketing: marketingData,
  Diseño: designData,
  RRHH: hrData,
}

// Áreas de desempeño con sus datos correspondientes
const performanceAreas = [
  { name: "Directorio", data: directoryData },
  { name: "Administración / Finanzas", data: adminData },
  { name: "Comercial / ventas", data: commercialData },
  { name: "Marketing", data: marketingData },
  { name: "Diseño / Comunicación", data: designData },
  { name: "Recursos Humanos", data: hrData },
]

// Función para descargar un gráfico como PNG usando html2canvas
const downloadChartAsPNG = async (chartRef, fileName = "chart.png") => {
  if (!chartRef.current) return

  try {
    // Usar html2canvas para capturar el elemento completo
    const canvas = await html2canvas(chartRef.current, {
      backgroundColor: null,
      useCORS: true,
      allowTaint: false,
      scale: 2, // Mayor calidad
    })

    // Convertir a PNG y descargar
    const pngUrl = canvas.toDataURL("image/png")
    const downloadLink = document.createElement("a")
    downloadLink.href = pngUrl
    downloadLink.download = fileName
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  } catch (error) {
    console.error("Error al descargar el gráfico:", error)
    alert("Hubo un error al descargar el gráfico. Por favor, intente nuevamente.")
  }
}

// Componente para las tarjetas de métricas
const MetricCard = ({ title, value, percentage, icon }) => {
  const Icon = icon

  return (
    <div className={styles.metricCard}>
      <div className={styles.metricContent}>
        <div className={styles.metricInfo}>
          <h3 className={styles.metricTitle}>{title}</h3>
          <div className={styles.metricValue}>
            <span className={styles.value}>{value}</span>
            {percentage && (
              <span className={styles.percentage} style={{ color: percentage.startsWith("+") ? "#4CAF50" : "#F44336" }}>
                {percentage}
              </span>
            )}
          </div>
        </div>
        <div className={styles.metricIcon}>
          <Icon size={24} color="#0a2ff1" />
        </div>
      </div>
    </div>
  )
}

// Componente para los gráficos de radar por área
const AreaRadarChart = ({ title, data }) => {
  const chartRef = useRef(null)

  const handleDownload = () => {
    downloadChartAsPNG(chartRef, `${title.replace(/\s+/g, "-").toLowerCase()}-radar.png`)
  }

  return (
    <div className={styles.chartCard} ref={chartRef}>
      <div className={styles.chartHeader}>
        <div className={styles.chartTitle}>
          <h3>{title}</h3>
        </div>
      </div>
      <div className={styles.chartBody}>
        <AdminUserChart data={data} type="radar" theme="light" />
      </div>
      <div className={styles.chartFooter}>
        <button className={styles.downloadButton} onClick={handleDownload}>
          <span>Descargar resultado</span>
          <Download size={16} />
        </button>
      </div>
    </div>
  )
}

// Componente para el gráfico de resultado promedio
const AverageRadarChart = () => {
  const chartRef = useRef(null)

  const handleDownload = () => {
    downloadChartAsPNG(chartRef, "resultado-promedio.png")
  }

  return (
    <div className={styles.chartCard} ref={chartRef}>
      <div className={styles.chartHeader}>
        <div className={styles.chartTitle}>
          <h3>Resultado Promedio</h3>
        </div>
      </div>
      <div className={styles.chartBody}>
        <AdminUserChart data={averageData} type="radar" theme="light" />
      </div>
      <div className={styles.chartFooter}>
        <button className={styles.downloadButton} onClick={handleDownload}>
          <span>Descargar resultado</span>
          <Download size={16} />
        </button>
      </div>
    </div>
  )
}

// Componente para el gráfico de gap entre áreas
const GapRadarChart = () => {
  const chartRef = useRef(null)

  const handleDownload = () => {
    downloadChartAsPNG(chartRef, "gap-areas.png")
  }

  return (
    <div className={styles.chartCard} ref={chartRef}>
      <div className={styles.chartHeader}>
        <div className={styles.chartTitle}>
          <h3>Gap entre áreas</h3>
        </div>
      </div>
      <div className={styles.chartBody}>
        <AdminUserChart data={gapData} type="gaap" theme="light" />
      </div>
      <div className={styles.chartFooter}>
        <button className={styles.downloadButton} onClick={handleDownload}>
          <span>Descargar resultado</span>
          <Download size={16} />
        </button>
      </div>
    </div>
  )
}

const AdminDashboard = () => {
  const [activePeriod, setActivePeriod] = useState("month")

  return (
    <div className={styles.dashboard}>
      <AdminHeader username="Administrador" />
      <div className={styles.content}>
        {/* Selector de período */}
        <div className={styles.periodSelector}>
          <span>Período:</span>
          <div className={styles.periodOptions}>
            <button
              className={`${styles.periodButton} ${activePeriod === "week" ? styles.active : ""}`}
              onClick={() => setActivePeriod("week")}
            >
              Semana
            </button>
            <button
              className={`${styles.periodButton} ${activePeriod === "month" ? styles.active : ""}`}
              onClick={() => setActivePeriod("month")}
            >
              Mes
            </button>
            <button
              className={`${styles.periodButton} ${activePeriod === "quarter" ? styles.active : ""}`}
              onClick={() => setActivePeriod("quarter")}
            >
              Trimestre
            </button>
            <button
              className={`${styles.periodButton} ${activePeriod === "year" ? styles.active : ""}`}
              onClick={() => setActivePeriod("year")}
            >
              Año
            </button>
          </div>
        </div>

        {/* Sección de métricas */}
        <div className={styles.metricsSection}>
          <MetricCard title="Total Usuarios" value="98" percentage="+12%" icon={Users} />
          <MetricCard title="Usuarios Activos" value="45" percentage="+5%" icon={UserCheck} />
          <MetricCard title="Tasa de Finalización" value="85%" percentage="+2%" icon={TrendingUp} />
        </div>

        {/* Sección de resultados por área de desempeño */}
        <div className={styles.dashboardSection}>
          <h2 className={styles.sectionTitle}>Resultados según Área de Desempeño: Taller TGS</h2>
          <div className={styles.chartsGrid}>
            {performanceAreas.map((area, index) => (
              <AreaRadarChart key={index} title={area.name} data={area.data} />
            ))}
          </div>
        </div>

        {/* Sección de resultados por industria */}
        <div className={styles.dashboardSection}>
          <h2 className={styles.sectionTitle}>Resultado por Industria: Taller TGS</h2>
          <div className={styles.chartsGrid}>
            <AverageRadarChart />
            <GapRadarChart />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

