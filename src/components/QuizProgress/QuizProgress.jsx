import React from "react";
import styles from "./QuizProgress.module.css";

function QuizProgress({ progress, answeredCount, totalQuestions }) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.text}>Progreso</span>
        <span className={styles.text}>
          {answeredCount} de {totalQuestions} respondidas
        </span>
      </div>
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}

export default QuizProgress;