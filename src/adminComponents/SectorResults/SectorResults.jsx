"use client"

import { useState, useRef } from "react"
import { Download, Maximize } from "lucide-react"
import AdminUserChart from "../AdminUserChart/AdminUserChart"
import styles from "./SectorResults.module.css"
import html2canvas from "html2canvas"

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

// Componente para los gráficos de radar por sector
const SectorRadarChart = ({ title, data }) => {
  const chartRef = useRef(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const handleDownload = () => {
    downloadChartAsPNG(chartRef, `${title.replace(/\s+/g, "-").toLowerCase()}-sector.png`)
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
    </>
  )
}

// Componente para el gráfico de resultado promedio por sector
const SectorAverageChart = ({ data }) => {
  const chartRef = useRef(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const handleDownload = () => {
    downloadChartAsPNG(chartRef, "resultado-promedio-sector.png")
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
            <h3>Resultado Promedio por Sector</h3>
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
    </>
  )
}

// Componente para el gráfico de gap entre sectores
const SectorGapChart = ({ data }) => {
  const chartRef = useRef(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const handleDownload = () => {
    downloadChartAsPNG(chartRef, "gap-sectores.png")
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
            <h3>Gap entre Sectores</h3>
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
    </>
  )
}

// Función para calcular resultados por sector
export const calculateSectorResults = (data) => {
  const sectorGroups = {}

  // Agrupar por sector
  data.forEach((item) => {
    const sector = item.industriaSector || item.sector || "Sin Sector"
    if (!sectorGroups[sector]) {
      sectorGroups[sector] = []
    }
    sectorGroups[sector].push(item)
  })

  // Calcular promedio para cada sector
  const sectorResults = {}
  Object.keys(sectorGroups).forEach((sector) => {
    const itemsInSector = sectorGroups[sector]
    const count = itemsInSector.length

    sectorResults[sector] = {
      ATRACTIVO: itemsInSector.reduce((sum, item) => sum + (item.atractivo || 0), 0) / count,
      RECIPROCIDAD: itemsInSector.reduce((sum, item) => sum + (item.reciprocidad || 0), 0) / count,
      AUTORIDAD: itemsInSector.reduce((sum, item) => sum + (item.autoridad || 0), 0) / count,
      AUTENTICIDAD: itemsInSector.reduce((sum, item) => sum + (item.autenticidad || 0), 0) / count,
      "CONSISTENCIA Y COMPROMISO":
        itemsInSector.reduce((sum, item) => sum + (item.consistenciaCompromiso || 0), 0) / count,
      "VALIDACIÓN SOCIAL": itemsInSector.reduce((sum, item) => sum + (item.validacionSocial || 0), 0) / count,
    }
  })

  // Calcular promedio general de todos los sectores
  const allSectorValues = Object.values(sectorResults)
  const averageResult = {
    ATRACTIVO: allSectorValues.reduce((sum, sector) => sum + sector.ATRACTIVO, 0) / allSectorValues.length,
    RECIPROCIDAD: allSectorValues.reduce((sum, sector) => sum + sector.RECIPROCIDAD, 0) / allSectorValues.length,
    AUTORIDAD: allSectorValues.reduce((sum, sector) => sum + sector.AUTORIDAD, 0) / allSectorValues.length,
    AUTENTICIDAD: allSectorValues.reduce((sum, sector) => sum + sector.AUTENTICIDAD, 0) / allSectorValues.length,
    "CONSISTENCIA Y COMPROMISO":
      allSectorValues.reduce((sum, sector) => sum + sector["CONSISTENCIA Y COMPROMISO"], 0) / allSectorValues.length,
    "VALIDACIÓN SOCIAL":
      allSectorValues.reduce((sum, sector) => sum + sector["VALIDACIÓN SOCIAL"], 0) / allSectorValues.length,
  }

  return {
    sectorResults,
    averageResult,
    gapResult: sectorResults,
  }
}

// Componente principal para mostrar resultados por sector
const SectorResults = ({ data, title = "Resultados según Sector" }) => {
  if (!data || data.length === 0) {
    return <div className={styles.noData}>No hay datos disponibles para mostrar resultados por sector.</div>
  }

  const { sectorResults, averageResult, gapResult } = calculateSectorResults(data)

  return (
    <div className={styles.sectorResultsContainer}>
      <div className={styles.resultsSection}>
        <h3 className={styles.subsectionTitle}>{title}</h3>
        <div className={styles.chartsGrid}>
          {Object.keys(sectorResults).map((sector, index) => (
            <SectorRadarChart key={index} title={sector} data={sectorResults[sector]} />
          ))}
        </div>
      </div>

      <div className={styles.resultsSection}>
        <h3 className={styles.subsectionTitle}>Resultado Promedio y Gap por Sector</h3>
        <div className={styles.chartsGrid}>
          <SectorAverageChart data={averageResult} />
          <SectorGapChart data={gapResult} />
        </div>
      </div>
    </div>
  )
}

export default SectorResults
