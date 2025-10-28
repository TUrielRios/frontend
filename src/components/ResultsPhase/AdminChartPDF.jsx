// components/AdminChartPDF.js

import { useState, useEffect } from "react"
//iconos
import atractivoIconoAzul from '../../assets/iconos-animados/atractivo-icono-azul.png'
import reciprocidadIconoAzul from '../../assets/iconos-animados/reciprocidad-icono-azul.png'
import autoridadIconoAzul from '../../assets/iconos-animados/autoridad-icono-azul.png'
import autenticidadIconoAzul from '../../assets/iconos-animados/autenticidad-icono-azul.png'
import consistenciaIconoAzul from '../../assets/iconos-animados/consistencia-compromiso-icono-azul.png'
import validacionSocialIconoAzul from '../../assets/iconos-animados/validacion-social-icono-azul.png'

const AdminChartPDF = ({ data, completedPhases = [] }) => {
  const [animatedData, setAnimatedData] = useState(data)

  useEffect(() => {
    setAnimatedData(data)
  }, [data])

  const labels = [
    "ATRACTIVO",
    "RECIPROCIDAD", 
    "AUTORIDAD",
    "AUTENTICIDAD",
    "CONSISTENCIA Y COMPROMISO",
    "VALIDACIÓN SOCIAL",
  ]

  const labelIcons = {
    "ATRACTIVO": atractivoIconoAzul,
    "RECIPROCIDAD": reciprocidadIconoAzul,
    "AUTORIDAD": autoridadIconoAzul,
    "AUTENTICIDAD": autenticidadIconoAzul,
    "CONSISTENCIA Y COMPROMISO": consistenciaIconoAzul || atractivoIconoAzul, // fallback para debug
    "VALIDACIÓN SOCIAL": validacionSocialIconoAzul,
  }

  // Debug: verifica si el icono se importó correctamente
  console.log('Icono de consistencia:', consistenciaIconoAzul)

  const calculatePoints = () => {
    const points = []
    const center = { x: 250, y: 250 }
    const maxRadius = 140

    for (let i = 0; i < labels.length; i++) {
      const angle = (Math.PI * 2 * i) / labels.length - Math.PI / 2
      const value = animatedData[labels[i]] || 0
      const clampedValue = Math.max(0, Math.min(10, value))
      const radius = (clampedValue / 10) * maxRadius

      const x = center.x + radius * Math.cos(angle)
      const y = center.y + radius * Math.sin(angle)
      points.push(`${x},${y}`)
    }
    return points.join(" ")
  }

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

  // Colores para el PDF (tema light)
  const colors = {
    hexFill: "white",
    hexStroke: "#0a2ff1", 
    dotLine: "#0a2ff1",
    dataFill: "#3FFFF3",
    dataStroke: "#00ffff",
    labelText: "#0a2ff1",
    completedColor: "#0a2ff1",
  }

  return (
    <div style={{ 
      width: '600px', 
      height: '600px', 
      background: 'white',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      <svg 
        viewBox="-50 -50 600 600" 
        style={{ 
          width: '100%', 
          height: '100%',
          fontFamily: '"Red Hat Display", sans-serif'
        }}
      >
        {/* Hexágonos de fondo */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((scale, index) => (
          <polygon
            key={`hex-${index}`}
            points={generateHexPoints({ x: 250, y: 250 }, 150 * scale)}
            fill={colors.hexFill}
            stroke={colors.hexStroke}
            strokeWidth="10"
          />
        ))}

        {/* Números 1-9 */}
        {Array.from({ length: 6 }).map((_, lineIndex) => {
          const angle = (Math.PI * 2 * lineIndex) / 6 - Math.PI / 2
          return [0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9].map((scale, numIndex) => {
            const value = numIndex + 1
            const x = 250 + (140 * scale) * Math.cos(angle)
            const y = 250 + (140 * scale) * Math.sin(angle)
            
            return (
              <text
                key={`number-${lineIndex}-${numIndex}`}
                x={x}
                y={y}
                fill="#0a2ff1"
                fontSize="7"
                fontWeight="bold"
                dominantBaseline="middle"
                textAnchor="middle"
              >
                {value}
              </text>
            )
          })
        })}

        {/* Líneas punteadas */}
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2
          const x2 = 250 + 150 * Math.cos(angle)
          const y2 = 250 + 150 * Math.sin(angle)
          return (
            <line
              key={`line-${i}`}
              x1="250"
              y1="250"
              x2={x2}
              y2={y2}
              stroke={colors.dotLine}
              strokeWidth="1"
              strokeDasharray="4 12"
              opacity="0.1"
            />
          )
        })}

        {/* Área de datos */}
        <polygon
          points={calculatePoints()}
          fill={colors.dataFill}
          fillOpacity="0.3"
          stroke={colors.dataStroke}
          strokeWidth="2"
        />

        {/* Etiquetas de factores */}
        {labels.map((label, index) => {
          const angle = (Math.PI * 2 * index) / 6 - Math.PI / 2
          let radius = 219

          // Ajusta dinámicamente el radio igual que AdminChart
          if (label !== "ATRACTIVO" && label !== "AUTENTICIDAD") {
            radius = 255
          }
          if (label === "AUTENTICIDAD") {
            radius = 228
          }
          if (label === "ATRACTIVO") {
            radius = 220
          }

          const x = 250 + radius * Math.cos(angle)
          const y = 266 + radius * Math.sin(angle)

          const iconSrc = labelIcons[label]

          return (
            <g key={label}>
              {/* Icono - Usar las mismas coordenadas que AdminChart */}
              <image
                href={iconSrc}
                x={x - 19}
                y={y - 47.5}
                width="40"
                height="40"
                style={{ display: 'block' }}
                crossOrigin="anonymous"
                preserveAspectRatio="xMidYMid meet"
              />
              
              <text
                x={x}
                y={y}
                fill={colors.labelText}
                fontSize="14"
                fontWeight="500"
                dominantBaseline="middle"
                textAnchor="middle"
              >
                {label === "CONSISTENCIA Y COMPROMISO" ? (
                  <>
                    <tspan x={x} dy="0" fill={colors.labelText}>
                      CONSISTENCIA
                    </tspan>
                    <tspan x={x} dy="1.2em" fill={colors.labelText}>
                      Y COMPROMISO
                    </tspan>
                  </>
                ) : label === "VALIDACIÓN SOCIAL" ? (
                  <>
                    <tspan x={x} dy="0" fill={colors.labelText}>
                      VALIDACIÓN
                    </tspan>
                    <tspan x={x} dy="1.2em" fill={colors.labelText}>
                      SOCIAL
                    </tspan>
                  </>
                ) : (
                  label
                )}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default AdminChartPDF