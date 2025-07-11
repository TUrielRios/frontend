"use client"
import { useState, useEffect } from "react"
import styles from "./Questionnaire.module.css"
import { ThumbsUp, X } from "lucide-react"
import logoLight from "../../assets/logo.png"
import logoDark from "../../assets/logo-black.png"

// Componentes
import Header from "../../components/Header/Header"
import IntroPhase from "../../components/IntroPhase/IntroPhase"
import QuestionPhase from "../../components/QuestionPhase/QuestionPhase"
import RadarChart from "../../components/RadarChart/RadarChart"
import ResultsPhase from "../../components/ResultsPhase/ResultsPhase"
import phaseInfo from "../../constants/phasesInfo"
import iconoDiamente from "../../assets/iconos-animados/diamante-icono.png"

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
  const [displayedPhaseScores, setDisplayedPhaseScores] = useState({})
  const [selectedOption, setSelectedOption] = useState(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [completedPhases, setCompletedPhases] = useState([])
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const [startedPhases, setStartedPhases] = useState([])
  const [theme, setTheme] = useState("dark")
  const [showChartMobile, setShowChartMobile] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [previousAnswers, setPreviousAnswers] = useState({})
  const [userId, setUserId] = useState(null)
  const [selectedModalidad, setSelectedModalidad] = useState(() => {
    return localStorage.getItem("selectedModalidad") || "Curso"
  })

  // Nuevos estados para manejo de progreso
  const [progressLoaded, setProgressLoaded] = useState(false)
  const [userValidated, setUserValidated] = useState(false)

  // Función para guardar el progreso en localStorage
  const saveProgress = () => {
    if (!userId) return

    const progressData = {
      userId,
      selectedModalidad,
      currentPhase,
      currentStep,
      showIntro,
      phaseScores,
      displayedPhaseScores,
      previousAnswers,
      completedPhases,
      startedPhases,
      isCompleted,
      feedbackSubmitted,
      timestamp: new Date().toISOString(),
    }

    try {
      localStorage.setItem("questionnaireProgress", JSON.stringify(progressData))
      console.log("Progreso guardado:", progressData)
    } catch (error) {
      console.error("Error al guardar progreso:", error)
    }
  }

  // Función para cargar el progreso desde localStorage
  const loadProgress = async () => {
    try {
      const savedProgress = localStorage.getItem("questionnaireProgress")
      if (!savedProgress) {
        console.log("No hay progreso guardado")
        return false
      }

      const progressData = JSON.parse(savedProgress)
      console.log("Progreso encontrado:", progressData)

      // Verificar que el progreso no sea muy antiguo (más de 7 días)
      const savedTime = new Date(progressData.timestamp)
      const currentTime = new Date()
      const daysDifference = (currentTime - savedTime) / (1000 * 60 * 60 * 24)

      if (daysDifference > 7) {
        console.log("Progreso muy antiguo, eliminando...")
        localStorage.removeItem("questionnaireProgress")
        return false
      }

      // Verificar que el usuario existe en el backend
      const userExists = await validateUser(progressData.userId)
      if (!userExists) {
        console.log("Usuario no válido, eliminando progreso...")
        localStorage.removeItem("questionnaireProgress")
        return false
      }

      // Restaurar el estado
      setUserId(progressData.userId)
      setSelectedModalidad(progressData.selectedModalidad)
      setCurrentPhase(progressData.currentPhase)
      setCurrentStep(progressData.currentStep)
      setShowIntro(progressData.showIntro)
      setPhaseScores(progressData.phaseScores || {})
      setDisplayedPhaseScores(progressData.displayedPhaseScores || {})
      setPreviousAnswers(progressData.previousAnswers || {})
      setCompletedPhases(progressData.completedPhases || [])
      setStartedPhases(progressData.startedPhases || [])
      setIsCompleted(progressData.isCompleted || false)
      setFeedbackSubmitted(progressData.feedbackSubmitted || false)

      // Restaurar la respuesta seleccionada actual si existe
      const currentAnswer = progressData.previousAnswers?.[`${progressData.currentPhase}_${progressData.currentStep}`]
      setSelectedOption(currentAnswer || null)

      console.log("Progreso restaurado exitosamente")
      return true
    } catch (error) {
      console.error("Error al cargar progreso:", error)
      localStorage.removeItem("questionnaireProgress")
      return false
    }
  }

  // Función para validar que el usuario existe en el backend
  const validateUser = async (userIdToValidate) => {
    try {
      const response = await fetch(`https://lacocina-backend-deploy.vercel.app/usuarios/${userIdToValidate}`)
      return response.ok
    } catch (error) {
      console.error("Error al validar usuario:", error)
      return false
    }
  }

  // Función para limpiar el progreso guardado
  const clearProgress = () => {
    localStorage.removeItem("questionnaireProgress")
    console.log("Progreso eliminado")
  }

  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Set theme based on showIntro state
  useEffect(() => {
    setTheme(showIntro ? "light" : "dark")
  }, [showIntro])

  // Cargar el ID del usuario y progreso al inicializar
  useEffect(() => {
    const initializeUser = async () => {
      try {
        // Intentar cargar progreso guardado primero
        const progressLoaded = await loadProgress()

        if (!progressLoaded) {
          // Si no hay progreso, obtener userId del localStorage
          const storedUserId = localStorage.getItem("userId")
          if (!storedUserId) {
            setError("No se encontró información de usuario. Por favor, completa el formulario inicial.")
            setLoading(false)
            return
          }

          // Validar que el usuario existe
          const userExists = await validateUser(storedUserId)
          if (!userExists) {
            setError("Usuario no válido. Por favor, completa el formulario inicial nuevamente.")
            localStorage.removeItem("userId")
            localStorage.removeItem("selectedModalidad")
            setLoading(false)
            return
          }

          setUserId(storedUserId)
        }

        setUserValidated(true)
        setProgressLoaded(true)
      } catch (error) {
        console.error("Error al inicializar usuario:", error)
        setError("Error al cargar la información del usuario.")
        setLoading(false)
      }
    }

    initializeUser()
  }, [])

  // Cargar preguntas
  useEffect(() => {
    if (!userValidated || !progressLoaded) return

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

        // Solo establecer la fase inicial si no hay progreso cargado
        if (!currentPhase) {
          setCurrentPhase(phaseOrder[0] || null)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [selectedModalidad, userValidated, progressLoaded, currentPhase])

  // Guardar progreso automáticamente cuando cambian los estados importantes
  useEffect(() => {
    if (userId && progressLoaded && !loading) {
      saveProgress()
    }
  }, [
    userId,
    currentPhase,
    currentStep,
    showIntro,
    phaseScores,
    displayedPhaseScores,
    previousAnswers,
    completedPhases,
    startedPhases,
    isCompleted,
    feedbackSubmitted,
    progressLoaded,
    loading,
  ])

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

  // Función para manejar el envío de feedback
  const handleFeedbackSubmit = async (feedbackMessage) => {
    try {
      // 1. Verificar que tenemos userId y feedback
      if (!userId) {
        console.error("No se encontró ID de usuario para enviar feedback")
        throw new Error("No se pudo identificar tu usuario. Por favor recarga la página.")
      }
      if (!feedbackMessage.trim()) {
        throw new Error("El mensaje de feedback no puede estar vacío")
      }

      // 2. Obtener el usuario actual primero para verificar que existe
      const userResponse = await fetch(`https://lacocina-backend-deploy.vercel.app/usuarios/${userId}`)

      if (!userResponse.ok) {
        const errorData = await userResponse.json()
        throw new Error(errorData.error || "Usuario no encontrado")
      }

      const userData = await userResponse.json()

      // 3. Actualizar solo el campo mensajeFeedback
      const updateResponse = await fetch(`https://lacocina-backend-deploy.vercel.app/usuarios/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mensajeFeedback: feedbackMessage,
        }),
      })

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json()
        throw new Error(errorData.error || "Error al actualizar el feedback")
      }

      // 4. Manejar éxito
      setFeedbackSubmitted(true)

      // 5. Limpiar progreso guardado ya que el cuestionario está completado
      clearProgress()

      return { success: true }
    } catch (err) {
      console.error("Error al enviar feedback:", err)

      // Mostrar alerta al usuario (puedes personalizar esto)
      alert(`Error al enviar feedback: ${err.message}`)

      return { success: false, error: err.message }
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

  // Función para reiniciar el cuestionario (útil para testing)
  const handleRestart = () => {
    if (window.confirm("¿Estás seguro de que quieres reiniciar el cuestionario? Se perderá todo el progreso.")) {
      clearProgress()
      window.location.reload()
    }
  }

  // Renderizado condicional para estados de carga y error
  if (loading) return <p className={styles.loading}>Cargando cuestionario...</p>
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.error}>Error: {error}</p>
        <button onClick={() => (window.location.href = "/")} className={styles.backToFormButton}>
          Volver al formulario inicial
        </button>
      </div>
    )
  }

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
          phaseScores={displayedPhaseScores}
          onDownloadBook={handleDownloadBook}
          onDownloadResults={handleDownloadResults}
          onFeedbackSubmit={handleFeedbackSubmit}
        />
      </div>
    )
  }

  // Check if we're on the last question of the phase
  const isLastQuestion = currentStep === phaseQuestions.length - 1

  return (
    <div className={`${styles.wrapper} ${theme === "light" ? styles.wrapperLight : ""}`}>
      <Header logoLight={logoLight} logoDark={logoDark} theme={theme} />

      {/* Botón de reinicio para desarrollo/testing */}
      {/* {process.env.NODE_ENV === "development" && (
        <button
          onClick={handleRestart}
          className={styles.restartButton}
          style={{
            position: "fixed",
            top: "10px",
            right: "10px",
            zIndex: 1000,
            background: "#ff4444",
            color: "white",
            border: "none",
            padding: "8px 12px",
            borderRadius: "4px",
            fontSize: "12px",
          }}
        >
          Reiniciar
        </button>
      )} */}

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
                onPrevious={handlePrevious}
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
                <img src={iconoDiamente || "/placeholder.svg"} alt="" srcSet="" />
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
