"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import styles from "./Stats.module.css"

const Stats = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [groupBy, setGroupBy] = useState("industriaSector")
  const [selectedPhase, setSelectedPhase] = useState("1")

  // Mapeo de fases con sus nombres reales en los datos
  const phaseMapping = {
        1: { key: "validacionSocial", name: "Validación Social" },
    2: { key: "atractivo", name: "Atractivo" },
    3: { key: "reciprocidad", name: "Reciprocidad" },
        4: { key: "consistenciaCompromiso", name: "Consistencia y Compromiso" },
    5: { key: "autenticidad", name: "Autenticidad" },
        6: { key: "autoridad", name: "Autoridad" },

  }

  // Colores para las categorías
  const colors = [
    "#0a2ff1", "#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57",
    "#ff9ff3", "#54a0ff", "#5f27cd", "#00d2d3", "#ff9f43", "#10ac84",
    "#ee5a24", "#0984e3", "#6c5ce7", "#a29bfe", "#fd79a8", "#fdcb6e"
  ]

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch("https://lacocina-backend-deploy.vercel.app/usuarios/taller")
      const result = await response.json()
      console.log("Datos recibidos:", result) // Para debugging
      setData(result)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const processData = () => {
    if (!data || data.length === 0) return []

    // Obtener las fases a analizar
    let phasesToAnalyze = []
    if (selectedPhase === "all") {
      phasesToAnalyze = Object.keys(phaseMapping)
    } else {
      phasesToAnalyze = [selectedPhase]
    }

    // Agrupar datos por la categoría seleccionada y extraer textos de preguntas
    const groupedData = {}
    const questionTexts = {} // Para almacenar los textos de las preguntas
    
    data.forEach(user => {
      const groupKey = user[groupBy] || "Sin especificar"
      
      if (!groupedData[groupKey]) {
        groupedData[groupKey] = {}
        phasesToAnalyze.forEach(phaseNum => {
          const phaseKey = phaseMapping[phaseNum].key
          groupedData[groupKey][phaseKey] = []
        })
      }

      // Para cada fase, extraer las puntuaciones individuales usando la misma lógica que ResultsByCategory
      phasesToAnalyze.forEach(phaseNum => {
        const phaseKey = phaseMapping[phaseNum].key
        
        // Verificar si tiene respuestas individuales
        if (user.tieneRespuestasIndividuales && user.respuestasPorFase && user.respuestasPorFase[phaseKey]) {
          const preguntas = user.respuestasPorFase[phaseKey].preguntas
          if (preguntas && Array.isArray(preguntas)) {
            preguntas.forEach((pregunta, index) => {
              // Guardar el texto de la pregunta
              const questionKey = `${phaseKey}_${index}`
              if (!questionTexts[questionKey] && pregunta.textoPregunta) {
                questionTexts[questionKey] = pregunta.textoPregunta
              }
              
              if (pregunta.puntuacion && pregunta.puntuacion > 0) {
                groupedData[groupKey][phaseKey].push(pregunta.puntuacion)
              }
            })
          }
        } else {
          // Si no tiene respuestas individuales, usar los promedios calculados
          const score = user.promediosCalculados?.[phaseKey] || user[phaseKey] || 0
          if (score > 0) {
            // Para mantener consistencia, repetimos el promedio por cada pregunta (asumiendo 10 preguntas por fase)
            for (let i = 0; i < 10; i++) {
              groupedData[groupKey][phaseKey].push(score)
            }
          }
        }
      })
    })

    // Crear estructura para el gráfico - por pregunta individual
    const chartData = []
    
    // Crear datos por pregunta
    phasesToAnalyze.forEach(phaseNum => {
      const phaseInfo = phaseMapping[phaseNum]
      
      // Para cada fase, crear 10 entradas (una por pregunta)
      for (let i = 0; i < 10; i++) {
        const questionKey = `${phaseInfo.key}_${i}`
        const questionText = questionTexts[questionKey] || `Pregunta ${i + 1} de ${phaseInfo.name}`
        
        const questionData = {
          question: `${phaseInfo.name} P${i + 1}`,
          questionText: questionText, // Agregamos el texto completo
          phase: phaseInfo.name,
          questionNumber: i + 1
        }

        Object.keys(groupedData).forEach(group => {
          const phaseQuestions = groupedData[group][phaseInfo.key]
          if (phaseQuestions && phaseQuestions[i] !== undefined) {
            questionData[group] = Math.round(phaseQuestions[i] * 100) / 100
          } else {
            questionData[group] = 0
          }
        })

        chartData.push(questionData)
      }
    })

    return chartData
  }

  const chartData = processData()
  const categories = chartData.length > 0 ? 
    Object.keys(chartData[0])
      .filter(key => key !== "question" && key !== "questionText" && key !== "phase" && key !== "questionNumber") 
    : []

  // Custom tooltip component with proper text wrapping
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload
      return (
        <div className={styles.customTooltip}>
          <div className={styles.tooltipTitle}>
            {data.questionText || label}
          </div>
          <div className={styles.tooltipContent}>
            {payload.map((entry, index) => (
              entry.dataKey !== 'questionText' && 
              entry.dataKey !== 'phase' && 
              entry.dataKey !== 'questionNumber' ? (
                <div key={index} className={styles.tooltipItem}>
                  <span 
                    className={styles.tooltipColor} 
                    style={{ backgroundColor: entry.color }}
                  ></span>
                  <span className={styles.tooltipLabel}>{entry.dataKey}:</span>
                  <span className={styles.tooltipValue}>{entry.value} puntos</span>
                </div>
              ) : null
            ))}
          </div>
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Cargando datos...</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Promedio de Respuestas por Pregunta</h2>
        
        <div className={styles.controls}>
          <div className={styles.controlGroup}>
            <label>Agrupar por:</label>
            <select 
              value={groupBy} 
              onChange={(e) => setGroupBy(e.target.value)}
              className={styles.select}
            >
              <option value="industriaSector">Industria/Sector</option>
              <option value="sector">Sector</option>
              <option value="areaDesempeno">Área de Desempeño</option>
            </select>
          </div>

          <div className={styles.controlGroup}>
            <label>Fase:</label>
            <select 
              value={selectedPhase} 
              onChange={(e) => setSelectedPhase(e.target.value)}
              className={styles.select}
            >
                            <option value="1">Fase 1 - Validación Social</option>

              <option value="2">Fase 2 - Atractivo</option>
              <option value="3">Fase 3 - Reciprocidad</option>
                            <option value="4">Fase 4 - Consistencia y Compromiso</option>
              <option value="5">Fase 5 - Autenticidad</option>
              <option value="6">Fase 6 - Autoridad</option>
              <option value="all">Todas las fases</option>

            </select>
          </div>
        </div>
      </div>

      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={500}>
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 60,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="question" 
              angle={-45}
              textAnchor="end"
              height={100}
              fontSize={12}
              interval={0}
            />
            <YAxis 
              domain={[0, 10]}
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {categories.map((category, index) => (
              <Bar 
                key={category}
                dataKey={category} 
                fill={colors[index % colors.length]}
                name={category}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.info}>
        <p>Total de respuestas analizadas: {data.length}</p>
        <p>Mostrando promedios de {chartData.length} preguntas agrupadas por {groupBy}</p>
      </div>
    </div>
  )
}

export default Stats