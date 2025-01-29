import React from "react";
import styles from "./QuizQuestion.module.css";

function QuizQuestion({
  question,
  currentAnswer,
  setCurrentAnswer,
  handleNext,
  handlePrevious,
  isFirstQuestion,
  currentPhase, // Nueva prop para indicar la fase actual
}) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Diagnóstico de Marketing Digital</h2>
        <p className={styles.subtitle}>Evaluamos tu estrategia actual para potenciar tu marca</p>
      </div>
      <div className={styles.header}>
        {/* Mostrar la fase actual */}
        <p className={styles.phaseIndicator}>Fase {currentPhase}</p>
        <p className={styles.question}>{question.text}</p>
        <div className={styles.inputContainer}>
          <label className={styles.label}>Califica del 1 al 10*</label>
          <input
            type="number"
            min="1"
            max="10"
            value={currentAnswer === null ? "" : currentAnswer}
            onChange={(e) =>
              setCurrentAnswer(
                e.target.value === "" ? null : Math.min(Math.max(Number.parseInt(e.target.value, 10), 1), 10)
              )
            }
            placeholder="Ingrese un número del 1 al 10"
            className={styles.input}
          />
        </div>
        <div className={styles.buttonContainer}>
          {!isFirstQuestion && (
            <button onClick={handlePrevious} className={styles.button}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              Anterior
            </button>
          )}
          <button onClick={handleNext} disabled={currentAnswer === null} className={styles.button}>
            Siguiente
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuizQuestion;