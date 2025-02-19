import { useState, useEffect } from "react"
import styles from "./Questionnaire.module.css"
import { ThumbsUp, ArrowRight, User } from "lucide-react"
import { FaThumbsUp, FaStar } from "react-icons/fa" // Importa los iconos que necesites
import { PiSunFill } from "react-icons/pi";
import { RxUpdate } from "react-icons/rx";
import { GiConfirmed } from "react-icons/gi";
import { AiFillBank } from "react-icons/ai";
import RadarChart from "../../components/RadarChart/RadarChart"
import logo from '../../assets/logo.png'


const phaseInfo = {
  "VALIDACIÓN SOCIAL": {
    factor:"Primer Factor",
    icon: FaThumbsUp,
    description:
"Principio fundamental en la psicología del consumidor, basado en el deseo innato de pertenecer y ser aceptado. En branding, se activa cuando los consumidores ven que otros, especialmente aquellos que respetan o admiran, utilizan un producto o servicio. Este comportamiento genera una atracción natural hacia la marca, motivada por el deseo de ser parte de un grupo o tendencia. La validación social actua como un atajo mental: si muchas personas ya han optado por una marca, es probable que sea una opción segura y confiable."  },
  ATRACTIVO: {
    factor:"Segundo Factor",
    icon: PiSunFill,
    description:
"El atractivo en el branding se refiere a la capacidad de una marca para captar y mantener la atención de su público objetivo. Más allá de la estética, abarca cómo una marca satisface las motivaciones fundamentales de su audiencia, desde necesidades funcionales hasta deseos emocionales. Es la mezcla de forma y sustancia que hace que una marca no solo sea visible, sino también memorable. El atractivo no es un atributo superficial; es un componente esencial que determina si los consumidores elegirán interactuar con una marca en un mercado saturado de opciones."  },
  AUTENTICIDAD: {
    factor:"Quinto Factor",
    icon: FaStar,
    description:
"La autenticidad es el pegamento que une la identidad de una marca con las expectativas de los consumidores. En un mundo donde la transparencia es cada vez más valorada, las marcas auténticas en su propósito, valores y acciones ganan la confianza y admiración de su público. La autenticidad no se puede fabricar; debe ser intrínseca y evidente en cada aspecto de la marca. Ser auténtico significa ser coherente en lo que se dice y se hace, y ser fiel a la identidad de la marca, incluso cuando las tendencias del mercado sugieren lo contrario."  },
  "CONSISTENCIA Y COMPROMISO": {
    factor:"Sexto Factor",
    icon: GiConfirmed,
    description:
"El compromiso y la consistencia son fundamentales para generar confianza en una marca. Cuando una marca se compromete con una promesa y la cumple de manera consistente a lo largo del tiempo, construye una reputación sólida y confiable. En un entorno donde muchas marcas fallan en cumplir lo que prometen, aquellas que lo logran se destacan y ganan la lealtad de los consumidores. La consistencia no sólo se refiere a mantener la calidad del producto o servicio, sino también a la coherencia en la comunicación, el diseño y la experiencia del cliente."  },
  AUTORIDAD: {
    factor:"Cuarto Factor",
    icon: AiFillBank,
    description:
"La autoridad en el branding se refiere al nivel de confianza y respeto que una marca ha ganado en su industria o entre su audiencia. Las marcas con autoridad no solo son reconocidas, sino que también son vistas como líderes de opinión y referentes en su campo. Esta autoridad puede ser el resultado de años de experiencia, innovacion constante o la capacidad de ofrecer soluciones fiables y de alta calidad. Una marca con autoridad no necesita esforzarse demasiado para ser escuchada; su reputación habla por sí misma."  },
  RECIPROCIDAD: {
    factor:"Tercer Factor",
    icon: RxUpdate,
    description:
"La reciprocidad es un principio psicológico que postula que las personas tienden a devolver los favores o compensar las acciones recibidas. En el branding, esto significa que cuando una marca ofrece valor antes de pedir algo a cambio, como contenido útil, productos gratuitos o experiencias exclusivas, los consumidores se sienten inclinados a corresponder con lealtad o compras. Este principio es la base de estrategias como el modelo freemium, donde las marcas primero ofrecen algo valioso sin costo, con la expectativa de que los usuarios eventualmente se conviertan en clientes de pago."  },
}

const Questionnaire = () => {
  const [questions, setQuestions] = useState({})
  const [phases, setPhases] = useState([])
  const [currentPhase, setCurrentPhase] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showIntro, setShowIntro] = useState(true)
  const [phaseScores, setPhaseScores] = useState({})
  const [selectedOption, setSelectedOption] = useState(null)

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

        const groupedQuestions = data.reduce((acc, question) => {
          if (!acc[question.phase]) {
            acc[question.phase] = []
          }
          acc[question.phase].push(question)
          return acc
        }, {})

        const phaseOrder = Object.keys(groupedQuestions)
        setQuestions(groupedQuestions)
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
        console.log("Cuestionario completado")
      }
    }
  }

  if (loading) return <p className={styles.loading}>Cargando preguntas...</p>
  if (error) return <p className={styles.error}>Error: {error}</p>

  const phaseQuestions = questions[currentPhase] || []
  const currentQuestion = phaseQuestions[currentStep] || {}
  const currentPhaseInfo = phaseInfo[currentPhase] || {}
  const PhaseIcon = currentPhaseInfo.icon || ThumbsUp

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <img
          src={logo}
          alt="La Cocina"
          className={styles.logo}
        />
        <button className={styles.userButton}>
          <User size={24} />
        </button>
      </header>

      <main className={styles.container}>
        {showIntro ? (
          <div className={styles.introCard}>
            <div className={styles.introContent}>
              <span className={styles.factor}>{currentPhaseInfo.factor}</span>
              <h1 className={styles.title}>{currentPhase}</h1>
              <div className={styles.thumbIcon}>
                <PhaseIcon size={120} />
              </div>
            </div>
            <div className={styles.description}>
                <p>{currentPhaseInfo.description}</p>
              </div>
              <button className={styles.nextButton} onClick={handleNext}>
              <ArrowRight size={24} />
            </button>
          </div>
        ) : (
          <div className={styles.wholeContainer}>
          <div className={styles.questionBox}>
            <div className={styles.questionContent}>
              <div className={styles.questionHeader}>
                <PhaseIcon size={24} className={styles.questionIcon} />
                <span>{currentPhase}</span>
              </div>
              <div className={styles.questionBody}>
                <h2 className={styles.questionTitle}>
                  <span className={styles.questionNumber}>{currentStep + 1}/10</span>
                  <span className={styles.questionText}>{currentQuestion.text}</span>
                </h2>
                <div className={styles.options}>
                  {["Nunca", "Casi nunca", "A veces", "La mayoría de las veces", "Siempre"].map((option) => (
                    <label key={option} className={styles.optionLabel}>
                      <input
                        type="radio"
                        name="question"
                        value={option}
                        checked={selectedOption === option}
                        onChange={(e) => handleAnswer(e.target.value)}
                        className={styles.optionInput}
                      />
                      <span className={styles.optionText}>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <button className={styles.nextButton} onClick={handleNext}>
              <ArrowRight size={24} />
            </button>
            <div className={styles.progressBar}>
              <div
                className={styles.progress}
                style={{ width: `${((currentStep + 1) / phaseQuestions.length) * 100}%` }}
              />
            </div>
          </div>
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
        />
      </aside>
          </div>

        )}
      </main>

    </div>
  )
}

export default Questionnaire

