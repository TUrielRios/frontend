"use client"

import { useState, useEffect, useRef } from "react"
import styles from "./AdminChart.module.css"
// Importar los iconos GIF
import validacionSocialIcono from "../../assets/iconos-animados/validacion-social-icono.gif"
import atractivoIcono from "../../assets/iconos-animados/atractivo-icono.gif"
import reciprocidadIcono from "../../assets/iconos-animados/reciprocidad-icono.gif"
import autoridadIcono from "../../assets/iconos-animados/autoridad-icono.gif"
import autenticidadIcono from "../../assets/iconos-animados/autenticidad-icono.gif"
import consistenciaIcono from "../../assets/iconos-animados/compromiso-icono.gif"

const AdminChart = ({ data, theme = "dark", completedPhases = [], startedPhases = [] }) => {
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

  // Iconos GIF
  const icons = [
    atractivoIcono,
    reciprocidadIcono,
    autoridadIcono,
    autenticidadIcono,
    consistenciaIcono,
    validacionSocialIcono,
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
    const maxRadius = 150 // Usar el mismo maxRadius que se usa para el hexágono

    for (let i = 0; i < labels.length; i++) {
      // Asegúrate de usar el mismo cálculo de ángulo que se usa para dibujar las líneas punteadas
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
          completedColor: "#3FFFF3", // Color más fuerte para fases completadas (tema oscuro)
          startedColor: "#3FFFF3", // Color para fases iniciadas
          numberColor: "#ffffff", // Color para los números
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
          startedColor: "#3FFFF3", // Color para fases iniciadas
          numberColor: "#0a2ff1", // Color para los números
        }

  // Generamos los puntos del hexágono con precisión matemática
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
      <svg viewBox="0 0 400 400" className={styles.radar}>
        {/* Círculos de fondo - usar la función para generar los puntos del hexágono */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((scale, index) => (
          <polygon
            key={`hex-${index}`}
            points={generateHexPoints({ x: 200, y: 200 }, 150 * scale)}
            style={{
              fill: colors.hexFill,
              stroke: colors.hexStroke,
              strokeWidth: 10,
              transform: `scale(${scale})`,
              transformOrigin: "center",
            }}
          />
        ))}

        {/* Números del 1 al 10 en lugar de puntitos en todas las líneas radiales */}
        {Array.from({ length: 6 }).map((_, lineIndex) => {
          // Calculamos el ángulo para cada línea radial (igual que para las líneas punteadas)
          const angle = (Math.PI * 2 * lineIndex) / 6 - Math.PI / 2;
          
          // Para cada línea radial, colocamos los 5 números (2,4,6,8,10)
          return [0.1,0.2,0.3, 0.4,0.5, 0.6,0.7, 0.8,0.9].map((scale, numIndex) => {
            const value = numIndex + 1; // Valores 2, 4, 6, 8, 10
            const x = 200 + (150 * scale) * Math.cos(angle);
            const y = 200 + (150 * scale) * Math.sin(angle);
            
            return (
              <text
                key={`number-${lineIndex}-${numIndex}`}
                x={x}
                y={y}
                style={{
                  fill: colors.numberColor,
                  fontSize: "7px",
                  fontWeight: "bold",
                  dominantBaseline: "middle",
                  textAnchor: "middle",
                }}
              >
                {value}
              </text>
            );
          });
        })}

        {/* Líneas punteadas - asegurarse de usar el mismo cálculo de ángulo y distancia */}


        {/* Área de datos con animación */}
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

        {/* Etiquetas */}
        {labels.map((label, index) => {
          const angle = (Math.PI * 2 * index) / 6 - Math.PI / 2
          let radius = 175

          // Ajusta dinámicamente el radio para evitar colisiones
          if (label !== "ATRACTIVO" && label !== "AUTENTICIDAD") {
            radius = 204 // Aumenta el radio para estas etiquetas
          }
          if(label === "AUTENTICIDAD") {
            radius = 182
          }
          if(label === "ATRACTIVO") {
            radius = 176
          }

          const x = 200 + radius * Math.cos(angle)
          const y = 213 + radius * Math.sin(angle)

          // Verificar si esta fase está completada o iniciada
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
                  fontSize: "11px",
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
              {/* Iconos GIF */}
              <image 
                href={icons[index]} 
                x={x - 15} 
                y={y - 38} 
                width="32" 
                height="32" 
              />
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default AdminChart