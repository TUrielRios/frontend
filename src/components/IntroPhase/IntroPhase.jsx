import { ArrowRight } from "lucide-react"
import styles from "./IntroPhase.module.css"

const IntroPhase = ({ phaseInfo, onNext }) => {
  const PhaseIcon = phaseInfo.icon

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
            <PhaseIcon className={styles.icon} />
          </div>
          </div>

        </div>
        <div className={styles.textContent}>
        <div className={styles.description}>
            {phaseInfo.description.map((paragraph, index) => (
              <p key={index}>
                {paragraph}
                {index < phaseInfo.description.length - 1 && <br />}
              </p>
            ))}
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

