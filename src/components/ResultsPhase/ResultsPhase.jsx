import RadarChart from "../RadarChart/RadarChart"
import styles from "./ResultsPhase.module.css"
import textos from "../../constants/constants"

const ResultsPhase = ({ phaseScores }) => {
  // Crear un array con todas las fases para marcarlas como completadas en la pantalla de resultados
    // Función para convertir <br/> en <br/><br/>
    const formatDescription = (text) => {
      return text.replace(/<br\/>/g, "<br/><br/>");
    };
  
    // Función para convertir el texto con <br/> en HTML
    const createMarkup = (text) => {
      return { __html: text };
    };
  const allPhases = [
    "ATRACTIVO",
    "VALIDACIÓN SOCIAL",
    "RECIPROCIDAD",
    "AUTORIDAD",
    "AUTENTICIDAD",
    "CONSISTENCIA Y COMPROMISO",
  ]

  return (
    <div className={styles.resultsContainer}>
      <div className={styles.resultsContent}>
      <h1 className={styles.resultsTitle}>¡Gracias por participar!</h1>
        <div className={styles.resultsText}>
        <p dangerouslySetInnerHTML={createMarkup(formatDescription(textos.texto_final))} />
        </div>
      </div>
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
    </div>
  )
}

export default ResultsPhase

