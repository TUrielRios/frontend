import React, { useState, useRef, useMemo } from "react";
import QuizProgress from "./QuizProgress";
import QuizQuestion from "./QuizQuestion";
import QuizResult from "./QuizResult";
import QuizChart from "./QuizChart";
import { questions } from "../data/questions";
import styles from "./MarketingQuiz.module.css"; // Import the CSS Module

function MarketingQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const chartRef = useRef(null);

  const handleNext = () => {
    if (currentAnswer !== null && currentAnswer >= 1 && currentAnswer <= 10) {
      setAnswers((prev) => ({
        ...prev,
        [questions[currentQuestion].category]: currentAnswer,
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
      setCurrentAnswer(answers[questions[currentQuestion - 1].category] || null);
    }
  };

  const progress = useMemo(() => {
    return (Object.keys(answers).length / questions.length) * 100;
  }, [answers]);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {!quizCompleted && (
          <QuizProgress
            progress={progress}
            answeredCount={Object.keys(answers).length}
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