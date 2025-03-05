"use client"

import { useState, useEffect } from "react"
import styles from "./Questionnaire.module.css"
import { ThumbsUp } from "lucide-react"
import logo from "../../assets/logo.png"
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
  const [selectedOption, setSelectedOption] = useState(null)
  const [isCompleted, setIsCompleted] = useState(false)

  // Cargar preguntas
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("https://lacocina-backend.onrender.com/api/preguntas")
        if (!response.ok) {
          throw new Error("Error al obtener las preguntas")
        }
        const data = await response.json()

        if (!Array.isArray(data) || !data.every((q) => q.phase && q.text)) {
          throw new Error("Estructura de datos inválida")
        }

        // Agrupar preguntas por fase
        const groupedQuestions = data.reduce((acc, question) => {
          if (!acc[question.phase]) {
            acc[question.phase] = []
          }
          acc[question.phase].push(question)
          return acc
        }, {})

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
  }, [])

  // Manejadores de eventos
  const handleAnswer = (value) => {
    setSelectedOption(value)
    const scoreMap = {
      Nunca: 1,
      "Casi nunca": 3,
      "A veces": 5,
      "La mayoría de las veces": 7,
      Siempre: 9,
    }
    const score = scoreMap[value]

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

  const handleNext = () => {
    setSelectedOption(null)
    const phaseQuestions = questions[currentPhase] || []

    if (showIntro) {
      setShowIntro(false)
    } else if (currentStep < phaseQuestions.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      const nextPhaseIndex = phases.indexOf(currentPhase) + 1
      if (nextPhaseIndex < phases.length) {
        setCurrentPhase(phases[nextPhaseIndex])
        setCurrentStep(0)
        setShowIntro(true)
        setPhaseScores((prevScores) => ({
          ...prevScores,
          [currentPhase]: Math.round((prevScores[currentPhase] || 0) / phaseQuestions.length),
        }))
      } else {
        // Cuestionario completado - mostrar resultados finales
        setIsCompleted(true)
      }
    }
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
      <div className={styles.wrapper}>
        <Header logo={logo} />
        <ResultsPhase
          phaseScores={phaseScores}
          onDownloadBook={handleDownloadBook}
          onDownloadResults={handleDownloadResults}
        />
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <Header logo={logo} />
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
            />
            <aside className={styles.sidebar}>
              <RadarChart
                data={{
                  ATRACTIVO: phaseScores["ATRACTIVO_avg"] || 0,
                  "VALIDACIÓN SOCIAL": phaseScores["VALIDACIÓN SOCIAL_avg"] || 0,
                  RECIPROCIDAD: phaseScores["RECIPROCIDAD_avg"] || 0,
                  AUTORIDAD: phaseScores["AUTORIDAD_avg"] || 0,
                  AUTENTICIDAD: phaseScores["AUTENTICIDAD_avg"] || 0,
                  "CONSISTENCIA Y COMPROMISO": phaseScores["CONSISTENCIA Y COMPROMISO_avg"] || 0,
                }}
                theme="dark"
              />
            </aside>
          </div>
        )}
      </main>
    </div>
  )
}

export default Questionnaire

