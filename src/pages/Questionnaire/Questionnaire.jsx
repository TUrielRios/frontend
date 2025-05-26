"use client"

import { useState, useEffect } from "react"
import styles from "./Questionnaire.module.css"
import { ThumbsUp, BarChart2, X } from "lucide-react"
import logoLight from "../../assets/logo.png"
import logoDark from "../../assets/logo-black.png"
// Componentes
import Header from "../../components/Header/Header"
import IntroPhase from "../../components/IntroPhase/IntroPhase"
import QuestionPhase from "../../components/QuestionPhase/QuestionPhase"
import RadarChart from "../../components/RadarChart/RadarChart"
import ResultsPhase from "../../components/ResultsPhase/ResultsPhase"
import phaseInfo from "../../constants/phasesInfo"

const Questionnaire = () => {
  // Estados
  const [questions, setQuestions] = useState({})
  const [phases, setPhases] = useState([])
  const [currentPhase, setCurrentPhase] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showIntro, setShowIntro] = useState(true)
  const [phaseScores, setPhaseScores] = useState({})
  const [displayedPhaseScores, setDisplayedPhaseScores] = useState({}) // New state for displayed scores
  const [selectedOption, setSelectedOption] = useState(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [completedPhases, setCompletedPhases] = useState([])
  const [startedPhases, setStartedPhases] = useState([])
  const [theme, setTheme] = useState("dark")
  const [showChartMobile, setShowChartMobile] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [previousAnswers, setPreviousAnswers] = useState({}) // Store previous answers

  const [userId, setUserId] = useState(null)
  const [selectedModalidad, setSelectedModalidad] = useState(() => {
    // Obtener la modalidad seleccionada del localStorage
    return localStorage.getItem("selectedModalidad") || "Curso"
  })

  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    // Verificar al cargar
    checkIfMobile()

    // Agregar listener para cambios de tamaño
    window.addEventListener("resize", checkIfMobile)

    // Limpiar listener
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Set theme based on showIntro state
  useEffect(() => {
    setTheme(showIntro ? "light" : "dark")
  }, [showIntro])

  // Cargar el ID del usuario desde localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId")
    if (storedUserId) {
      setUserId(storedUserId)
    }
  }, [])

  // Cargar preguntas
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("https://lacocina-backend-deploy.vercel.app/preguntas")
        if (!response.ok) {
          throw new Error("Error al obtener las preguntas")
        }
        const data = await response.json()

        if (!Array.isArray(data) || !data.every((q) => q.phase && q.text)) {
          throw new Error("Estructura de datos inválida")
        }

        // Filtrar preguntas por modalidad seleccionada
        const filteredData = data.filter((question) => question.modalidad === selectedModalidad)

        // Agrupar preguntas por fase
        const groupedQuestions = filteredData.reduce((acc, question) => {
          if (!acc[question.phase]) {
            acc[question.phase] = []
          }
          acc[question.phase].push(question)
          return acc
        }, {})

        // Ordenar las preguntas por ID dentro de cada fase
        Object.keys(groupedQuestions).forEach((phase) => {
          groupedQuestions[phase].sort((a, b) => a.id - b.id)
        })

        // Definir el orden de las fases
        const phaseOrder = [
          "VALIDACIÓN SOCIAL",
          "ATRACTIVO",
          "RECIPROCIDAD",
          "AUTORIDAD",
          "AUTENTICIDAD",
          "CONSISTENCIA Y COMPROMISO",
        ]

        // Reorganizar las preguntas según el orden definido
        const orderedQuestions = {}
        phaseOrder.forEach((phase) => {
          if (groupedQuestions[phase]) {
            orderedQuestions[phase] = groupedQuestions[phase]
          }
        })

        setQuestions(orderedQuestions)
        setPhases(phaseOrder)
        setCurrentPhase(phaseOrder[0] || null)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [selectedModalidad])

  // Función para actualizar el puntaje de una fase en el backend
  const updatePhaseScore = async (phase, score) => {
    if (!userId) {
      console.error("No se encontró ID de usuario para actualizar puntajes")
      return
    }

    try {
      // Mapear el nombre de la fase al nombre del campo en el backend
      const phaseFieldMap = {
        "VALIDACIÓN SOCIAL": "validacionSocial",
        ATRACTIVO: "atractivo",
        RECIPROCIDAD: "reciprocidad",
        AUTORIDAD: "autoridad",
        AUTENTICIDAD: "autenticidad",
        "CONSISTENCIA Y COMPROMISO": "consistenciaCompromiso",
      }

      const fieldName = phaseFieldMap[phase]
      if (!fieldName) {
        console.error(`No se encontró mapeo para la fase: ${phase}`)
        return
      }

      // Preparar los datos para la actualización
      const updateData = {
        [fieldName]: score,
      }

      console.log(`Actualizando fase ${phase} (${fieldName}) con puntaje ${score} para usuario ${userId}`)

      // Enviar la actualización al backend
      const response = await fetch(`https://lacocina-backend-deploy.vercel.app/usuarios/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Error al actualizar el puntaje: ${errorText}`)
      }

      console.log(`Puntaje de ${phase} actualizado a ${score}`)
    } catch (err) {
      console.error("Error al actualizar el puntaje:", err)
    }
  }

  // Manejadores de eventos
  const handleAnswer = (value) => {
    setSelectedOption(value)
    const scoreMap = {
      Nunca: 0,
      "Casi nunca": 2.5,
      "A veces": 5,
      "La mayoría de las veces": 7,
      Siempre: 10,
    }
    const score = scoreMap[value]

    // Store the answer for this question
    setPreviousAnswers((prev) => ({
      ...prev,
      [`${currentPhase}_${currentStep}`]: value,
    }))

    setPhaseScores((prevScores) => {
      const currentScores = prevScores[currentPhase] || []
      const newScores = [...currentScores]
      newScores[currentStep] = score

      // Calcular el promedio actual
      const average =
        newScores.reduce((sum, curr) => sum + (curr || 0), 0) / (newScores.filter((s) => s !== undefined).length || 1)

      return {
        ...prevScores,
        [currentPhase]: newScores,
        [`${currentPhase}_avg`]: Math.round(average),
      }
    })
  }

  // New function to handle going back to the previous question
  const handlePrevious = () => {
    if (currentStep > 0) {
      // Go back to the previous question in the same phase
      setCurrentStep(currentStep - 1)

      // Restore the previous answer if it exists
      const previousAnswer = previousAnswers[`${currentPhase}_${currentStep - 1}`]
      setSelectedOption(previousAnswer || null)
    }
  }

  const handleNext = () => {
    setSelectedOption(null)
    const phaseQuestions = questions[currentPhase] || []

    if (showIntro) {
      setShowIntro(false)
      // Registrar que la fase ha sido iniciada
      if (!startedPhases.includes(currentPhase)) {
        setStartedPhases((prev) => [...prev, currentPhase])
      }
    } else if (currentStep < phaseQuestions.length - 1) {
      // Not the last question of the phase, just move to the next question
      setCurrentStep((prev) => prev + 1)

      // Set the selected option to the previously saved answer if it exists
      const nextAnswer = previousAnswers[`${currentPhase}_${currentStep + 1}`]
      setSelectedOption(nextAnswer || null)
    } else {
      // This is the last question of the phase
      // Calculate the average score for the current phase
      const currentScores = phaseScores[currentPhase] || []
      const validScores = currentScores.filter((score) => score !== undefined)

      if (validScores.length > 0) {
        const averageScore = validScores.reduce((sum, score) => sum + score, 0) / validScores.length
        const roundedAverage = Math.round(averageScore * 10) / 10 // Redondear a 1 decimal

        console.log(`Fase ${currentPhase} completada. Puntaje promedio: ${roundedAverage}`)

        // Update the backend score
        updatePhaseScore(currentPhase, roundedAverage)

        // Update the displayed scores only at the end of each phase
        setDisplayedPhaseScores((prev) => ({
          ...prev,
          [`${currentPhase}_avg`]: Math.round(averageScore),
        }))
      } else {
        console.warn(`No hay puntajes válidos para la fase ${currentPhase}`)
      }

      // Mark the current phase as completed
      setCompletedPhases((prev) => [...prev, currentPhase])

      const nextPhaseIndex = phases.indexOf(currentPhase) + 1
      if (nextPhaseIndex < phases.length) {
        setCurrentPhase(phases[nextPhaseIndex])
        setCurrentStep(0)
        setShowIntro(true)
      } else {
        // Questionnaire completed - show final results
        setIsCompleted(true)
      }
    }
  }

  const handleToggleChart = () => {
    setShowChartMobile(!showChartMobile)
  }

  const handleDownloadBook = () => {
    // Implementar la lógica para descargar el libro
    console.log("Descargando libro...")
  }

  const handleDownloadResults = () => {
    // Implementar la lógica para descargar los resultados
    console.log("Descargando resultados...")
  }

  // Renderizado condicional para estados de carga y error
  if (loading) return <p className={styles.loading}>Cargando preguntas...</p>
  if (error) return <p className={styles.error}>Error: {error}</p>

  // Preparar datos para el componente actual
  const phaseQuestions = questions[currentPhase] || []
  const currentQuestion = phaseQuestions[currentStep] || {}
  const currentPhaseInfo = phaseInfo[currentPhase] || {}
  const PhaseIcon = currentPhaseInfo.icon || ThumbsUp

  // Renderizar la pantalla de resultados finales
  if (isCompleted) {
    return (
      <div className={`${styles.wrapper} ${theme === "light" ? styles.wrapperLight : ""}`}>
        <Header logoLight={logoLight} logoDark={logoDark} theme={theme} />
        <ResultsPhase
          phaseScores={displayedPhaseScores} // Use displayed scores for final results
          onDownloadBook={handleDownloadBook}
          onDownloadResults={handleDownloadResults}
        />
      </div>
    )
  }

  // Check if we're on the last question of the phase
  const isLastQuestion = currentStep === phaseQuestions.length - 1

  return (
    <div className={`${styles.wrapper} ${theme === "light" ? styles.wrapperLight : ""}`}>
      <Header logoLight={logoLight} logoDark={logoDark} theme={theme} />
      <main className={styles.container}>
        {showIntro ? (
          <IntroPhase
            phaseInfo={{
              ...currentPhaseInfo,
              title: currentPhase,
            }}
            onNext={handleNext}
          />
        ) : (
          <>
            <div className={styles.wholeContainer}>
              <QuestionPhase
                phase={currentPhase}
                phaseIcon={PhaseIcon}
                question={currentQuestion}
                currentStep={currentStep}
                totalSteps={phaseQuestions.length}
                selectedOption={selectedOption}
                onSelect={handleAnswer}
                onNext={handleNext}
                onPrevious={handlePrevious} // Pass the new handler
              />

              {/* Para tamaños desktop, mostrar el sidebar normalmente */}
              {!isMobile && (
                <aside className={styles.sidebar}>
                  <RadarChart
                    data={{
                      ATRACTIVO: displayedPhaseScores["ATRACTIVO_avg"] || 0,
                      "VALIDACIÓN SOCIAL": displayedPhaseScores["VALIDACIÓN SOCIAL_avg"] || 0,
                      RECIPROCIDAD: displayedPhaseScores["RECIPROCIDAD_avg"] || 0,
                      AUTORIDAD: displayedPhaseScores["AUTORIDAD_avg"] || 0,
                      AUTENTICIDAD: displayedPhaseScores["AUTENTICIDAD_avg"] || 0,
                      "CONSISTENCIA Y COMPROMISO": displayedPhaseScores["CONSISTENCIA Y COMPROMISO_avg"] || 0,
                    }}
                    theme={theme}
                    startedPhases={startedPhases}
                  />
                </aside>
              )}
            </div>

            {/* Botón para mostrar/ocultar el gráfico en móvil */}
            {isMobile && (
              <button className={styles.toggleChartButton} onClick={handleToggleChart} aria-label="Ver gráfico">
                <BarChart2 size={24} />
              </button>
            )}

            {/* Modal para el gráfico en dispositivos móviles */}
            {isMobile && showChartMobile && (
              <div className={styles.chartModalOverlay}>
                <div className={styles.chartModal}>
                  <button className={styles.closeChartButton} onClick={handleToggleChart} aria-label="Cerrar gráfico">
                    <X size={24} />
                  </button>
                  <div className={styles.chartModalContent}>
                    <RadarChart
                      data={{
                        ATRACTIVO: displayedPhaseScores["ATRACTIVO_avg"] || 0,
                        "VALIDACIÓN SOCIAL": displayedPhaseScores["VALIDACIÓN SOCIAL_avg"] || 0,
                        RECIPROCIDAD: displayedPhaseScores["RECIPROCIDAD_avg"] || 0,
                        AUTORIDAD: displayedPhaseScores["AUTORIDAD_avg"] || 0,
                        AUTENTICIDAD: displayedPhaseScores["AUTENTICIDAD_avg"] || 0,
                        "CONSISTENCIA Y COMPROMISO": displayedPhaseScores["CONSISTENCIA Y COMPROMISO_avg"] || 0,
                      }}
                      theme={theme}
                      startedPhases={startedPhases}
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default Questionnaire
