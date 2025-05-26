import { useState, useEffect, useRef } from "react"
import styles from "./AdminGapRadarChart.module.css"
import validacionSocialIcono from "../../assets/iconos-animados/validacion-social-icono.gif"
import atractivoIcono from "../../assets/iconos-animados/atractivo-icono.gif"
import reciprocidadIcono from "../../assets/iconos-animados/reciprocidad-icono.gif"
import autoridadIcono from "../../assets/iconos-animados/autoridad-icono.gif"
import autenticidadIcono from "../../assets/iconos-animados/autenticidad-icono.gif"
import consistenciaIcono from "../../assets/iconos-animados/compromiso-icono.gif"

const AdminGapRadarChart = ({ data, theme = "light", completedPhases = [] }) => {
  const [animatedData, setAnimatedData] = useState({})
  const [isInitialRender, setIsInitialRender] = useState(true)
  const [hiddenAreas, setHiddenAreas] = useState({}) // Estado para áreas ocultas
  const prevDataRef = useRef({})

  // Función para alternar visibilidad de área
  const toggleAreaVisibility = (area) => {
    setHiddenAreas(prev => ({
      ...prev,
      [area]: !prev[area] // Alternar estado
    }))
  }

  // Updated order according to the shared file
  const labels = [
    "ATRACTIVO",
    "RECIPROCIDAD",
    "AUTORIDAD",
    "AUTENTICIDAD",
    "CONSISTENCIA Y COMPROMISO",
    "VALIDACIÓN SOCIAL",
  ]

  const icons = [
    atractivoIcono,
    reciprocidadIcono,
    autoridadIcono,
    autenticidadIcono,
    consistenciaIcono,
    validacionSocialIcono,
  ]
  
  // Colors for different areas
  const areaColors = {
    Directorio: "#E93C2F", //  // Red
    Administración: "#34A852", // Green
    Comercial: "#0A2FF1", // 
    Marketing: "#C711F2", 
    Diseño: "#7E11F2", // 
    RRHH: "#FABD05",
    
    // "#0A7AF2", "#0A2FF1","#7E11F2", "#C711F2", "#BEBEBE",
  }

  // Effect to initialize data
  useEffect(() => {
    if (isInitialRender && data) {
      setIsInitialRender(false)
      prevDataRef.current = { ...data }
      setAnimatedData({ ...data })
    }
  }, [data, isInitialRender])

  // Calculate points for a specific area - CORREGIDO
  const calculatePoints = (areaData) => {
    const points = []
    const center = { x: 200, y: 200 }
    const maxRadius = 140 // Usar 140 para mantener consistencia con el hexágono de fondo
  
    for (let i = 0; i < labels.length; i++) {
      const angle = (Math.PI * 2 * i) / labels.length - Math.PI / 2
      let value = areaData[labels[i]] || 0
  
      // Clamp value between 0 and 10
      value = Math.max(0, Math.min(10, value))
  
      // Calculate radius: valor 10 = maxRadius, valor 0 = 0
      const radius = (value / 10) * maxRadius
  
      const x = center.x + radius * Math.cos(angle)
      const y = center.y + radius * Math.sin(angle)
      points.push(`${x},${y}`)
    }
  
    return points.join(" ")
  }
  
  // Define colors based on theme
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

  // Generate hexagon points with mathematical precision - CORREGIDO
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
      <div className={styles.chartWrapper}>
        <svg viewBox="0 0 400 400" className={styles.radar}>
          {/* Background hexagons - CORREGIDO: usar 150 para el hexágono exterior */}
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

          {/* Números del 1 al 9 en todas las líneas radiales - AÑADIDO */}
          {Array.from({ length: 6 }).map((_, lineIndex) => {
            // Calculamos el ángulo para cada línea radial (igual que para las líneas punteadas)
            const angle = (Math.PI * 2 * lineIndex) / 6 - Math.PI / 2;
            
            // Para cada línea radial, colocamos los 9 números (1-9)
            return [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map((scale, numIndex) => {
              const value = numIndex + 1; // Valores 1, 2, 3, 4, 5, 6, 7, 8, 9
              // Usar el mismo cálculo de radio que en calculatePoints pero limitado al hexágono
              const x = 200 + (140 * scale) * Math.cos(angle); // Usar 140 para mantener consistencia
              const y = 200 + (140 * scale) * Math.sin(angle);
              
              return (
                <text
                  key={`number-${lineIndex}-${numIndex}`}
                  x={x}
                  y={y}
                  style={{
                    fill: "#0a2ff1",
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

          {/* Dotted lines - CORREGIDO: usar 150 para el hexágono exterior */}
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
                className={styles.dottedLine}
                style={{
                  stroke: colors.dotLine,
                  strokeWidth: 1,
                  strokeDasharray: "4 12",
                  opacity: 0.1,
                }}
              />
            )
          })}

          {/* Render polygons for each area - VERSIÓN CORREGIDA */}
          {Object.keys(data).map((area, index) => (
            <polygon
              key={`area-${index}`}
              points={calculatePoints(data[area])}
              className={styles.dataArea}
              style={{
                fill: "none", // Añadimos un fondo transparente
                stroke: areaColors[area] || `hsl(${index * 60}, 70%, 50%)`,
                strokeWidth: hiddenAreas[area] ? 0 : 2, // Ocultar el borde si está oculta
                opacity: hiddenAreas[area] ? 0 : 0.8,
                transition: 'all 0.3s ease', // Transición suave
              }}
            />
          ))}

          {/* Labels */}
          {labels.map((label, index) => {
            const angle = (Math.PI * 2 * index) / 6 - Math.PI / 2
            let radius = 175

            // Dynamically adjust radius to avoid collisions
            if (label !== "ATRACTIVO" && label !== "AUTENTICIDAD") {
              radius = 204 // Increase radius for these labels
            }
            if (label === "AUTENTICIDAD") {
              radius = 182
            }
            if (label === "ATRACTIVO") {
              radius = 176
            }

            const x = 200 + radius * Math.cos(angle)
            const y = 213 + radius * Math.sin(angle)

            // Check if this phase is completed
            const isCompleted = completedPhases.includes(label)

            return (
              <g key={label} className={styles.labelGroup}>
                <rect
                  x={x - 45}
                  y={y - 12}
                  width="90"
                  height="24"
                  className={styles.labelBg}
                  style={{
                    fill: theme === "dark" ? "none" : "none",
                    rx: 4,
                    ry: 4,
                  }}
                />
                <text
                  x={x}
                  y={y}
                  className={styles.label}
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

        {/* Leyenda interactiva mejorada */}
        <div className={styles.legendContainer} style={{
          backgroundColor: theme === "dark" ? "rgba(10, 20, 50, 0.7)" : "rgba(255, 255, 255, 0.8)",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
        }}>
          <div className={styles.legendTitle} style={{
            color: theme === "dark" ? "#ffffff" : "#0a2ff1",
          }}>
            Áreas
          </div>
          <div className={styles.legendItems}>
            {Object.keys(data).map((area, index) => (
              <div 
                key={`legend-${index}`} 
                className={styles.legendItem}
                onClick={() => toggleAreaVisibility(area)}
                style={{
                  cursor: 'pointer',
                  opacity: hiddenAreas[area] ? 0.3 : 1,
                  textDecoration: hiddenAreas[area] ? 'line-through' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <div 
                  className={styles.legendColor} 
                  style={{ 
                    backgroundColor: areaColors[area] || `hsl(${index * 60}, 70%, 50%)`,
                    opacity: hiddenAreas[area] ? 0.3 : 1
                  }}
                />
                <div 
                  className={styles.legendText} 
                  style={{ 
                    color: theme === "dark" ? "#ffffff" : "#0a2ff1",
                    fontWeight: hiddenAreas[area] ? 'normal' : 'bold'
                  }}
                >
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