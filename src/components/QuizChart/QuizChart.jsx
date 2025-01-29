import React from "react";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import styles from "./QuizChart.module.css";

// Registrar los componentes necesarios de Chart.js
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

function QuizChart({ answers }) {
  // Datos de ejemplo, puedes ajustarlos según tus respuestas
  const data = {
    labels: [
      "Atractivo",
      "Validación",
      "Reciprocidad",
      "Consistencia",
      "Autoridad y Compromiso",
      "Autenticidad",
    ],
    datasets: [
      {
        label: "Fase 1",
        data: [5, 7, 8, 6, 9, 7], // Valores de ejemplo
        backgroundColor: "rgba(63, 255, 243, 0.3)",
        borderColor: "#0a2ff1",
        borderWidth: 2,
      },
      {
        label: "Fase 2",
        data: [6, 8, 7, 5, 8, 6], // Valores de ejemplo
        backgroundColor: "rgba(255, 87, 51, 0.3)",
        borderColor: "#FF5733",
        borderWidth: 2,
      },
    ],
  };

  // Opciones del gráfico
  const options = {
    scales: {
      r: {
        angleLines: {
          color: "#3FFFF3",
        },
        grid: {
          color: "#3FFFF3",
        },
        pointLabels: {
          font: {
            size: 14,
            family: "Red Hat Display",
            weight: "bold",
          },
          color: "#0a2ff1",
        },
        suggestedMin: 0,
        suggestedMax: 10,
      },
    },
    plugins: {
      legend: {
        labels: {
          font: {
            size: 14,
            family: "Red Hat Display",
            weight: "bold",
          },
          color: "#0a2ff1",
        },
      },
    },
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Perfil de Marketing Digital</h2>
      </div>
      <div className={styles.chartContainer}>
        <Radar data={data} options={options} className={styles.chartWrapper} />
      </div>
    </div>
  );
}

export default QuizChart;
