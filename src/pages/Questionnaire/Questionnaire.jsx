"use client"

import { useState } from "react"
import styles from "./Questionnaire.module.css"

const Questionnaire = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({})

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1)
  }

  const handleAnswerSelect = (value) => {
    setAnswers((prev) => ({
      ...prev,
      [`question_${currentStep}`]: value,
    }))
  }

  const screens = [
    {
      type: "concept",
      factor: "Primer factor",
      title: "VALIDACIÓN SOCIAL",
      icon: "👍",
      description: [
        "Principio fundamental en la psicología del consumidor, basado en el deseo innato de pertenecer y ser aceptado.",
        "En branding, se activa cuando los consumidores ven que otros, especialmente aquellos que respetan o admiran, utilizan un producto o servicio. Este comportamiento genera una atracción natural hacia la marca, motivada por el deseo de ser parte de un grupo o tendencia.",
        "La validación social actúa como un atajo mental: si muchas personas ya han optado por una marca, es probable que sea una opción segura y confiable.",
      ],
    },
    {
      type: "question",
      title: "Validación social",
      questionNumber: 1,
      totalQuestions: 10,
      question: "¿Los clientes recomiendan activamente nuestra marca?",
      options: ["Nunca", "Casi nunca", "A veces", "La mayoría de las veces", "Siempre"],
    },
    {
      type: "concept",
      factor: "Segundo factor",
      title: "ATRACTIVO",
      icon: "☀️",
      description: [
        "El atractivo en el branding se refiere a la capacidad de una marca para captar y mantener la atención de su público objetivo. Más allá de la estética, abarca cómo una marca satisface las motivaciones fundamentales de su audiencia, desde necesidades funcionales hasta deseos emocionales. Es la mezcla de forma y sustancia que hace que una marca no solo sea visible, sino también memorable.",
        "El atractivo no es un atributo superficial; es un componente esencial que determina si los consumidores elegirán interactuar con una marca en un mercado saturado de opciones.",
      ],
    },
  ]

  const currentScreen = screens[currentStep]

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-eSNOuWaEx34kV1mRYSB7JfPT1OwPe6.png"
          alt="La Cocina"
          className={styles.logo}
        />
        <div className={styles.userIcon}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" />
          </svg>
        </div>
      </header>

      <main className={styles.main}>
        {currentScreen.type === "concept" ? (
          <div className={styles.conceptScreen}>
            <div className={styles.conceptContent}>
              <span className={styles.factor}>{currentScreen.factor}</span>
              <div className={styles.titleWrapper}>
                <h1 className={styles.title}>{currentScreen.title}</h1>
                <div className={styles.iconWrapper}>
                  <span className={styles.icon}>{currentScreen.icon}</span>
                  <span className={styles.iconLabel}>Animación de icono</span>
                </div>
              </div>
              <div className={styles.description}>
                {currentScreen.description.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
            <button onClick={handleNext} className={styles.nextButton}>
              →
            </button>
          </div>
        ) : (
          <div className={styles.questionScreen}>
            <div className={styles.questionCard}>
              <div className={styles.questionHeader}>
                <span className={styles.icon}>👍</span>
                <h2>{currentScreen.title}</h2>
              </div>

              <div className={styles.questionContent}>
                <h3 className={styles.questionTitle}>
                  {currentScreen.questionNumber}/{currentScreen.totalQuestions} {currentScreen.question}
                </h3>

                <div className={styles.options}>
                  {currentScreen.options.map((option, index) => (
                    <label key={index} className={styles.option}>
                      <input
                        type="radio"
                        name="answer"
                        value={option}
                        onChange={() => handleAnswerSelect(option)}
                        checked={answers[`question_${currentStep}`] === option}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button onClick={handleNext} className={styles.nextButton}>
                →
              </button>

              <div className={styles.progressBar}>
                <div
                  className={styles.progress}
                  style={{ width: `${(currentScreen.questionNumber / currentScreen.totalQuestions) * 100}%` }}
                />
              </div>
            </div>

            <div className={styles.hexagonDiagram}>{/* Add your hexagon diagram here */}</div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Questionnaire

