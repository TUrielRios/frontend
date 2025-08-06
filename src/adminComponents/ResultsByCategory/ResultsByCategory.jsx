"use client"
import { useState, useRef } from "react"
import { Download, Maximize, X } from "lucide-react"
import AdminUserChart from "../AdminUserChart/AdminUserChart"
import styles from "./ResultsByCategory.module.css"
import html2canvas from "html2canvas"
import iconoDiamante from "../../assets/iconos-animados/diamante-icono.png"

// Function to download a chart as PNG
const downloadChartAsPNG = async (chartRef, fileName = "chart.png") => {
  if (!chartRef.current) return
  try {
    const originalElement = chartRef.current
    const clonedElement = originalElement.cloneNode(true)
    const elementsToRemove = clonedElement.querySelectorAll(
      `.${styles.chartFooter}, .${styles.previewButton}, .${styles.downloadButton}, button, [class*="button"]`,
    )
    elementsToRemove.forEach((el) => el.remove())
    const tempContainer = document.createElement("div")
    tempContainer.style.position = "absolute"
    tempContainer.style.left = "-9999px"
    tempContainer.style.top = "-9999px"
    tempContainer.style.width = originalElement.offsetWidth + "px"
    tempContainer.style.height = "auto"
    tempContainer.style.backgroundColor = "#ffffff"
    tempContainer.style.padding = "20px"
    tempContainer.appendChild(clonedElement)
    document.body.appendChild(tempContainer)
    await new Promise((resolve) => setTimeout(resolve, 100))
    const canvas = await html2canvas(tempContainer, {
      backgroundColor: "#ffffff",
      useCORS: true,
      allowTaint: false,
      scale: 2,
      logging: false,
      ignoreElements: (element) => {
        return (
          element.tagName === "BUTTON" ||
          element.classList.contains("chartFooter") ||
          element.classList.contains("previewButton") ||
          element.classList.contains("downloadButton")
        )
      },
    })
    document.body.removeChild(tempContainer)
    const pngUrl = canvas.toDataURL("image/png", 1.0)
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

// Helper function to map backend phase names to display names
const mapBackendPhaseToDisplay = (backendPhase) => {
  if (!backendPhase) {
    return "Fase Desconocida"
  }

  // Normalize input to lowercase and remove spaces for consistent mapping keys
  const normalizedInput = String(backendPhase).toLowerCase().replace(/\s/g, "")

  const displayMap = {
    validacionsocial: "VALIDACIÓN SOCIAL",
    atractivo: "ATRACTIVO",
    reciprocidad: "RECIPROCIDAD",
    autoridad: "AUTORIDAD",
    autenticidad: "AUTENTICIDAD",
    consistenciaycompromiso: "CONSISTENCIA Y COMPROMISO",
    consistenciacompromiso: "CONSISTENCIA Y COMPROMISO", // Alternative spelling
    // Handle explicit problematic strings (case-insensitive)
    undefined: "Fase Desconocida",
    null: "Fase Desconocida",
  }

  // Check if the normalized input is a key in our map
  if (displayMap[normalizedInput]) {
    return displayMap[normalizedInput]
  }

  // If it's not in the map, check for the raw string "undefined" or "null" (case-insensitive)
  if (normalizedInput === "undefined" || normalizedInput === "null") {
    return "Fase Desconocida"
  }

  // If no specific mapping, return the original phase name
  return backendPhase
}

// LOCAL Modal Component for Category Chart Preview
const CategoryChartPreviewModal = ({
  isOpen,
  onClose,
  title,
  chartData, // Phase averages for the category
  detailedQuestionScores, // Average question scores for the category
  chartType = "radar",
}) => {
  const chartRef = useRef(null)

  const displayTitle = title
  const maxValue = 10

  const handleDownload = () => {
    downloadChartAsPNG(chartRef, `${displayTitle.replace(/\s+/g, "-").toLowerCase()}-${chartType}.png`)
  }

  if (!isOpen) return null

  let averageScore = null
  if (chartData) {
    const validScores = Object.values(chartData).filter((score) => score > 0)
    averageScore =
      validScores.length > 0 ? (validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(1) : null
  }

  const isGapChart = chartType === "gaap"

  // Debug logging
  console.log('Modal Data:', { title, chartData, detailedQuestionScores, chartType })

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
                <img className={styles.chartIcon} src={iconoDiamante || "/placeholder.svg"} alt="" />
                <div className={styles.titleInfo}>
                  <h2>Vista previa: {displayTitle}</h2>
                  <span className={styles.subtitle}>
                    {isGapChart ? "Brecha entre categorías" : "Análisis de factores"}
                  </span>
                </div>
              </div>
            </div>

            {detailedQuestionScores && Object.keys(detailedQuestionScores).length > 0 ? (
              // Mostrar preguntas individuales promedio para la categoría
              <div className={styles.factorsList}>
                <h3>Puntuaciones Promedio por Pregunta</h3>
                {Object.entries(detailedQuestionScores).map(([faseKey, faseData]) => {
                  console.log('Processing fase:', faseKey, faseData)
                  
                  if (
                    !faseData ||
                    !faseData.preguntas ||
                    !Array.isArray(faseData.preguntas) ||
                    faseData.preguntas.length === 0
                  ) {
                    console.log('Skipping fase due to missing data:', faseKey)
                    return null
                  }

                  const displayFaseName = mapBackendPhaseToDisplay(faseKey)
                  console.log('Mapped fase name:', faseKey, '->', displayFaseName)

                  return (
                    <div key={faseKey} className={styles.gapAreaContainer}>
                      <h4 className={styles.areaTitle}>{displayFaseName}</h4>
                      {faseData.preguntas.map((pregunta) => (
                        <div key={pregunta.preguntaId || pregunta.id} className={styles.factorItem}>
                          <div className={styles.factorInfo}>
                            <span className={styles.factorName}>
                              {pregunta.textoPregunta || pregunta.texto || `Pregunta ${pregunta.preguntaId}`}
                            </span>
                            <span className={styles.factorScore}>
                              {typeof pregunta.puntuacion === 'number' ? pregunta.puntuacion.toFixed(1) : 'N/A'}
                            </span>
                          </div>
                          <div className={styles.factorBar}>
                            <div
                              className={styles.factorProgress}
                              style={{ 
                                width: `${typeof pregunta.puntuacion === 'number' ? (pregunta.puntuacion / maxValue) * 100 : 0}%` 
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                })}
                {averageScore && (
                  <div className={styles.averageScore}>
                    <div className={styles.factorInfo}>
                      <span className={styles.factorName}>Promedio General de Fases</span>
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
            ) : (
              // Lógica original para mostrar factores de fase para gráficos agregados
              <div className={styles.factorsList}>
                <h3>{isGapChart ? "Valores por Categoría" : "Factores de Influencia"}</h3>
                {isGapChart
                  ? Object.entries(chartData || {}).map(([area, areaData], areaIndex) => (
                      <div key={`area-${areaIndex}`} className={styles.gapAreaContainer}>
                        <h4 className={styles.areaTitle}>{area}</h4>
                        {Object.entries(areaData).map(([factor, score], factorIndex) => (
                          <div key={`${area}-${factor}`} className={styles.factorItem}>
                            <div className={styles.factorInfo}>
                              <span className={styles.factorName}>{factor}</span>
                              <span className={styles.factorScore}>{score > 0 ? score.toFixed(1) : "N/A"}</span>
                            </div>
                            <div className={styles.factorBar}>
                              <div
                                className={styles.factorProgress}
                                style={{
                                  width: `${(score / maxValue) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ))
                  : Object.entries(chartData || {}).map(([factor, score], index) => (
                      <div key={factor} className={styles.factorItem}>
                        <div className={styles.factorInfo}>
                          <span className={styles.factorName}>{factor}</span>
                          <span className={styles.factorScore}>{score > 0 ? score.toFixed(1) : "N/A"}</span>
                        </div>
                        <div className={styles.factorBar}>
                          <div
                            className={styles.factorProgress}
                            style={{
                              width: `${(score / maxValue) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
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
            )}
          </div>
          {/* Contenido principal - el gráfico */}
          <div className={styles.mainContent}>
            <div className={styles.chartsSection}>
              <div className={styles.chartCard}>
                <div className={styles.chartContainer}>
                  <AdminUserChart data={chartData} type={chartType} theme="light" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente para gráficos individuales por categoría
const CategoryRadarChart = ({ title, data, categoryType, detailedQuestionScores }) => {
  const chartRef = useRef(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  
  const handleDownload = () => {
    downloadChartAsPNG(chartRef, `${title.replace(/\s+/g, "-").toLowerCase()}-${categoryType}.png`)
  }
  
  const openPreview = () => {
    console.log('Opening preview with data:', { title, data, detailedQuestionScores })
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
      <CategoryChartPreviewModal
        isOpen={isPreviewOpen}
        onClose={closePreview}
        title={title}
        chartData={data}
        detailedQuestionScores={detailedQuestionScores}
      />
    </>
  )
}

// Componente para el gráfico de resultado promedio
const AverageRadarChart = ({ data, categoryType, title }) => {
  const chartRef = useRef(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  
  const handleDownload = () => {
    downloadChartAsPNG(chartRef, `resultado-promedio-${categoryType}.png`)
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
      <CategoryChartPreviewModal
        isOpen={isPreviewOpen}
        onClose={closePreview}
        title={title}
        chartData={data}
        detailedQuestionScores={null}
      />
    </>
  )
}

// Componente para el gráfico de gap
const GapRadarChart = ({ data, categoryType, title }) => {
  const chartRef = useRef(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  
  const handleDownload = () => {
    downloadChartAsPNG(chartRef, `gap-${categoryType}.png`)
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
      <CategoryChartPreviewModal
        isOpen={isPreviewOpen}
        onClose={closePreview}
        title={title}
        chartData={data}
        chartType="gaap"
        detailedQuestionScores={null}
      />
    </>
  )
}

// Función para calcular resultados por cualquier categoría
const calculateResultsByCategory = (data, categoryField) => {
  const categoryGroups = {}
  
  // Agrupar por la categoría especificada
  data.forEach((item) => {
    const category = item[categoryField] || "Sin Categoría"
    if (!categoryGroups[category]) {
      categoryGroups[category] = []
    }
    categoryGroups[category].push(item)
  })

  const categoryResults = {}
  const allCategoryValues = []
  const detailedQuestionsByCategory = {}

  Object.keys(categoryGroups).forEach((category) => {
    const itemsInCategory = categoryGroups[category]
    const count = itemsInCategory.length

    // Calculate phase averages for the current category
    const phaseAverages = {
      ATRACTIVO:
        itemsInCategory.reduce((sum, item) => sum + (item.promediosCalculados?.atractivo || item.atractivo || 0), 0) /
        count,
      RECIPROCIDAD:
        itemsInCategory.reduce(
          (sum, item) => sum + (item.promediosCalculados?.reciprocidad || item.reciprocidad || 0),
          0,
        ) / count,
      AUTORIDAD:
        itemsInCategory.reduce((sum, item) => sum + (item.promediosCalculados?.autoridad || item.autoridad || 0), 0) /
        count,
      AUTENTICIDAD:
        itemsInCategory.reduce(
          (sum, item) => sum + (item.promediosCalculados?.autenticidad || item.autenticidad || 0),
          0,
        ) / count,
      "CONSISTENCIA Y COMPROMISO":
        itemsInCategory.reduce(
          (sum, item) => sum + (item.promediosCalculados?.consistenciaCompromiso || item.consistenciaCompromiso || 0),
          0,
        ) / count,
      "VALIDACIÓN SOCIAL":
        itemsInCategory.reduce(
          (sum, item) => sum + (item.promediosCalculados?.validacionSocial || item.validacionSocial || 0),
          0,
        ) / count,
    }
    
    categoryResults[category] = phaseAverages
    allCategoryValues.push(phaseAverages)

    // Calculate average question scores for the current category
    const aggregatedQuestions = {}

    itemsInCategory.forEach((user) => {
      if (user.tieneRespuestasIndividuales && user.respuestasPorFase) {
        Object.entries(user.respuestasPorFase).forEach(([faseKey, faseData]) => {
          if (faseData && faseData.preguntas && Array.isArray(faseData.preguntas)) {
            faseData.preguntas.forEach((question) => {
              const questionId = question.preguntaId || question.id
              if (!aggregatedQuestions[questionId]) {
                aggregatedQuestions[questionId] = {
                  totalScore: 0,
                  count: 0,
                  text: question.textoPregunta || question.texto,
                  category: question.categoria || 'Sin Categoría',
                  phase: faseKey, // Use the fase key directly from respuestasPorFase
                }
              }
              aggregatedQuestions[questionId].totalScore += (question.puntuacion || 0)
              aggregatedQuestions[questionId].count += 1
            })
          }
        })
      }
    })

    const averagedQuestions = {}
    Object.values(aggregatedQuestions).forEach((q) => {
      const average = q.count > 0 ? q.totalScore / q.count : 0
      const phaseKey = q.phase

      if (!averagedQuestions[phaseKey]) {
        averagedQuestions[phaseKey] = {
          promedio: 0,
          preguntas: [],
        }
      }
      
      averagedQuestions[phaseKey].preguntas.push({
        preguntaId: Object.keys(aggregatedQuestions).find(id => aggregatedQuestions[id] === q),
        textoPregunta: q.text,
        puntuacion: Number.parseFloat(average.toFixed(1)),
        categoria: q.category,
        fase: q.phase,
      })
    })

    // Sort questions by ID within each phase and calculate phase averages
    Object.keys(averagedQuestions).forEach((phaseKey) => {
      averagedQuestions[phaseKey].preguntas.sort((a, b) => 
        parseInt(a.preguntaId) - parseInt(b.preguntaId)
      )
      
      const phaseQuestionScores = averagedQuestions[phaseKey].preguntas.map((q) => q.puntuacion)
      averagedQuestions[phaseKey].promedio =
        phaseQuestionScores.length > 0
          ? Number.parseFloat(
              (phaseQuestionScores.reduce((sum, s) => sum + s, 0) / phaseQuestionScores.length).toFixed(1),
            )
          : 0
    })

    detailedQuestionsByCategory[category] = averagedQuestions
    console.log(`Detailed questions for category ${category}:`, averagedQuestions)
  })

  // Calculate overall average result
  const averageResult = {
    ATRACTIVO: allCategoryValues.reduce((sum, category) => sum + category.ATRACTIVO, 0) / allCategoryValues.length,
    RECIPROCIDAD:
      allCategoryValues.reduce((sum, category) => sum + category.RECIPROCIDAD, 0) / allCategoryValues.length,
    AUTORIDAD: allCategoryValues.reduce((sum, category) => sum + category.AUTORIDAD, 0) / allCategoryValues.length,
    AUTENTICIDAD:
      allCategoryValues.reduce((sum, category) => sum + category.AUTENTICIDAD, 0) / allCategoryValues.length,
    "CONSISTENCIA Y COMPROMISO":
      allCategoryValues.reduce((sum, category) => sum + category["CONSISTENCIA Y COMPROMISO"], 0) /
      allCategoryValues.length,
    "VALIDACIÓN SOCIAL":
      allCategoryValues.reduce((sum, category) => sum + category["VALIDACIÓN SOCIAL"], 0) / allCategoryValues.length,
  }

  return {
    categoryResults,
    averageResult,
    gapResult: categoryResults,
    detailedQuestionsByCategory,
  }
}

// Componente principal para mostrar resultados por categoría
const ResultsByCategory = ({ data, categoryField, categoryTitle, categoryType }) => {
  if (!data || data.length === 0) {
    return (
      <div className={styles.noData}>
        No hay datos disponibles para mostrar resultados por {categoryTitle.toLowerCase()}.
      </div>
    )
  }

  const { categoryResults, averageResult, gapResult, detailedQuestionsByCategory } = calculateResultsByCategory(
    data,
    categoryField,
  )

  console.log('Calculated results:', { categoryResults, detailedQuestionsByCategory })

  return (
    <div className={styles.categoryResultsContainer}>
      <div className={styles.resultsSection}>
        <h3 className={styles.subsectionTitle}>Resultados según {categoryTitle}</h3>
        <div className={styles.chartsGrid}>
          {Object.keys(categoryResults).map((category, index) => (
            <CategoryRadarChart
              key={index}
              title={category}
              data={categoryResults[category]}
              categoryType={categoryType}
              detailedQuestionScores={detailedQuestionsByCategory[category]}
            />
          ))}
        </div>
      </div>
      <div className={styles.resultsSection}>
        <h3 className={styles.subsectionTitle}>Resultado Promedio y Brecha por {categoryTitle}</h3>
        <div className={styles.chartsGrid}>
          <AverageRadarChart
            data={averageResult}
            categoryType={categoryType}
            title={`Resultado Promedio por ${categoryTitle}`}
          />
          <GapRadarChart
            data={gapResult}
            categoryType={categoryType}
            title={`Brecha entre ${categoryTitle}`}
          />
        </div>
      </div>
    </div>
  )
}

export default ResultsByCategory