"use client"

import { useState, useEffect, useRef } from "react"
import styles from "./RadarChart.module.css"
// Import animated icons
import validacionSocialIcono from "../../assets/iconos-animados/validacion-social-icono.gif"
import atractivoIcono from "../../assets/iconos-animados/atractivo-icono.gif"
import reciprocidadIcono from "../../assets/iconos-animados/reciprocidad-icono.gif"
import autoridadIcono from "../../assets/iconos-animados/autoridad-icono.gif"
import autenticidadIcono from "../../assets/iconos-animados/autenticidad-icono.gif"
import consistenciaIcono from "../../assets/iconos-animados/compromiso-icono.gif"
import validacionSocialIconoCeleste from "../../assets/iconos-animados/validacion-social-icono-celeste.png"
import atractivoIconoCeleste from "../../assets/iconos-animados/atractivo-icono-celeste.png"
import reciprocidadIconoCeleste from "../../assets/iconos-animados/reciprocidad-icono-celeste.png"
import autoridadIconoCeleste from "../../assets/iconos-animados/autoridad-icono-celeste.png"
import autenticidadIconoCeleste from "../../assets/iconos-animados/autenticidad-icono-celeste.png"
import consistenciaIconoCeleste from "../../assets/iconos-animados/consistencia-compromiso-icono-celeste.png"

const RadarChart = ({ data, theme = "dark", completedPhases = [], startedPhases = [] }) => {
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

  // Updated order according to the shared file
  const labels = [
    "ATRACTIVO",
    "RECIPROCIDAD",
    "AUTORIDAD",
    "AUTENTICIDAD",
    "CONSISTENCIA Y COMPROMISO",
    "VALIDACIÓN SOCIAL",
  ]

  // GIF icons
  const icons = [
    atractivoIcono,
    reciprocidadIcono,
    autoridadIcono,
    autenticidadIcono,
    consistenciaIcono,
    validacionSocialIcono,
  ]

  // Celeste icons mapping for easy reference
  const celesteIcons = [
    atractivoIconoCeleste,
    reciprocidadIconoCeleste,
    autoridadIconoCeleste,
    autenticidadIconoCeleste,
    consistenciaIconoCeleste,
    validacionSocialIconoCeleste,
  ]

  // Effect to animate data when it changes
  useEffect(() => {
    // Save current data as starting point
    const startData = { ...prevDataRef.current }
    const targetData = { ...data }

    // Cancel any ongoing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    // If it's the first render and there's data, set directly without animation
    if (isInitialRender && Object.values(data).some((value) => value > 0)) {
      setAnimatedData({ ...data })
      setIsInitialRender(false)
      prevDataRef.current = { ...data }
      return
    }

    // Animation start time
    const startTime = performance.now()
    const duration = 800 // animation duration in ms

    // Animation function
    const animate = (currentTime) => {
      const elapsedTime = currentTime - startTime
      const progress = Math.min(elapsedTime / duration, 1)

      // Easing function for smoother animation
      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)
      const easedProgress = easeOutCubic(progress)

      // Calculate intermediate values
      const newData = {}
      labels.forEach((label) => {
        const start = startData[label] || 0
        const target = targetData[label] || 0
        newData[label] = start + (target - start) * easedProgress
      })

      // Update state with animated values
      setAnimatedData(newData)

      // Continue animation if not finished
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        // Save final data as reference for next animation
        prevDataRef.current = { ...targetData }
      }
    }

    // Start animation
    animationRef.current = requestAnimationFrame(animate)

    // Clean up animation when component unmounts
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [data])

  const calculatePoints = () => {
    const points = []
    const center = { x: 200, y: 200 }
    // Ajustar maxRadius para que el valor 10 no se salga del hexágono
    // Usar un radio máximo de 140 en lugar de 150 para dejar un margen
    const maxRadius = 140

    for (let i = 0; i < labels.length; i++) {
      // Make sure to use the same angle calculation used for drawing dotted lines
      const angle = (Math.PI * 2 * i) / labels.length - Math.PI / 2
      const value = animatedData[labels[i]] || 0

      // Asegurar que el valor esté entre 0 y 10, y calcular el radio proporcionalmente
      const clampedValue = Math.max(0, Math.min(10, value))
      const radius = (clampedValue / 10) * maxRadius

      const x = center.x + radius * Math.cos(angle)
      const y = center.y + radius * Math.sin(angle)
      points.push(`${x},${y}`)
    }

    return points.join(" ")
  }

  // Define colors based on theme - ensuring consistent colors across screens
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
          completedColor: "#3FFFF3", // Stronger color for completed phases (dark theme)
          startedColor: "#3FFFF3", // Color for started phases
        }
      : {
          hexFill: "white",
          hexStroke: "#0a2ff1",
          dotLine: "#0a2ff1",
          dataFill: "#3FFFF3",
          dataStroke: "#00ffff",
          labelText: "#0a2ff1",
          iconColor: "#0a2ff1",
          completedColor: "#3FFFF3", // Stronger color for completed phases (light theme)
          startedColor: "#3FFFF3", // Color for started phases
        }

  // Generate hexagon points with mathematical precision
  const generateHexPoints = (center, radius) => {
    const points = []
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2
      const x = center.x + radius * Math.cos(angle)
      const y = center.y + radius * Math.sin(angle)
      points.push(`${x},${y}`)
    }
    return points.join(" ")
  }

  return (
    <div className={styles.radarContainer}>
      <svg viewBox="0 0 450 450" className={styles.radar}>
        {/* Background circles - use function to generate hexagon points */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((scale, index) => (
          <polygon
            key={`hex-${index}`}
            points={generateHexPoints({ x: 200, y: 200 }, 150 * scale)}
            style={{
              fill: colors.hexFill,
              stroke: colors.hexStroke,
              strokeWidth: 10,
              opacity: theme === "dark" ? 0.9 : 0.9,
            }}
          />
        ))}

        {/* Dotted lines - usar el mismo radio máximo que el hexágono exterior */}
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

        {/* Data area with animation */}
        <polygon
          points={calculatePoints()}
          className={styles.dataArea}
          style={{
            fill: colors.dataFill,
            fillOpacity: theme === "dark" ? 0.8 : 0.3,
            stroke: colors.dataStroke,
            strokeWidth: 2,
          }}
        />

        {/* Labels */}
        {labels.map((label, index) => {
          const angle = (Math.PI * 2 * index) / 6 - Math.PI / 2
          let radius = 175

          // Dynamically adjust radius to avoid collisions
          if (label !== "ATRACTIVO" && label !== "AUTENTICIDAD") {
            radius = 214 // Increase radius for these labels
          }
          if (label === "AUTENTICIDAD") {
            radius = 204
          }
          if (label === "ATRACTIVO") {
            radius = 190
          }

          const x = 200 + radius * Math.cos(angle)
          const y = 213 + radius * Math.sin(angle)

          // Check if this phase is completed or started
          const isCompleted = completedPhases.includes(label)
          const isStarted = startedPhases.includes(label)
          const shouldHighlight = isCompleted || isStarted

          return (
            <g key={label} style={{ transformOrigin: "center" }}>
              <rect
                x={x - 45}
                y={y - 12}
                width="90"
                height="24"
                style={{
                  fill: theme === "dark" ? "none" : "none",
                  rx: 4,
                  ry: 4,
                }}
              />
              <text
                x={x}
                y={y}
                style={{
                  fill: shouldHighlight ? colors.completedColor : colors.labelText,
                  fontSize: "14px",
                  fontWeight: shouldHighlight ? 700 : 500,
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
              {/* Use celeste (light blue) icons for highlighted phases instead of applying filters */}
              <image
                href={shouldHighlight ? celesteIcons[index] : icons[index]}
                x={x - 18}
                y={y - 45}
                width="32"
                height="32"
                className={shouldHighlight ? styles.highlightedIcon : styles.normalIcon}
              />
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default RadarChart
