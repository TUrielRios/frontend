"use client"

import { useState, useEffect } from "react"
import { Users, UserCheck, TrendingUp, ChevronDown, ChevronUp } from "lucide-react"
import ResultsByCategory from "../ResultsByCategory/ResultsByCategory"
import styles from "./AdminDashboard.module.css"
import AdminHeader from "../AdminHeader/AdminHeader"
import axios from "axios"

// Función para descargar un gráfico como PNG

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

// Componente de acordeón para mostrar talleres anteriores
const WorkshopAccordion = ({ workshop, index, isOpen, toggleAccordion }) => {
  return (
    <div className={styles.accordionItem}>
      <div
        className={`${styles.accordionHeader} ${isOpen ? styles.active : ""}`}
        onClick={() => toggleAccordion(index)}
      >
        <h3 className={styles.accordionTitle}>{workshop.nombre || `Taller ${index + 1}`}</h3>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>

      {isOpen && (
        <div className={styles.accordionContent}>
          {/* Resultados por Área de Desempeño */}
          <ResultsByCategory
            data={workshop.data}
            categoryField="areaDesempeno"
            categoryTitle="Área de Desempeño"
            categoryType="area"
          />

          {/* Resultados por Industria */}
          <ResultsByCategory
            data={workshop.data}
            categoryField="industriaSector"
            categoryTitle="Industria"
            categoryType="industria"
          />

          {/* Resultados por Sector */}
          <ResultsByCategory data={workshop.data} categoryField="sector" categoryTitle="Sector" categoryType="sector" />
        </div>
      )}
    </div>
  )
}

// Componente de acordeón para mostrar cursos anteriores
const CourseAccordion = ({ course, index, isOpen, toggleAccordion }) => {
  return (
    <div className={styles.accordionItem}>
      <div
        className={`${styles.accordionHeader} ${isOpen ? styles.active : ""}`}
        onClick={() => toggleAccordion(index)}
      >
        <h3 className={styles.accordionTitle}>{course.nombre || `Curso ${index + 1}`}</h3>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>

      {isOpen && (
        <div className={styles.accordionContent}>
          {/* Resultados por Área de Desempeño */}
          <ResultsByCategory
            data={course.data}
            categoryField="areaDesempeno"
            categoryTitle="Área de Desempeño"
            categoryType="area"
          />

          {/* Resultados por Industria */}
          <ResultsByCategory
            data={course.data}
            categoryField="industriaSector"
            categoryTitle="Industria"
            categoryType="industria"
          />

          {/* Resultados por Sector */}
          <ResultsByCategory data={course.data} categoryField="sector" categoryTitle="Sector" categoryType="sector" />
        </div>
      )}
    </div>
  )
}

const AdminDashboard = () => {
  const [workshops, setWorkshops] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [openAccordion, setOpenAccordion] = useState(null)
  const [openCourseAccordion, setOpenCourseAccordion] = useState(null)
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    completionRate: 0,
  })
  const [courseMetrics, setCourseMetrics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    completionRate: 0,
  })

  // Función para agrupar talleres por compañía y fecha
  const groupWorkshops = (data) => {
    const grouped = {}

    data.forEach((workshop) => {
      const key = `${workshop.compania}_${workshop.fecha}`
      if (!grouped[key]) {
        grouped[key] = {
          compania: workshop.compania,
          fecha: workshop.createdAt,
          industriaSector: workshop.industriaSector,
          participantes: [],
          data: [],
        }
      }
      grouped[key].data.push(workshop)
    })

    return Object.values(grouped)
  }

  // Función para agrupar cursos por nombre
  const groupCourses = (data) => {
    const grouped = {}

    data.forEach((course) => {
      const key = course.curso // Group by course name
      if (!grouped[key]) {
        grouped[key] = {
          nombre: course.curso,
          fecha: course.createdAt,
          participantes: [],
          data: [],
        }
      }
      grouped[key].data.push(course)
    })

    return Object.values(grouped)
  }

  // Función simplificada para procesar grupos
  const processGroups = (groups) => {
    return groups.map((group) => ({
      ...group,
      nombre: group.nombre || `${group.compania} - ${new Date(group.fecha).toLocaleDateString()}`,
    }))
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch workshops
        const workshopResponse = await axios.get("https://lacocina-backend-deploy.vercel.app/usuarios/taller")

        // Fetch courses
        const courseResponse = await axios.get("https://lacocina-backend-deploy.vercel.app/usuarios/curso")

        if (workshopResponse.data && Array.isArray(workshopResponse.data)) {
          // Process workshop data
          const grouped = groupWorkshops(workshopResponse.data)
          const processedWorkshops = processGroups(grouped)
          const sortedWorkshops = processedWorkshops.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

          setWorkshops(sortedWorkshops)

          // Workshop metrics
          const now = new Date()
          const currentMonth = now.getMonth()
          const currentYear = now.getFullYear()
          const usersThisMonth = workshopResponse.data.filter((user) => {
            const createdAt = new Date(user.createdAt)
            return createdAt.getMonth() === currentMonth && createdAt.getFullYear() === currentYear
          })

          setMetrics({
            totalUsers: workshopResponse.data.length,
            activeUsers: usersThisMonth.length,
            completionRate: `${Math.round((workshopResponse.data.filter((w) => w.consistenciaCompromiso > 0).length / workshopResponse.data.length) * 100)}%`,
          })
        }

        // Process course data
        if (courseResponse.data && Array.isArray(courseResponse.data)) {
          const groupedCourses = groupCourses(courseResponse.data)
          const processedCourses = processGroups(groupedCourses)
          const sortedCourses = processedCourses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

          setCourses(sortedCourses)

          // Course metrics
          const now = new Date()
          const currentMonth = now.getMonth()
          const currentYear = now.getFullYear()
          const courseUsersThisMonth = courseResponse.data.filter((user) => {
            const createdAt = new Date(user.createdAt)
            return createdAt.getMonth() === currentMonth && createdAt.getFullYear() === currentYear
          })

          setCourseMetrics({
            totalUsers: courseResponse.data.length,
            activeUsers: courseUsersThisMonth.length,
            completionRate: `${Math.round((courseResponse.data.filter((c) => c.consistenciaCompromiso > 0).length / courseResponse.data.length) * 100)}%`,
          })
        }
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Error al cargar los datos. Por favor, intente nuevamente.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const toggleCourseAccordion = (index) => {
    setOpenCourseAccordion(openCourseAccordion === index ? null : index)
  }

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index)
  }

  if (loading) {
    return <div className={styles.loading}>Cargando datos de talleres...</div>
  }

  if (error) {
    return <div className={styles.error}>{error}</div>
  }

  const latestWorkshop = workshops.length > 0 ? workshops[0] : null

  return (
    <div className={styles.dashboard}>
      <AdminHeader username="Administrador" />
      <div className={styles.content}>
        <div className={styles.metricsSection}>
          <MetricCard title="Total Usuarios de Talleres" value={metrics.totalUsers.toString()} icon={Users} />
          <MetricCard title="Usuarios Activos" value={metrics.activeUsers.toString()} icon={UserCheck} />
          <MetricCard title="Tasa de Finalización" value={metrics.completionRate} icon={TrendingUp} />
        </div>

        {latestWorkshop && (
          <>
            <div className={styles.dashboardSection}>
              <h2 className={styles.sectionTitle}>Taller más reciente: {latestWorkshop.nombre}</h2>

              {/* Resultados por Área de Desempeño */}
              <ResultsByCategory
                data={latestWorkshop.data}
                categoryField="areaDesempeno"
                categoryTitle="Área de Desempeño"
                categoryType="area"
              />

              {/* Resultados por Industria */}
              <ResultsByCategory
                data={latestWorkshop.data}
                categoryField="industriaSector"
                categoryTitle="Industria"
                categoryType="industria"
              />

              {/* Resultados por Sector */}
              <ResultsByCategory
                data={latestWorkshop.data}
                categoryField="sector"
                categoryTitle="Sector"
                categoryType="sector"
              />
            </div>

            {workshops.length > 1 && (
              <div className={styles.dashboardSection}>
                <h2 className={styles.sectionTitle}>Talleres Anteriores</h2>
                <div className={styles.accordionContainer}>
                  {workshops.slice(1).map((workshop, index) => (
                    <WorkshopAccordion
                      key={index}
                      workshop={workshop}
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

        {!latestWorkshop && <div className={styles.noData}>No se encontraron talleres disponibles.</div>}

        {/* Courses Section */}
        <div className={styles.metricsSection}>
          <MetricCard title="Total Usuarios de Cursos" value={courseMetrics.totalUsers.toString()} icon={Users} />
          <MetricCard
            title="Usuarios Activos de Cursos"
            value={courseMetrics.activeUsers.toString()}
            icon={UserCheck}
          />
          <MetricCard title="Tasa de Finalización de Cursos" value={courseMetrics.completionRate} icon={TrendingUp} />
        </div>

        {courses.length > 0 && (
          <>
            <div className={styles.dashboardSection}>
              <h2 className={styles.sectionTitle}>Curso más reciente: {courses[0].nombre || "Sin nombre"}</h2>

              {/* Resultados por Área de Desempeño */}
              <ResultsByCategory
                data={courses[0].data}
                categoryField="areaDesempeno"
                categoryTitle="Área de Desempeño"
                categoryType="area"
              />

              {/* Resultados por Industria */}
              <ResultsByCategory
                data={courses[0].data}
                categoryField="industriaSector"
                categoryTitle="Industria"
                categoryType="industria"
              />

              {/* Resultados por Sector */}
              <ResultsByCategory
                data={courses[0].data}
                categoryField="sector"
                categoryTitle="Sector"
                categoryType="sector"
              />
            </div>

            {courses.length > 1 && (
              <div className={styles.dashboardSection}>
                <h2 className={styles.sectionTitle}>Cursos Anteriores</h2>
                <div className={styles.accordionContainer}>
                  {courses.slice(1).map((course, index) => (
                    <CourseAccordion
                      key={index}
                      course={course}
                      index={index}
                      isOpen={openCourseAccordion === index}
                      toggleAccordion={toggleCourseAccordion}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {courses.length === 0 && <div className={styles.noData}>No se encontraron cursos disponibles.</div>}
      </div>
    </div>
  )
}

export default AdminDashboard
