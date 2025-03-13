"use client"

import { useState, useEffect, useRef } from "react"
import styles from "./RadarChart.module.css"
import { FaThumbsUp, FaStar } from "react-icons/fa"
import { PiSunFill } from "react-icons/pi"
import { GiConfirmed } from "react-icons/gi"
import { AiFillBank } from "react-icons/ai"
import { RxUpdate } from "react-icons/rx"

const RadarChart = ({ data, theme = "dark", completedPhases = [] }) => {
  const [animatedData, setAnimatedData] = useState({
    ATRACTIVO: 0,
    "VALIDACIÓN SOCIAL": 0,
    RECIPROCIDAD: 0,
    AUTORIDAD: 0,
    AUTENTICIDAD: 0,
    "CONSISTENCIA Y COMPROMISO": 0,
  })

  const [isInitialRender, setIsInitialRender] = useState(true)
  const animationRef = useRef(null)
  const prevDataRef = useRef({ ...animatedData })

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

  // Efecto para animar los datos cuando cambian
  useEffect(() => {
    // Guardar los datos actuales como punto de partida
    const startData = { ...prevDataRef.current }
    const targetData = { ...data }

    // Cancelar cualquier animación en curso
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    // Si es la primera renderización y hay datos, establecer directamente sin animación
    if (isInitialRender && Object.values(data).some((value) => value > 0)) {
      setAnimatedData({ ...data })
      setIsInitialRender(false)
      prevDataRef.current = { ...data }
      return
    }

    // Tiempo de inicio de la animación
    const startTime = performance.now()
    const duration = 800 // duración de la animación en ms

    // Función de animación
    const animate = (currentTime) => {
      const elapsedTime = currentTime - startTime
      const progress = Math.min(elapsedTime / duration, 1)

      // Función de easing para una animación más suave
      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)
      const easedProgress = easeOutCubic(progress)

      // Calcular los valores intermedios
      const newData = {}
      labels.forEach((label) => {
        const start = startData[label] || 0
        const target = targetData[label] || 0
        newData[label] = start + (target - start) * easedProgress
      })

      // Actualizar el estado con los valores animados
      setAnimatedData(newData)

      // Continuar la animación si no ha terminado
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        // Guardar los datos finales como referencia para la próxima animación
        prevDataRef.current = { ...targetData }
      }
    }

    // Iniciar la animación
    animationRef.current = requestAnimationFrame(animate)

    // Limpiar la animación cuando el componente se desmonte
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [data])

  const calculatePoints = () => {
    const points = []
    const center = { x: 200, y: 200 }
    const maxRadius = 150

    for (let i = 0; i < labels.length; i++) {
      const angle = (Math.PI * 2 * i) / labels.length - Math.PI / 2
      const value = animatedData[labels[i]] || 0
      const radius = (value / 10) * maxRadius

      const x = center.x + radius * Math.cos(angle)
      const y = center.y + radius * Math.sin(angle)
      points.push(`${x},${y}`)
    }

    return points.join(" ")
  }

  // Definir colores según el tema
  const colors =
    theme === "dark"
      ? {
          hexFill: "blue",
          hexStroke: "#00ffff",
          dotLine: "#00ffff",
          dataFill: "#00ffff",
          dataStroke: "#00ffff",
          labelText: "#ffffff",
          iconColor: "#5991bc",
          completedColor: "#3FFFF3",// Color más fuerte para fases completadas (tema oscuro)
        }
      : {
        hexFill: "white",
        hexStroke: "#0a2ff1",
        dotLine: "#0a2ff1",
        dataFill: "#3FFFF3",
        dataStroke: "#00ffff",
        labelText: "#0a2ff1",
        iconColor: "#0a2ff1",
        completedColor: "#3FFFF3", // Color más fuerte para fases completadas (tema claro)
        }

  return (
    <div className={styles.radarContainer}>
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

        {/* Área de datos con animación */}
        <polygon
          points={calculatePoints()}
          className={styles.dataArea}
          style={{
            fill: colors.dataFill,
            fillOpacity: theme === "dark" ? 0.8 : 0.3,
            stroke: colors.dataStroke,
            strokeWidth: 0.5,
          }}
        />

        {/* Etiquetas */}
        {labels.map((label, index) => {
          const angle = (Math.PI * 2 * index) / 6 - Math.PI / 2
          let radius = 175

          // Ajusta dinámicamente el radio para evitar colisiones
          if (label !== "ATRACTIVO" && label !== "AUTENTICIDAD") {
            radius = 224 // Aumenta el radio para estas etiquetas
          }
          if(label === "AUTENTICIDAD") {
            radius = 182
          }
          if(label === "ATRACTIVO") {
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
                )  : label === "VALIDACIÓN SOCIAL" ? (
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
    </div>
  )
}

export default RadarChart

