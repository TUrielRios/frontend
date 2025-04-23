import { useEffect, useRef } from "react"
import Chart from "chart.js/auto"
import styles from "./AdminUserChart.module.css"
import AdminRadarChart from "../AdminRadarChart/AdminRadarChart"
import AdminGapRadarChart from "../AdminGapRadarChart/AdminGapRadarChart"

// Función para generar colores según el tipo de gráfico
const getChartColors = (type, dataLength) => {
  const colorSets = {
    doughnut: [
      "#E93C2F", // 
      "#F27011", // 
      "#FABD05", // 
      "#98C51D", // 
      "#34A852", 
      "#0A7AF2", "#0A2FF1","#7E11F2", "#C711F2", "#BEBEBE",
    ],
    polarArea: [
      "rgba(255, 99, 132, 0.8)", // Rojo
      "rgba(75, 192, 192, 0.8)", // Verde
      "rgba(153, 102, 255, 0.8)", // Morado
      "rgba(255, 159, 64, 0.8)", // Naranja
      "rgba(54, 162, 235, 0.8)", // Azul claro
      "rgba(10, 47, 241, 0.8)", // Azul
    ],
    line: [
      "rgba(10, 47, 241, 0.8)", // Azul
      "rgba(10, 47, 241, 0.6)",
      "rgba(10, 47, 241, 0.4)",
      "rgba(10, 47, 241, 0.2)",
    ],
    bar: [
      "rgba(99, 198, 255, 0.8)", // Rojo
      "rgba(89, 255, 197, 0.8)",
      "rgba(255, 220, 92, 0.8)",
      "rgba(211, 255, 16, 0.8)",
    ],
  }

  // Selecciona el conjunto de colores según el tipo de gráfico
  const colors = colorSets[type] || colorSets.bar // Por defecto, usa los colores de bar
  return colors.slice(0, dataLength) // Asegura que solo se usen los colores necesarios
}

const AdminUserChart = ({ data, type, theme = "light" }) => {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    // Si es tipo radar o gaap, no inicializamos el gráfico con Chart.js
    if (type === "radar" || type === "gaap") {
      return
    }

    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")

    const labels = Object.keys(data)
    const values = Object.values(data)

    const config = {
      type,
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: getChartColors(type, values.length), // Usar la función aquí
            borderColor: type === "line" ? "rgba(255, 99, 132, 1)" : "rgba(10, 47, 241, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: type === "doughnut" ? "right" : "top",
          },
        },
      },
    }

    chartInstance.current = new Chart(ctx, config)

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data, type])

  // Si es tipo radar, usar nuestro RadarChart personalizado
  if (type === "radar") {
    return <AdminRadarChart data={data} theme={theme} />
  }

  // Si es tipo gaap, usar nuestro GapRadarChart personalizado
  if (type === "gaap") {
    return <AdminGapRadarChart data={data} theme={theme} />
  }

  return (
    <div className={styles.chartWrapper}>
      <canvas ref={chartRef} />
    </div>
  )
}

export default AdminUserChart

