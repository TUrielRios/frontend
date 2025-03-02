import { Download } from "lucide-react"
import RadarChart from "../RadarChart/RadarChart"
import styles from "./ResultsPhase.module.css"

const ResultsPhase = ({ phaseScores, onDownloadBook, onDownloadResults }) => {
  return (
    <div className={styles.resultsContainer}>
      <div className={styles.resultsContent}>
        <h1 className={styles.resultsTitle}>¡Listo!</h1>
        <div className={styles.resultsText}>
          <p>
            Ahora que conocés el perfil de influencia de tu marca, tus fortalezas y las áreas dónde podés seguir
            creciendo, te invitamos a descargar el libro donde vas a encontrar ejemplos y estrategias para potenciar los
            diferentes factores.
          </p>
          <p>
            En un mercado cada vez más competitivo y dinámico, comprender la influencia de tu marca es clave para
            mantener la posición en la mente de los consumidores. Si deseas un análisis más profundo y personalizado
            para tu empresa y sector, no dudes en contactarnos.
          </p>
          <div className={styles.downloadButtons}>
            <button className={styles.downloadBookBtn} onClick={onDownloadBook}>
              Descargar el libro <Download size={16} />
            </button>
            <button className={styles.downloadResultsBtn} onClick={onDownloadResults}>
              Descargar resultado <Download size={16} />
            </button>
          </div>
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
        />
      </div>
    </div>
  )
}

export default ResultsPhase

