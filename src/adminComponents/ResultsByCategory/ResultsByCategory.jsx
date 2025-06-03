"use client"

import { useState, useRef } from "react"
import { Download, Maximize, X } from "lucide-react"
import AdminUserChart from "../AdminUserChart/AdminUserChart"
import styles from "./ResultsByCategory.module.css"
import html2canvas from "html2canvas"
import iconoDiamante from "../../assets/iconos-animados/diamante-icono.png"

// Función para descargar un gráfico como PNG
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

// Componente del modal de vista previa
const ChartPreviewModal = ({ isOpen, onClose, title, chartData, chartType = "radar" }) => {
  const chartRef = useRef(null)
  const handleDownload = () => {
    downloadChartAsPNG(chartRef, `${title.replace(/\s+/g, "-").toLowerCase()}-${chartType}.png`)
  }
  if (!isOpen) return null

  // Calcular el máximo valor para las barras de progreso (normalmente es 5)
  const maxValue = 5

  // Calcular promedio general
  const validScores = Object.values(chartData).filter((score) => score > 0)
  const averageScore =
    validScores.length > 0 ? (validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(1) : null

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
                <img className={styles.chartIcon} src={iconoDiamante || "/placeholder.svg"} alt="" />
                <div className={styles.titleInfo}>
                  <h2>Vista previa: {title}</h2>
                  <span className={styles.subtitle}>
                    {isGapChart ? "Gap entre categorías" : "Análisis de factores"}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.factorsList}>
              <h3>{isGapChart ? "Valores por Categoría" : "Factores de Influencia"}</h3>

              {isGapChart
                ? // Visualización para gráfico Gap
                  Object.entries(chartData).map(([area, areaData], areaIndex) => (
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
                                width: `${(score / maxValue) * 50}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ))
                : // Visualización para gráfico Radar normal
                  Object.entries(chartData).map(([factor, score], index) => (
                    <div key={factor} className={styles.factorItem}>
                      <div className={styles.factorInfo}>
                        <span className={styles.factorName}>{factor}</span>
                        <span className={styles.factorScore}>{score > 0 ? score.toFixed(1) : "N/A"}</span>
                      </div>
                      <div className={styles.factorBar}>
                        <div
                          className={styles.factorProgress}
                          style={{
                            width: `${(score / maxValue) * 50}%`,
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
                    <div className={styles.averageProgress} style={{ width: `${(averageScore / maxValue) * 50}%` }} />
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
const CategoryRadarChart = ({ title, data, categoryType }) => {
  const chartRef = useRef(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const handleDownload = () => {
    downloadChartAsPNG(chartRef, `${title.replace(/\s+/g, "-").toLowerCase()}-${categoryType}.png`)
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

      <ChartPreviewModal isOpen={isPreviewOpen} onClose={closePreview} title={title} chartData={data} />
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

      <ChartPreviewModal isOpen={isPreviewOpen} onClose={closePreview} title={title} chartData={data} />
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

      <ChartPreviewModal
        isOpen={isPreviewOpen}
        onClose={closePreview}
        title={title}
        chartData={data}
        chartType="gaap"
      />
    </>
  )
}

// Función para calcular resultados por cualquier categoría
export const calculateResultsByCategory = (data, categoryField) => {
  const categoryGroups = {}

  // Agrupar por la categoría especificada
  data.forEach((item) => {
    const category = item[categoryField] || "Sin Categoría"
    if (!categoryGroups[category]) {
      categoryGroups[category] = []
    }
    categoryGroups[category].push(item)
  })

  // Calcular promedio para cada categoría
  const categoryResults = {}
  Object.keys(categoryGroups).forEach((category) => {
    const itemsInCategory = categoryGroups[category]
    const count = itemsInCategory.length

    categoryResults[category] = {
      ATRACTIVO: itemsInCategory.reduce((sum, item) => sum + (item.atractivo || 0), 0) / count,
      RECIPROCIDAD: itemsInCategory.reduce((sum, item) => sum + (item.reciprocidad || 0), 0) / count,
      AUTORIDAD: itemsInCategory.reduce((sum, item) => sum + (item.autoridad || 0), 0) / count,
      AUTENTICIDAD: itemsInCategory.reduce((sum, item) => sum + (item.autenticidad || 0), 0) / count,
      "CONSISTENCIA Y COMPROMISO":
        itemsInCategory.reduce((sum, item) => sum + (item.consistenciaCompromiso || 0), 0) / count,
      "VALIDACIÓN SOCIAL": itemsInCategory.reduce((sum, item) => sum + (item.validacionSocial || 0), 0) / count,
    }
  })

  // Calcular promedio general de todas las categorías
  const allCategoryValues = Object.values(categoryResults)
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

  const { categoryResults, averageResult, gapResult } = calculateResultsByCategory(data, categoryField)

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
            />
          ))}
        </div>
      </div>

      <div className={styles.resultsSection}>
        <h3 className={styles.subsectionTitle}>Resultado Promedio y Gap por {categoryTitle}</h3>
        <div className={styles.chartsGrid}>
          <AverageRadarChart
            data={averageResult}
            categoryType={categoryType}
            title={`Resultado Promedio por ${categoryTitle}`}
          />
          <GapRadarChart data={gapResult} categoryType={categoryType} title={`Gap entre ${categoryTitle}`} />
        </div>
      </div>
    </div>
  )
}

export default ResultsByCategory
