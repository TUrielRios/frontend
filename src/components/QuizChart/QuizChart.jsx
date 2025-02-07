import { useMemo } from "react";
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

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

function QuizChart({ answers }) {
  const calculatePhaseAverage = (phase) => {
    const phaseAnswers = Object.entries(answers).filter(([key]) => key.includes(phase));
    if (phaseAnswers.length === 0) return 0;
    const sum = phaseAnswers.reduce((acc, [, value]) => acc + value, 0);
    return sum / phaseAnswers.length;
  };

  const chartData = useMemo(() => {
    const phases = [
      "VALIDACIÓN SOCIAL",
      "ATRACTIVO",
      "RECIPROCIDAD",
      "CONSISTENCIA Y COMPROMISO",
      "AUTENTICIDAD",
      "AUTORIDAD",
    ];

    return {
      labels: phases,
      datasets: [
        {
          label: "Perfil de Marketing Digital",
          data: phases.map((phase) => calculatePhaseAverage(phase)),
          backgroundColor: "rgba(54, 162, 235, 0.4)",
          borderColor: "#36A2EB",
          borderWidth: 3,
          pointBackgroundColor: "#36A2EB",
          pointBorderColor: "#36A2EB",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "#36A2EB",
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  }, [answers]);

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
            const label = context.dataset.label || "";
            const value = context.parsed.r.toFixed(2);
            return `${label}: ${value}`;
          },
        },
      },
    },
    elements: {
      line: {
        tension: 0.2,
      },
    },
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Perfil de Marketing Digital</h2>
      </div>
      <div className={styles.chartContainer}>
        <Radar data={chartData} options={options} className={styles.chartWrapper} />
      </div>
    </div>
  );
}

export default QuizChart;
