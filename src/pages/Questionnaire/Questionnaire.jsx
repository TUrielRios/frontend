"use client"

import { useState } from "react"
import styles from "./Questionnaire.module.css"
import QuizChart from "../../components/QuizChart/QuizChart"

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
        "El atractivo en el branding se refiere a la capacidad de una marca para captar y mantener la atención de su público objetivo. Más allá de la estética, abarca cómo una marca satisface las motivaciones fundamentales de su audiencia, desde necesidades funcionales hasta deseos emocionales.",
        "El atractivo no es un atributo superficial; es un componente esencial que determina si los consumidores elegirán interactuar con una marca en un mercado saturado de opciones.",
      ],
    },
    {
      type: "question",
      title: "Atractivo",
      questionNumber: 2,
      totalQuestions: 10,
      question: "¿Nuestra personalidad de marca resuena emocionalmente con el público?",
      options: ["Nunca", "Casi nunca", "A veces", "La mayoría de las veces", "Siempre"],
    },
    {
      type: "concept",
      factor: "Tercer factor",
      title: "RECIPROCIDAD",
      icon: "🔄",
      description: [
        "La reciprocidad es un principio psicológico que postula que las personas tienden a devolver los favores o compensar las acciones recibidas.",
        "En el branding, esto significa que cuando una marca ofrece valor antes de pedir algo a cambio, como contenido útil, productos gratuitos o experiencias exclusivas, los consumidores se sienten inclinados a corresponder con lealtad o compras.",
        "Este principio es la base de estrategias como el modelo freemium, donde las marcas primero ofrecen algo valioso sin costo, con la expectativa de que los usuarios eventualmente se conviertan en clientes de pago.",
      ],
    },
    {
      type: "question",
      title: "Reciprocidad",
      questionNumber: 3,
      totalQuestions: 10,
      question: "¿Incorporamos la retroalimentación en nuestras mejoras?",
      options: ["Nunca", "Casi nunca", "A veces", "La mayoría de las veces", "Siempre"],
    },
    {
      type: "concept",
      factor: "Cuarto factor",
      title: "AUTORIDAD",
      icon: "🏛️",
      description: [
        "La autoridad en el branding se refiere al nivel de confianza y respeto que una marca ha ganado en su industria o entre su audiencia. Las marcas con autoridad no solo son reconocidas, sino que también son vistas como líderes de opinión y referentes en su campo.",
        "Esta autoridad puede ser el resultado de años de experiencia, innovación constante o la capacidad de ofrecer soluciones fiables y de alta calidad.",
        "Una marca con autoridad no necesita esforzarse demasiado para ser escuchada; su reputación habla por sí misma.",
      ],
    },
    {
      type: "question",
      title: "Autoridad",
      questionNumber: 4,
      totalQuestions: 10,
      question: "¿Hemos recibido premios o certificaciones por nuestra calidad?",
      options: ["Nunca", "Casi nunca", "A veces", "La mayoría de las veces", "Siempre"],
    },
    {
      type: "concept",
      factor: "Quinto factor",
      title: "AUTENTICIDAD",
      icon: "⭐",
      description: [
        "La autenticidad es el pegamento que une la identidad de una marca con las expectativas de los consumidores. En un mundo donde la transparencia es cada vez más valorada, las marcas auténticas en su propósito, valores y acciones ganan la confianza y admiración de su público.",
        "La autenticidad no se puede fabricar; debe ser intrínseca y evidente en cada aspecto de la marca.",
        "Ser auténtico significa ser coherente en lo que se dice y se hace, y ser fiel a la identidad de la marca, incluso cuando las tendencias del mercado sugieren lo contrario.",
      ],
    },
    {
      type: "question",
      title: "Autenticidad",
      questionNumber: 5,
      totalQuestions: 10,
      question: "¿Mantuvimos nuestros valores en tiempos de economía difíciles?",
      options: ["Nunca", "Casi nunca", "A veces", "La mayoría de las veces", "Siempre"],
    },
    {
      type: "concept",
      factor: "Sexto factor",
      title: "CONSISTENCIA Y COMPROMISO",
      icon: "✓",
      description: [
        "El compromiso y la consistencia son fundamentales para generar confianza en una marca. Cuando una marca se compromete con una promesa y la cumple de manera consistente a lo largo del tiempo, construye una reputación sólida y confiable.",
        "En un entorno donde muchas marcas fallan en cumplir lo que prometen, aquellas que lo logran se destacan y ganan la lealtad de los consumidores.",
        "La consistencia no sólo se refiere a mantener la calidad del producto o servicio, sino también a la coherencia en la comunicación, el diseño y la experiencia del cliente.",
      ],
    },
    {
      type: "question",
      title: "Consistencia y compromiso",
      questionNumber: 6,
      totalQuestions: 10,
      question: "¿Comunicamos en forma coherente a lo largo de todos nuestros puntos de contacto?",
      options: ["Nunca", "Casi nunca", "A veces", "La mayoría de las veces", "Siempre"],
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
                <span className={styles.icon}>{screens[currentStep - 1].icon}</span>
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

            <div className={styles.hexagonDiagram}>
              <QuizChart answers={1}/>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Questionnaire

