"use client"

import { useState } from "react"
import { ArrowRight, ArrowLeft } from "lucide-react"
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
  onPrevious, // New prop for handling back navigation
}) => {
  const [showValidation, setShowValidation] = useState(false)

  const handleNextClick = () => {
    if (selectedOption) {
      setShowValidation(false)
      onNext()
    } else {
      setShowValidation(true)
    }
  }

  // Check if we're on the first question to disable back button
  const isFirstQuestion = currentStep === 0

  return (
    <div className={styles.questionBox}>
      <div className={styles.questionContent}>
        <div className={styles.questionHeader}>
          <img src={PhaseIcon || "/placeholder.svg"} alt="" className={styles.questionIcon} />
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
      <div className={styles.navigationContainer}>
        {/* Back button */}
        <button
          className={`${styles.prevButton} ${isFirstQuestion ? styles.disabledButton : ""}`}
          onClick={onPrevious}
          disabled={isFirstQuestion}
        >
          <ArrowLeft size={24} />
        </button>

        {/* Next button */}
        <button
          className={`${styles.nextButton} ${!selectedOption ? styles.disabledButton : ""}`}
          onClick={handleNextClick}
        >
          <ArrowRight size={24} />
        </button>

        {showValidation && !selectedOption && (
          <p className={styles.validationMessage}>Por favor selecciona una respuesta para continuar</p>
        )}
      </div>
      <ProgressBar current={currentStep + 1} total={totalSteps} />
    </div>
  )
}

export default QuestionPhase
