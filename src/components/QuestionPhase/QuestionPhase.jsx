import { ArrowRight } from "lucide-react"
import OptionsList from "../OptionsList/OptionsList"
import ProgressBar from "../ProgressBar/ProgressBar"
import styles from "./QuestionPhase.module.css"

const QuestionPhase = ({
  phase,
  phaseIcon: PhaseIcon,
  question,
  currentStep,
  totalSteps,
  selectedOption,
  onSelect,
  onNext,
}) => {
  return (
    <div className={styles.questionBox}>
      <div className={styles.questionContent}>
        <div className={styles.questionHeader}>
          <img src={PhaseIcon} alt="" className={styles.questionIcon} />
          <span className={styles.questionPhaseName}>{phase}</span>
        </div>
        <div className={styles.questionBody}>
          <h2 className={styles.questionTitle}>
            <span className={styles.questionNumber}>
              {currentStep + 1}/{totalSteps}
            </span>
            <span className={styles.questionText}>{question.text}</span>
          </h2>
          <OptionsList selectedOption={selectedOption} onSelect={onSelect} />
        </div>
      </div>
      <button className={styles.nextButton} onClick={onNext}>
        <ArrowRight size={24} />
      </button>
      <ProgressBar current={currentStep + 1} total={totalSteps} />
    </div>
  )
}

export default QuestionPhase

