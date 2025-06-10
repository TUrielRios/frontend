"use client"

import { useState, useEffect } from "react"
import RadarChart from "../RadarChart/RadarChart"
import styles from "./ResultsPhase.module.css"
import textos from "../../constants/constants"

const ResultsPhase = ({ phaseScores, onFeedbackSubmit }) => {
  const [feedback, setFeedback] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [feedbackQuestion, setFeedbackQuestion] = useState(
    "¿Te gustaría dejarnos algún comentario o feedback sobre tu experiencia?",
  )
  const [loadingQuestion, setLoadingQuestion] = useState(true)

  // Función para cargar la pregunta de feedback desde la API
  useEffect(() => {
    const cargarPreguntaFeedback = async () => {
      setLoadingQuestion(true)
      try {
        const response = await fetch("https://lacocina-backend-deploy.vercel.app/textos")

        if (!response.ok) {
          throw new Error(`Error al cargar los textos: ${response.status}`)
        }

        const data = await response.json()

        // Buscar el texto con la key "pregunta_fase_final"
        const preguntaFeedback = data.find((item) => item.key === "pregunta_fase_final")

        if (preguntaFeedback && preguntaFeedback.value) {
          setFeedbackQuestion(preguntaFeedback.value)
        }
      } catch (err) {
        console.error("Error al cargar la pregunta de feedback:", err)
        // Mantener el texto predeterminado en caso de error
      } finally {
        setLoadingQuestion(false)
      }
    }

    cargarPreguntaFeedback()
  }, [])

  // Función para convertir <br/> en <br/><br/>
  const formatDescription = (text) => {
    return text.replace(/<br\/>/g, "<br/><br/>")
  }

  // Función para convertir el texto con <br/> en HTML
  const createMarkup = (text) => {
    return { __html: text }
  }

  const allPhases = [
    "ATRACTIVO",
    "VALIDACIÓN SOCIAL",
    "RECIPROCIDAD",
    "AUTORIDAD",
    "AUTENTICIDAD",
    "CONSISTENCIA Y COMPROMISO",
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (feedback.trim()) {
      onFeedbackSubmit(feedback)
      setIsSubmitted(true)
    }
  }

  return (
    <div className={styles.resultsContainer}>
      <div className={styles.resultsContent}>
        {!isSubmitted ? (
          <>
            <h1 className={styles.resultsTitle}>{textos.titulo_fase_final}</h1>
            <form onSubmit={handleSubmit} className={styles.feedbackForm}>
              <label htmlFor="feedback" className={styles.feedbackLabel}>
                {loadingQuestion ? "Cargando..." : feedbackQuestion}
              </label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className={styles.feedbackInput}
                placeholder="Escribe tu mensaje aquí..."
                rows={4}
              />
              <button type="submit" className={styles.feedbackSubmit}>
                Enviar
              </button>
            </form>
          </>
        ) : (
          <div className={styles.thanksContainer}>
            <h1 className={styles.thanksTitle}>¡Gracias por participar!</h1>
            <div 
              className={styles.thanksText}
              dangerouslySetInnerHTML={createMarkup(formatDescription(textos.texto_post_mensaje_final))}
            />
          </div>
        )}
      </div>
      {!isSubmitted && (
        <div className={styles.resultsChartContainer}>
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
            completedPhases={allPhases}
          />
        </div>
      )}
    </div>
  )
}

export default ResultsPhase