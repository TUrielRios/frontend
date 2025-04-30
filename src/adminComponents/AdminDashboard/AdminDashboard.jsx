import { useState, useEffect, useRef } from "react"
import { Download, Users, UserCheck, TrendingUp, X, Maximize, ChevronDown, ChevronUp } from "lucide-react"
import AdminUserChart from "../AdminUserChart/AdminUserChart"
import styles from "./AdminDashboard.module.css"
import html2canvas from "html2canvas"
import AdminHeader from "../AdminHeader/AdminHeader"
import axios from "axios"

// Función para descargar un gráfico como PNG
const downloadChartAsPNG = async (chartRef, fileName = "chart.png") => {
  if (!chartRef.current) return

  try {
    const canvas = await html2canvas(chartRef.current, {
      backgroundColor: null,
      useCORS: true,
      allowTaint: false,
      scale: 2,
    })

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


const ChartPreviewModal = ({ isOpen, onClose, title, chartData, chartType = "radar" }) => {
  const chartRef = useRef(null)  
  const handleDownload = () => {
    downloadChartAsPNG(chartRef, `${title.replace(/\s+/g, "-").toLowerCase()}-${chartType}.png`)
  }
  if (!isOpen) return null
  
  // Calcular el máximo valor para las barras de progreso (normalmente es 5)
  const maxValue = 5
  
  // Calcular promedio general
  const validScores = Object.values(chartData).filter(score => score > 0)
  const averageScore = validScores.length > 0 
    ? (validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(1)
    : null
    
  // Calcular rango
  const minScore = Math.min(...Object.values(chartData)).toFixed(1)
  const maxScore = Math.max(...Object.values(chartData)).toFixed(1)

  // Determinar si es un gráfico de gap y procesar los datos apropiadamente
  const isGapChart = chartType === "gaap"
  
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={24} />
        </button>

        <div className={styles.modalContent}>
          {/* Sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.previewHeader}>
              <div className={styles.titleIcon}>
                <span className={styles.chartIcon}>📊</span>
                <div className={styles.titleInfo}>
                  <h2>Vista previa: {title}</h2>
                  <span className={styles.subtitle}>
                    {isGapChart ? "Gap entre áreas" : "Análisis de factores"}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.factorsList}>
              <h3>{isGapChart ? "Valores por Área" : "Factores de Influencia"}</h3>
              
              {isGapChart ? (
                // Visualización para gráfico Gap
                Object.entries(chartData).map(([area, areaData], areaIndex) => (
                  <div key={`area-${areaIndex}`} className={styles.gapAreaContainer}>
                    <h4 className={styles.areaTitle}>{area}</h4>
                    {Object.entries(areaData).map(([factor, score], factorIndex) => (
                      <div key={`${area}-${factor}`} className={styles.factorItem}>
                        <div className={styles.factorInfo}>
                          <span className={styles.factorName}>{factor}</span>
                          <span className={styles.factorScore}>
                            {score > 0 ? score.toFixed(1) : 'N/A'}
                          </span>
                        </div>
                        <div className={styles.factorBar}>
                          <div 
                            className={styles.factorProgress} 
                            style={{ 
                              width: `${(score / maxValue) * 45}%`,
                            }} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                // Visualización para gráfico Radar normal
                Object.entries(chartData).map(([factor, score], index) => (
                  <div key={factor} className={styles.factorItem}>
                    <div className={styles.factorInfo}>
                      <span className={styles.factorName}>{factor}</span>
                      <span className={styles.factorScore}>
                        {score > 0 ? score.toFixed(1) : 'N/A'}
                      </span>
                    </div>
                    <div className={styles.factorBar}>
                      <div 
                        className={styles.factorProgress} 
                        style={{ 
                          width: `${(score / maxValue) * 45}%`,
                        }} 
                      />
                    </div>
                  </div>
                ))
              )}

              {!isGapChart && averageScore && (
                <div className={styles.averageScore}>
                  <div className={styles.factorInfo}>
                    <span className={styles.factorName}>Promedio General</span>
                    <span className={styles.factorScore}>{averageScore}</span>
                  </div>
                  <div className={styles.factorBar}>
                    <div 
                      className={styles.averageProgress} 
                      style={{ width: `${(averageScore / maxValue) * 100}%` }} 
                    />
                  </div>
                </div>
              )}
            
            </div>
          
          </div>

          {/* Main Content */}
          <div className={styles.mainContent}>
            <div className={styles.chartsSection}>
              <div className={styles.chartCard}>
                <div className={styles.chartContainer}>
                  <AdminUserChart 
                    data={chartData} 
                    type={chartType} 
                    theme="light" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )}



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
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const handleDownload = () => {
    downloadChartAsPNG(chartRef, `${title.replace(/\s+/g, "-").toLowerCase()}-radar.png`)
  }

  const openPreview = () => {
    setIsPreviewOpen(true)
  }

  const closePreview = () => {
    setIsPreviewOpen(false)
  }

  return (
    <>
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
          <button className={styles.previewButton} onClick={openPreview}>
            <span>Vista previa</span>
            <Maximize size={16} />
          </button>
          <button className={styles.downloadButton} onClick={handleDownload}>
            <span>Descargar resultado</span>
            <Download size={16} />
          </button>
        </div>
      </div>
      
      <ChartPreviewModal 
        isOpen={isPreviewOpen} 
        onClose={closePreview} 
        title={title} 
        chartData={data} 
      />
    </>
  )
}

// Componente para el gráfico de resultado promedio
const AverageRadarChart = ({ data }) => {
  const chartRef = useRef(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const handleDownload = () => {
    downloadChartAsPNG(chartRef, "resultado-promedio.png")
  }

  const openPreview = () => {
    setIsPreviewOpen(true)
  }

  const closePreview = () => {
    setIsPreviewOpen(false)
  }

  return (
    <>
      <div className={styles.chartCard} ref={chartRef}>
        <div className={styles.chartHeader}>
          <div className={styles.chartTitle}>
            <h3>Resultado Promedio</h3>
          </div>
        </div>
        <div className={styles.chartBody}>
          <AdminUserChart data={data} type="radar" theme="light" />
        </div>
        <div className={styles.chartFooter}>
          <button className={styles.previewButton} onClick={openPreview}>
            <span>Vista previa</span>
            <Maximize size={16} />
          </button>
          <button className={styles.downloadButton} onClick={handleDownload}>
            <span>Descargar resultado</span>
            <Download size={16} />
          </button>
        </div>
      </div>
      
      <ChartPreviewModal 
        isOpen={isPreviewOpen} 
        onClose={closePreview} 
        title="Resultado Promedio" 
        chartData={data} 
      />
    </>
  )
}

// Componente para el gráfico de gap entre áreas
const GapRadarChart = ({ data }) => {
  const chartRef = useRef(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const handleDownload = () => {
    downloadChartAsPNG(chartRef, "gap-areas.png")
  }

  const openPreview = () => {
    setIsPreviewOpen(true)
  }

  const closePreview = () => {
    setIsPreviewOpen(false)
  }

  return (
    <>
      <div className={styles.chartCard} ref={chartRef}>
        <div className={styles.chartHeader}>
          <div className={styles.chartTitle}>
            <h3>Gap entre áreas</h3>
          </div>
        </div>
        <div className={styles.chartBody}>
          <AdminUserChart data={data} type="gaap" theme="light" />
        </div>
        <div className={styles.chartFooter}>
          <button className={styles.previewButton} onClick={openPreview}>
            <span>Vista previa</span>
            <Maximize size={16} />
          </button>
          <button className={styles.downloadButton} onClick={handleDownload}>
            <span>Descargar resultado</span>
            <Download size={16} />
          </button>
        </div>
      </div>
      
      <ChartPreviewModal 
        isOpen={isPreviewOpen} 
        onClose={closePreview} 
        title="Gap entre áreas" 
        chartData={data}
        chartType="gaap" 
      />
    </>
  )
}

// Componente de acordeón para mostrar talleres anteriores
const WorkshopAccordion = ({ workshop, index, isOpen, toggleAccordion }) => {
  return (
    <div className={styles.accordionItem}>
      <div 
        className={`${styles.accordionHeader} ${isOpen ? styles.active : ''}`}
        onClick={() => toggleAccordion(index)}
      >
        <h3 className={styles.accordionTitle}>{workshop.nombre || `Taller ${index + 1}`}</h3>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>
      
      {isOpen && (
        <div className={styles.accordionContent}>
          <div className={styles.chartsGrid}>
            {workshop.areaResults && Object.keys(workshop.areaResults).map((area, idx) => (
              <AreaRadarChart key={idx} title={area} data={workshop.areaResults[area]} />
            ))}
          </div>
          
          <div className={styles.chartsGrid}>
            <AverageRadarChart data={workshop.averageResult} />
            <GapRadarChart data={workshop.gapResult} />
          </div>
        </div>
      )}
    </div>
  );
};

const AdminDashboard = () => {
  const [workshops, setWorkshops] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [openAccordion, setOpenAccordion] = useState(null)
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    completionRate: 0
  })

  // Función para agrupar talleres por compañía y fecha
  const groupWorkshops = (data) => {
    const grouped = {};
    
    data.forEach(workshop => {
      const key = `${workshop.compania}_${workshop.fecha}`;
      if (!grouped[key]) {
        grouped[key] = {
          compania: workshop.compania,
          fecha: workshop.createdAt,
          industriaSector: workshop.industriaSector,
          participantes: [],
          data: []
        };
      }
      grouped[key].data.push(workshop);
    });
    
    return Object.values(grouped);
  };

  // Función para calcular promedios por área
  const calculateAverages = (groupedWorkshops) => {
    return groupedWorkshops.map(group => {
      const areas = {};
      
      // Agrupar por área de desempeño
      const areaGroups = {};
      group.data.forEach(workshop => {
        if (!areaGroups[workshop.areaDesempeno]) {
          areaGroups[workshop.areaDesempeno] = [];
        }
        areaGroups[workshop.areaDesempeno].push(workshop);
      });
      
      // Calcular promedio para cada área
      Object.keys(areaGroups).forEach(area => {
        const workshopsInArea = areaGroups[area];
        const count = workshopsInArea.length;
        
        areas[area] = {
          ATRACTIVO: workshopsInArea.reduce((sum, w) => sum + (w.atractivo || 0), 0) / count,
          RECIPROCIDAD: workshopsInArea.reduce((sum, w) => sum + (w.reciprocidad || 0), 0) / count,
          AUTORIDAD: workshopsInArea.reduce((sum, w) => sum + (w.autoridad || 0), 0) / count,
          AUTENTICIDAD: workshopsInArea.reduce((sum, w) => sum + (w.autenticidad || 0), 0) / count,
          "CONSISTENCIA Y COMPROMISO": workshopsInArea.reduce((sum, w) => sum + (w.consistenciaCompromiso || 0), 0) / count,
          "VALIDACIÓN SOCIAL": workshopsInArea.reduce((sum, w) => sum + (w.validacionSocial || 0), 0) / count
        };
      });
      
      // Calcular promedio general
      const allValues = [];
      Object.values(areas).forEach(area => {
        Object.values(area).forEach(value => allValues.push(value));
      });
      
      const averageResult = {
        ATRACTIVO: allValues.filter((_, i) => i % 6 === 0).reduce((a, b) => a + b, 0) / (allValues.length / 6),
        RECIPROCIDAD: allValues.filter((_, i) => i % 6 === 1).reduce((a, b) => a + b, 0) / (allValues.length / 6),
        AUTORIDAD: allValues.filter((_, i) => i % 6 === 2).reduce((a, b) => a + b, 0) / (allValues.length / 6),
        AUTENTICIDAD: allValues.filter((_, i) => i % 6 === 3).reduce((a, b) => a + b, 0) / (allValues.length / 6),
        "CONSISTENCIA Y COMPROMISO": allValues.filter((_, i) => i % 6 === 4).reduce((a, b) => a + b, 0) / (allValues.length / 6),
        "VALIDACIÓN SOCIAL": allValues.filter((_, i) => i % 6 === 5).reduce((a, b) => a + b, 0) / (allValues.length / 6)
      };
      
      return {
        ...group,
        nombre: `${group.compania} - ${new Date(group.fecha).toLocaleDateString()}`,
        areaResults: areas,
        averageResult,
        gapResult: areas
      };
    });
  };

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        setLoading(true)
        const response = await axios.get('https://lacocina-backend-deploy.vercel.app/usuarios/taller')
        
        if (response.data && Array.isArray(response.data)) {
          // Agrupar talleres por compañía y fecha
          const grouped = groupWorkshops(response.data);
          
          // Calcular promedios
          const processedWorkshops = calculateAverages(grouped);
          
          // Ordenar por fecha (más reciente primero)
          const sortedWorkshops = processedWorkshops.sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
          );
          
          setWorkshops(sortedWorkshops);

          //Obtener usuarios activos
          const now = new Date();
          const currentMonth = now.getMonth(); // Mes actual (0-11)
          const currentYear = now.getFullYear(); // Año actual
          const usersThisMonth = response.data.filter(user => {
            const createdAt = new Date(user.createdAt); // Convertir a objeto Date
            return (
              createdAt.getMonth() === currentMonth &&
              createdAt.getFullYear() === currentYear
            );
          });
          
          // Calcular métricas
          setMetrics({
            totalUsers: response.data.length,
            activeUsers: usersThisMonth.length,
            completionRate: `${Math.round((response.data.filter(w => w.consistenciaCompromiso > 0).length / response.data.length) * 100)}%`
          });
        }
      } catch (err) {
        console.error("Error fetching workshops:", err)
        setError("Error al cargar los datos de talleres. Por favor, intente nuevamente.")
      } finally {
        setLoading(false)
      }
    }
    
    fetchWorkshops()
  }, [])

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
          <MetricCard title="Total Usuarios" value={metrics.totalUsers.toString()}  icon={Users} />
          <MetricCard title="Usuarios Activos" value={metrics.activeUsers.toString()} icon={UserCheck} />
          <MetricCard title="Tasa de Finalización" value={metrics.completionRate} icon={TrendingUp} />
        </div>

        {latestWorkshop && (
          <>
            <div className={styles.dashboardSection}>
              <h2 className={styles.sectionTitle}>
                Taller más reciente: {latestWorkshop.nombre} 

              </h2>
              
              <div className={styles.resultsSection}>
                <h3 className={styles.subsectionTitle}>Resultados según Área de Desempeño</h3>
                <div className={styles.chartsGrid}>
                  {latestWorkshop.areaResults && Object.keys(latestWorkshop.areaResults).map((area, index) => (
                    <AreaRadarChart key={index} title={area} data={latestWorkshop.areaResults[area]} />
                  ))}
                </div>
              </div>
              
              <div className={styles.resultsSection}>
                <h3 className={styles.subsectionTitle}>Resultado por Industria</h3>
                <div className={styles.chartsGrid}>
                  <AverageRadarChart data={latestWorkshop.averageResult} />
                  <GapRadarChart data={latestWorkshop.gapResult} />
                </div>
              </div>
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
        
        {!latestWorkshop && (
          <div className={styles.noData}>
            No se encontraron talleres disponibles.
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard