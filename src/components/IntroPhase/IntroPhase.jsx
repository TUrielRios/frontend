import { ArrowRight } from "lucide-react"
import styles from "./IntroPhase.module.css"

const IntroPhase = ({ phaseInfo, onNext }) => {
  const phaseIcon = phaseInfo.icon

  // Función para convertir <br/> en <br/><br/>
  const formatDescription = (text) => {
    return text.replace(/<br\/>/g, "<br/><br/>");
  };
  // Función para convertir el texto con <br/> en HTML
  const createMarkup = (text) => {
    return { __html: text };
  };

  return (
    <div className={styles.introCard}>
      <div className={styles.content}>
        <div className={styles.iconSection}>
        <img src={phaseInfo.number || "/placeholder.svg"} alt="" className={styles.numberBg} />
          <div className={styles.titleContainer}>
            <div className={styles.titlePhaseWrapper}>
            <span className={styles.factor}>{phaseInfo.factor}</span>
            <h1 className={styles.title}>{phaseInfo.title}</h1>
            </div>
            <div className={styles.iconWrapper}>
              <img src={phaseIcon} alt="" className={styles.icon} />
          </div>
          </div>

        </div>
        <div className={styles.textContent}>
        <div className={styles.description}>
        <p dangerouslySetInnerHTML={createMarkup(formatDescription(phaseInfo.description))} />              
          </div>
          <button className={styles.nextButton} onClick={onNext}>
            <ArrowRight />
          </button>
        </div>
      </div>
    </div>
  )
}

export default IntroPhase

