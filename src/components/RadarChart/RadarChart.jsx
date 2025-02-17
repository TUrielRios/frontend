import React from "react"
import styles from "./RadarChart.module.css"
import { FaThumbsUp, FaStar } from "react-icons/fa" // Importa los iconos que necesites
import { PiSunFill } from "react-icons/pi";
import { GiConfirmed } from "react-icons/gi";
import { AiFillBank } from "react-icons/ai";
import { RxUpdate } from "react-icons/rx";

const RadarChart = ({ data }) => {
  const labels = [
    "ATRACTIVO",
    "VALIDACIÓN SOCIAL",
    "RECIPROCIDAD",
    "AUTORIDAD",
    "AUTENTICIDAD",
    "CONSISTENCIA Y COMPROMISO",
  ]

  const icons = [
    <PiSunFill />,
    <FaThumbsUp />,
    <RxUpdate />,
    <AiFillBank />,
    <FaStar />,
    <GiConfirmed />,
  ]

  const calculatePoints = () => {
    const points = []
    const center = { x: 200, y: 200 }
    const maxRadius = 150

    for (let i = 0; i < labels.length; i++) {
      const angle = (Math.PI * 2 * i) / labels.length - Math.PI / 2
      const value = data[labels[i]] || 0
      const radius = (value / 10) * maxRadius

      const x = center.x + radius * Math.cos(angle)
      const y = center.y + radius * Math.sin(angle)
      points.push(`${x},${y}`)
    }

    return points.join(" ")
  }

  return (
    <div className={styles.radarContainer}>
      <svg viewBox="0 0 400 400" className={styles.radar}>
        {/* Círculos de fondo */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((scale, index) => (
          <polygon
            key={`hex-${index}`}
            points="200,50 350,125 350,275 200,350 50,275 50,125"
            className={styles.hexBackground}
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "center",
            }}
          />
        ))}

        {/* Líneas punteadas */}
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2
          const x2 = 200 + 150 * Math.cos(angle)
          const y2 = 200 + 150 * Math.sin(angle)
          return <line key={`line-${i}`} x1="200" y1="200" x2={x2} y2={y2} className={styles.dottedLine} />
        })}

        {/* Área de datos */}
        <polygon points={calculatePoints()} className={styles.dataArea} />

        {/* Etiquetas */}
{/* Etiquetas */}
{labels.map((label, index) => {
  const angle = (Math.PI * 2 * index) / 6 - Math.PI / 2;
  let radius = 175;

  // Ajusta dinámicamente el radio para evitar colisiones
  if (label !== "ATRACTIVO" && label !== "AUTORIDAD") {
    radius = 224; // Aumenta el radio para estas etiquetas
  }

  const x = 200 + radius * Math.cos(angle);
  const y = 213 + radius * Math.sin(angle);

  return (
    <g key={label} className={styles.labelGroup}>
      <rect x={x - 40} y={y - 10} width="80" height="20" className={styles.labelBg} />
      <text
        x={x}
        y={y}
        className={styles.label}
        dominantBaseline="middle"
        textAnchor="middle"
      >
        {label === "CONSISTENCIA Y COMPROMISO" ? (
          <>
            <tspan x={x} dy="0">CONSISTENCIA</tspan>
            <tspan x={x} dy="1.2em">Y COMPROMISO</tspan>

          </>
        ) : (
          label
        )}
      </text>
      {/* Agregar el icono encima de la etiqueta */}
      <foreignObject x={x - 12} y={y - 30} width="24" height="24" color="#00e6ff">
        {icons[index]}
      </foreignObject>
    </g>
  );
})}

      </svg>
    </div>
  )
}

export default RadarChart