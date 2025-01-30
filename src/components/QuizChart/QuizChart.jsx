import { useMemo } from "react"
import { Radar } from "react-chartjs-2"
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from "chart.js"
import styles from "./QuizChart.module.css"

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

// Definimos los colores para cada fase
const phaseColors = {
  "VALIDACIÓN SOCIAL": { border: "#FF6384", background: "rgba(255, 99, 132, 0.4)" },
  ATRACTIVO: { border: "#36A2EB", background: "rgba(54, 162, 235, 0.4)" },
  RECIPROCIDAD: { border: "#FFCE56", background: "rgba(255, 206, 86, 0.4)" },
  "CONSISTENCIA Y COMPROMISO": { border: "#4BC0C0", background: "rgba(75, 192, 192, 0.4)" },
  AUTENTICIDAD: { border: "#9966FF", background: "rgba(153, 102, 255, 0.4)" },
  AUTORIDAD: { border: "#FF9F40", background: "rgba(255, 159, 64, 0.4)" },
}

function QuizChart({ answers }) {
  const calculatePhaseAverage = (phase) => {
    const phaseAnswers = Object.entries(answers).filter(([key]) => key.includes(phase))
    if (phaseAnswers.length === 0) return 0
    const sum = phaseAnswers.reduce((acc, [, value]) => acc + value, 0)
    return sum / phaseAnswers.length
  }

  const chartData = useMemo(() => {
    const phases = Object.keys(phaseColors)
    return {
      labels: phases,
      datasets: phases.map((phase) => ({
        label: phase,
        data: phases.map((p) => (p === phase ? calculatePhaseAverage(phase) : 0)),
        backgroundColor: phaseColors[phase].background,
        borderColor: phaseColors[phase].border,
        borderWidth: 3,
        pointBackgroundColor: phaseColors[phase].border,
        pointBorderColor: phaseColors[phase].border,
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: phaseColors[phase].border,
        pointRadius: 4,
        pointHoverRadius: 6,
      })),
    }
  }, [answers]) // Removed calculatePhaseAverage from dependencies

  const options = {
    scales: {
      r: {
        angleLines: {
          color: "rgba(0, 0, 0, 0.1)",
          lineWidth: 2,
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        pointLabels: {
          font: {
            size: 14,
            family: "Red Hat Display",
            weight: "bold",
          },
          color: "#333",
        },
        suggestedMin: 0,
        suggestedMax: 10,
        ticks: {
          stepSize: 1,
          font: {
            size: 12,
          },
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 12,
            family: "Red Hat Display",
          },
          usePointStyle: true,
          pointStyle: "circle",
          
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || ""
            const value = context.parsed.r.toFixed(2)
            return `${label}: ${value}`
          },
        },
      },
    },
    elements: {
      line: {
        tension: 0.2,
      },
    },
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Perfil de Marketing Digital</h2>
      </div>
      <div className={styles.chartContainer}>
        <Radar data={chartData} options={options} className={styles.chartWrapper} />
      </div>
    </div>
  )
}

export default QuizChart

