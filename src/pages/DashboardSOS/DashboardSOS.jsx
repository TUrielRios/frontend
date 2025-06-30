"use client"

import { useState, useEffect } from "react"
import { Users, UserCheck, TrendingUp, ChevronDown, ChevronUp } from "lucide-react"
import ResultsByCategory from "../../adminComponents/ResultsByCategory/ResultsByCategory"
import styles from "./DashboardSOS.module.css"
import AdminHeader from "../../adminComponents/AdminHeader/AdminHeader"
import axios from "axios"

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

// Componente de acordeón para mostrar actividades
const ActivityAccordion = ({ activity, index, isOpen, toggleAccordion }) => {
  return (
    <div className={styles.accordionItem}>
      <div
        className={`${styles.accordionHeader} ${isOpen ? styles.active : ""}`}
        onClick={() => toggleAccordion(index)}
      >
        <h3 className={styles.accordionTitle}>
          {activity.nombre || `${activity.type === 'taller' ? 'Taller' : 'Curso'} ${index + 1}`}
        </h3>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>

      {isOpen && (
        <div className={styles.accordionContent}>
          {/* Resultados por Área de Desempeño */}
          <ResultsByCategory
            data={activity.data}
            categoryField="areaDesempeno"
            categoryTitle="Área de Desempeño"
            categoryType="area"
          />

          {/* Resultados por Industria */}
          <ResultsByCategory
            data={activity.data}
            categoryField="industriaSector"
            categoryTitle="Industria"
            categoryType="industria"
          />

          {/* Resultados por Sector */}
          <ResultsByCategory 
            data={activity.data} 
            categoryField="sector" 
            categoryTitle="Sector" 
            categoryType="sector" 
          />
        </div>
      )}
    </div>
  )
}

const DashboardSOS = () => {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [openAccordion, setOpenAccordion] = useState(null)
  const [metrics, setMetrics] = useState({
    totalActivities: 0,
    totalUsers: 0,
    activeUsers: 0,
    completionRate: 0,
  })
  const [combinedData, setCombinedData] = useState([])

  // Función para combinar y agrupar datos de talleres y cursos
  const combineAndGroupData = (workshops, courses) => {
    // Combinar todos los datos para gráficos
    const allData = [...(workshops || []), ...(courses || [])]
    setCombinedData(allData)

    // Agrupar actividades para el listado
//    const groupedActivities = []

    // Agrupar talleres
    const workshopGroups = {}
    workshops?.forEach(workshop => {
      const key = `${workshop.compania}_${workshop.fecha}`
      if (!workshopGroups[key]) {
        workshopGroups[key] = {
          type: 'taller',
          nombre: `${workshop.compania} - ${new Date(workshop.createdAt).toLocaleDateString()}`,
          compania: workshop.compania,
          fecha: workshop.createdAt,
          industriaSector: workshop.industriaSector,
          data: []
        }
      }
      workshopGroups[key].data.push(workshop)
    })

    // Agrupar cursos
    const courseGroups = {}
    courses?.forEach(course => {
      const key = course.curso
      if (!courseGroups[key]) {
        courseGroups[key] = {
          type: 'curso',
          nombre: course.curso,
          fecha: course.createdAt,
          data: []
        }
      }
      courseGroups[key].data.push(course)
    })

    // Combinar y ordenar todas las actividades
    const allActivities = [
      ...Object.values(workshopGroups),
      ...Object.values(courseGroups)
    ].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))

    return allActivities
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch both workshops and courses simultaneously
        const [workshopResponse, courseResponse] = await Promise.all([
          axios.get("https://lacocina-backend-deploy.vercel.app/usuarios/taller"),
          axios.get("https://lacocina-backend-deploy.vercel.app/usuarios/curso")
        ])

        const workshops = workshopResponse.data || []
        const courses = courseResponse.data || []

        // Procesar y combinar datos
        const allActivities = combineAndGroupData(workshops, courses)
        setActivities(allActivities)

        // Calcular métricas combinadas
        const now = new Date()
        const currentMonth = now.getMonth()
        const currentYear = now.getFullYear()

        const totalUsers = workshops.length + courses.length
        const completedActivities = 
          workshops.filter(w => w.consistenciaCompromiso > 0).length +
          courses.filter(c => c.consistenciaCompromiso > 0).length

        const activeUsers = 
          workshops.filter(w => {
            const date = new Date(w.createdAt)
            return date.getMonth() === currentMonth && date.getFullYear() === currentYear
          }).length +
          courses.filter(c => {
            const date = new Date(c.createdAt)
            return date.getMonth() === currentMonth && date.getFullYear() === currentYear
          }).length

        setMetrics({
          totalActivities: allActivities.length,
          totalUsers,
          activeUsers,
          completionRate: `${Math.round((completedActivities / totalUsers) * 100)}%`,
        })

      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Error al cargar los datos. Por favor, intente nuevamente.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index)
  }

  if (loading) {
    return <div className={styles.loading}>Cargando datos...</div>
  }

  if (error) {
    return <div className={styles.error}>{error}</div>
  }

  const latestActivity = activities[0]

  return (
    <div className={styles.dashboard}>
      <AdminHeader username="Administrador" />
      <div className={styles.content}>
        <div className={styles.metricsSection}>
          <MetricCard title="Total Actividades" value={metrics.totalActivities.toString()} icon={Users} />
          <MetricCard title="Total Participantes" value={metrics.totalUsers.toString()} icon={UserCheck} />
          <MetricCard title="Participantes Activos" value={metrics.activeUsers.toString()} icon={TrendingUp} />
          <MetricCard title="Tasa de Finalización" value={metrics.completionRate} icon={TrendingUp} />
        </div>

        {latestActivity && (
          <>
            <div className={styles.dashboardSection}>
              <h2 className={styles.sectionTitle}>
                Actividad más reciente: {latestActivity.nombre}
              </h2>

              {/* Gráficos combinados con todos los datos */}
              <ResultsByCategory
                data={combinedData}
                categoryField="areaDesempeno"
                categoryTitle="Área de Desempeño"
                categoryType="area"
              />

              <ResultsByCategory
                data={combinedData}
                categoryField="industriaSector"
                categoryTitle="Industria"
                categoryType="industria"
              />

              <ResultsByCategory
                data={combinedData}
                categoryField="sector"
                categoryTitle="Sector"
                categoryType="sector"
              />
            </div>

            {activities.length > 1 && (
              <div className={styles.dashboardSection}>
                <h2 className={styles.sectionTitle}>Otras Actividades</h2>
                <div className={styles.accordionContainer}>
                  {activities.slice(1).map((activity, index) => (
                    <ActivityAccordion
                      key={index}
                      activity={activity}
                      index={index}
                      isOpen={openAccordion === index}
                      toggleAccordion={toggleAccordion}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {!latestActivity && <div className={styles.noData}>No se encontraron actividades disponibles.</div>}
      </div>
    </div>
  )
}

export default DashboardSOS