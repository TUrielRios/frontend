"use client"
import { useRef } from "react"
import { X } from "lucide-react"
import AdminUserChart from "../../AdminUserChart/AdminUserChart"
import styles from "../../ResultsByCategory/ResultsByCategory.module.css" // Reusamos estilos existentes
import html2canvas from "html2canvas"
import iconoDiamante from "../../../assets/iconos-animados/diamante-icono.png"

// Función para descargar un gráfico como PNG (se mantiene aquí por simplicidad)
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

// Este modal ahora se usará para vistas previas de usuarios individuales Y vistas previas de gráficos agregados.
// Recibirá una prop 'userData' (para usuario individual) o 'chartData' y 'title' (para gráficos agregados).
const ChartPreviewModal = ({
  isOpen,
  onClose,
  userData,
  chartData: aggregatedChartData,
  title: aggregatedTitle,
  chartType = "radar",
}) => {
  const chartRef = useRef(null)

  // Determinar qué datos mostrar según las props
  const isIndividualUserPreview = !!userData // Si se pasa userData, es una vista previa de usuario
  const dataForChart = isIndividualUserPreview ? userData.promediosCalculados : aggregatedChartData
  const dataForQuestionsList = isIndividualUserPreview ? userData.respuestasPorFase : null
  const displayTitle = isIndividualUserPreview
    ? `Resultados de ${userData.nombre || userData.compania || userData.codigoTaller}`
    : aggregatedTitle

  const handleDownload = () => {
    // La lógica para descargar el gráfico se mantiene en gran medida igual
    downloadChartAsPNG(chartRef, `${displayTitle.replace(/\s+/g, "-").toLowerCase()}-${chartType}.png`)
  }

  if (!isOpen) return null

  // Calcular el valor máximo para las barras de progreso (las puntuaciones de fase y pregunta van de 1 a 10)
  const maxValue = 10

  // Calcular promedio general de fases si es una vista previa de usuario individual
  let averageScore = null
  if (isIndividualUserPreview && dataForChart) {
    const validScores = Object.values(dataForChart).filter((score) => score > 0)
    averageScore =
      validScores.length > 0 ? (validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(1) : null
  } else if (aggregatedChartData) {
    // Para gráficos agregados
    const validScores = Object.values(aggregatedChartData).filter((score) => score > 0)
    averageScore =
      validScores.length > 0 ? (validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(1) : null
  }

  // Determinar si es un gráfico de brecha (gap)
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
                <img className={styles.chartIcon} src={iconoDiamante || "/placeholder.svg"} alt="" />
                <div className={styles.titleInfo}>
                  <h2>Vista previa: {displayTitle}</h2>
                  <span className={styles.subtitle}>
                    {isIndividualUserPreview
                      ? "Resultados detallados del usuario"
                      : isGapChart
                        ? "Brecha entre categorías"
                        : "Análisis de factores"}
                  </span>
                </div>
              </div>
            </div>

            {isIndividualUserPreview && dataForQuestionsList ? (
              // Mostrar preguntas individuales para la vista previa de usuario individual
              <div className={styles.factorsList}>
                <h3>Puntuaciones por Pregunta</h3>
                {Object.keys(dataForQuestionsList).map((faseKey) => {
                  const faseData = dataForQuestionsList[faseKey]
                  // Asegúrate de que las preguntas dentro de la fase existan y sean un array
                  if (
                    !faseData ||
                    !faseData.preguntas ||
                    !Array.isArray(faseData.preguntas) ||
                    faseData.preguntas.length === 0
                  )
                    return null

                  return (
                    <div key={faseKey} className={styles.gapAreaContainer}>
                      {" "}
                      {/* Reutilizamos gapAreaContainer para agrupar por fase */}
                      <h4 className={styles.areaTitle}>{faseKey.replace(/([A-Z])/g, " $1").toUpperCase()}</h4>{" "}
                      {/* Convierte camelCase a Título de Caso (ej. validacionSocial -> VALIDACION SOCIAL) */}
                      {faseData.preguntas.map((pregunta) => (
                        <div key={pregunta.preguntaId} className={styles.factorItem}>
                          <div className={styles.factorInfo}>
                            <span className={styles.factorName}>{pregunta.textoPregunta}</span>
                            <span className={styles.factorScore}>{pregunta.puntuacion.toFixed(1)}</span>
                          </div>
                          <div className={styles.factorBar}>
                            <div
                              className={styles.factorProgress}
                              style={{ width: `${(pregunta.puntuacion / maxValue) * 100}%` }} // Escala al 100% de la barra
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                })}
                {averageScore && ( // Mostrar promedio general de fases para la vista previa de usuario individual
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
              // O para usuarios individuales que NO tienen respuestas individuales (tieneRespuestasIndividuales: false)
              <div className={styles.factorsList}>
                <h3>{isGapChart ? "Valores por Categoría" : "Factores de Influencia"}</h3>
                {isGapChart
                  ? Object.entries(dataForChart || {}).map(([area, areaData], areaIndex) => (
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
                                  width: `${(score / maxValue) * 100}%`, // Escala al 100% de la barra
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ))
                  : Object.entries(dataForChart || {}).map(([factor, score], index) => (
                      <div key={factor} className={styles.factorItem}>
                        <div className={styles.factorInfo}>
                          <span className={styles.factorName}>{factor}</span>
                          <span className={styles.factorScore}>{score > 0 ? score.toFixed(1) : "N/A"}</span>
                        </div>
                        <div className={styles.factorBar}>
                          <div
                            className={styles.factorProgress}
                            style={{
                              width: `${(score / maxValue) * 100}%`, // Escala al 100% de la barra
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
                  {/* Pasa los datos correctos para el gráfico */}
                  <AdminUserChart data={dataForChart} type={chartType} theme="light" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChartPreviewModal
