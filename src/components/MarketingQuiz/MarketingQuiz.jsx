import React, { useState, useRef, useMemo } from "react";
import QuizProgress from "../QuizProgress/QuizProgress";
import QuizQuestion from "../QuizQuestion/QuizQuestion";
import QuizResult from "../QuizResult/QuizResult";
import QuizChart from "../QuizChart/QuizChart";
import { questions } from "../../data/questions";
import styles from "./MarketingQuiz.module.css"; // Import the CSS Module

function MarketingQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const chartRef = useRef(null);

  // Calcular la fase actual
  const currentPhase = Math.floor(currentQuestion / 10) + 1;

  // Calcular el número de preguntas respondidas hasta la pregunta actual
  const answeredCount = useMemo(() => {
    let count = 0;
    for (let i = 0; i <= currentQuestion; i++) {
      const question = questions[i];
      const answerKey = `${question.category}-${question.phase}`;
      if (answers[answerKey] !== undefined) {
        count++;
      }
    }
    return count;
  }, [currentQuestion, answers]);

  const handleNext = () => {
    if (currentAnswer !== null && currentAnswer >= 1 && currentAnswer <= 10) {
      const question = questions[currentQuestion];
      const answerKey = `${question.category}-${question.phase}`;

      setAnswers((prev) => ({
        ...prev,
        [answerKey]: currentAnswer,
      }));

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setCurrentAnswer(null);
      } else {
        setQuizCompleted(true);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      const previousQuestion = questions[currentQuestion - 1];
      const answerKey = `${previousQuestion.category}-${previousQuestion.phase}`;
      setCurrentAnswer(answers[answerKey] || null);
    }
  };

  const progress = useMemo(() => {
    return (answeredCount / questions.length) * 100;
  }, [answeredCount]);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {!quizCompleted && (
          <QuizProgress
            progress={progress}
            answeredCount={answeredCount}
            totalQuestions={questions.length}
          />
        )}

        {!quizCompleted ? (
          <QuizQuestion
            question={questions[currentQuestion]}
            currentAnswer={currentAnswer}
            setCurrentAnswer={setCurrentAnswer}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
            isFirstQuestion={currentQuestion === 0}
            currentPhase={currentPhase} // Pasar la fase actual
          />
        ) : (
          <QuizResult chartRef={chartRef} answers={answers} />
        )}

        <QuizChart chartRef={chartRef} answers={answers} />
      </div>
    </div>
  );
}

export default MarketingQuiz;