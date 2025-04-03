"use client"

import { useState, useEffect, useRef } from "react"
import styles from "./AdminGapRadarChart.module.css"
import { FaThumbsUp, FaStar } from "react-icons/fa"
import { PiSunFill } from "react-icons/pi"
import { GiConfirmed } from "react-icons/gi"
import { AiFillBank } from "react-icons/ai"
import { RxUpdate } from "react-icons/rx"
import { Download } from "lucide-react"

const AdminGapRadarChart = ({ data, theme = "light", completedPhases = [] }) => {
  const [animatedData, setAnimatedData] = useState({})
  const [isInitialRender, setIsInitialRender] = useState(true)
  const animationRef = useRef(null)
  const prevDataRef = useRef({})

  // Orden actualizado según el archivo compartido
  const labels = [
    "ATRACTIVO",
    "RECIPROCIDAD",
    "AUTORIDAD",
    "AUTENTICIDAD",
    "CONSISTENCIA Y COMPROMISO",
    "VALIDACIÓN SOCIAL",
  ]

  const icons = [
    <PiSunFill key="0" size={28} />,
    <RxUpdate key="1" size={28} />,
    <AiFillBank key="2" size={28} />,
    <FaStar key="3" size={28} />,
    <GiConfirmed key="4" size={28} />,
    <FaThumbsUp key="5" size={28} />,
  ]

  // Colores para las diferentes áreas
  const areaColors = {
    Directorio: "#FF5733", // Rojo
    Administración: "#33FF57", // Verde
    Comercial: "#3357FF", // Azul
    Marketing: "#F033FF", // Púrpura
    Diseño: "#FFFF33", // Amarillo
    RRHH: "#FF33F5", // Rosa
  }

  // Efecto para inicializar los datos
  useEffect(() => {
    if (isInitialRender && data) {
      setIsInitialRender(false)
      prevDataRef.current = { ...data }
    }
  }, [data, isInitialRender])

  // Función para calcular los puntos de un área específica
  const calculatePoints = (areaData) => {
    const points = []
    const center = { x: 200, y: 200 }
    const maxRadius = 150
  
    for (let i = 0; i < labels.length; i++) {
      const angle = (Math.PI * 2 * i) / labels.length - Math.PI / 2
      let value = areaData[labels[i]] || 0
  
      // Asegurar que el área mínima sea visible
      value = Math.max(value, 2) // Evita valores demasiado pequeños
  
      const radius = (value / 10) * maxRadius
  
      const x = center.x + radius * Math.cos(angle)
      const y = center.y + radius * Math.sin(angle)
      points.push(`${x},${y}`)
    }
  
    return points.join(" ")
  }
  
  // Definir colores según el tema
  const colors = theme === "dark"
    ? {
        hexFill: "blue",
        hexStroke: "#00ffff",
        dotLine: "#00ffff",
        dataFill: "#00ffff",
        dataStroke: "#00ffff",
        labelText: "#ffffff",
        iconColor: "#5991bc",
        completedColor: "#3FFFF3",
        legendText: "#ffffff",
      }
    : {
        hexFill: "white",
        hexStroke: "#0a2ff1",
        dotLine: "#0a2ff1",
        dataFill: "#3FFFF3",
        dataStroke: "#00ffff",
        labelText: "#0a2ff1",
        iconColor: "#0a2ff1",
        completedColor: "#3FFFF3",
        legendText: "#0a2ff1",
      }

  return (
    <div className={styles.radarContainer}>
      <div className={styles.chartWrapper}>
        <svg viewBox="0 0 400 400" className={styles.radar}>
          {/* Círculos de fondo */}
          {[0.2, 0.4, 0.6, 0.8, 1].map((scale, index) => (
            <polygon
              key={`hex-${index}`}
              points="200,50 350,125 350,275 200,350 50,275 50,125"
              style={{
                fill: colors.hexFill,
                stroke: colors.hexStroke,
                strokeWidth: 10,
                opacity: theme === "dark" ? 0.9 : 0.9,
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
            return (
              <line
                key={`line-${i}`}
                x1="200"
                y1="200"
                x2={x2}
                y2={y2}
                style={{
                  stroke: colors.dotLine,
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                  opacity: 0.7,
                }}
              />
            )
          })}

          {/* Renderizar polígonos para cada área */}
          {Object.keys(data).map((area, index) => (
            <polygon
              key={`area-${index}`}
              points={calculatePoints(data[area])}
              style={{
                fill: "none",
                stroke: areaColors[area] || `hsl(${index * 60}, 70%, 50%)`,
                strokeWidth: 2,
                opacity: 0.8,
              }}
            />
          ))}

          {/* Etiquetas */}
          {labels.map((label, index) => {
            const angle = (Math.PI * 2 * index) / 6 - Math.PI / 2
            let radius = 175

            // Ajusta dinámicamente el radio para evitar colisiones
            if (label !== "ATRACTIVO" && label !== "AUTENTICIDAD") {
              radius = 224 // Aumenta el radio para estas etiquetas
            }
            if (label === "AUTENTICIDAD") {
              radius = 182
            }
            if (label === "ATRACTIVO") {
              radius = 176
            }

            const x = 200 + radius * Math.cos(angle)
            const y = 213 + radius * Math.sin(angle)

            // Verificar si esta fase está completada
            const isCompleted = completedPhases.includes(label)
            const iconColor = isCompleted ? colors.completedColor : colors.iconColor

            return (
              <g key={label} style={{ transformOrigin: "center" }}>
                <rect
                  x={x - 45}
                  y={y - 12}
                  width="90"
                  height="24"
                  style={{
                    fill: theme === "dark" ? "none" : "rgba(255, 255, 255, 0.7)",
                    rx: 4,
                    ry: 4,
                  }}
                />
                <text
                  x={x}
                  y={y}
                  style={{
                    fill: isCompleted ? colors.completedColor : colors.labelText,
                    fontSize: "11px",
                    fontWeight: isCompleted ? 700 : 500,
                    dominantBaseline: "middle",
                    textAnchor: "middle",
                  }}
                >
                  {label === "CONSISTENCIA Y COMPROMISO" ? (
                    <>
                      <tspan x={x} dy="0">
                        CONSISTENCIA
                      </tspan>
                      <tspan x={x} dy="1.2em">
                        Y COMPROMISO
                      </tspan>
                    </>
                  ) : label === "VALIDACIÓN SOCIAL" ? (
                    <>
                      <tspan x={x} dy="0">
                        VALIDACIÓN
                      </tspan>
                      <tspan x={x} dy="1.2em">
                        SOCIAL
                      </tspan>
                    </>
                  ) : (
                    label
                  )}
                </text>
                {/* Agregar el icono encima de la etiqueta con tamaño aumentado */}
                <foreignObject x={x - 18} y={y - 38} width="36" height="36" style={{ color: iconColor }}>
                  {icons[index]}
                </foreignObject>
              </g>
            )
          })}
        </svg>

        {/* Leyenda a la derecha del gráfico */}
        <div className={styles.legendContainer}>
          <div className={styles.legendTitle}>Áreas</div>
          <div className={styles.legendItems}>
            {Object.keys(data).map((area, index) => (
              <div key={`legend-${index}`} className={styles.legendItem}>
                <div 
                  className={styles.legendColor} 
                  style={{ backgroundColor: areaColors[area] || `hsl(${index * 60}, 70%, 50%)` }}
                ></div>
                <div className={styles.legendText} style={{ color: colors.legendText }}>
                  {area}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminGapRadarChart