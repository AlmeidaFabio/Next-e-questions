import { useQuiz } from '@/contexts/quiz';
import React from 'react'
import styles from './Option.module.css'

interface OptionProps {
    option: string;
    answer: string;
    selectOption: (option: string) => void;
}

function Option({option, answer, selectOption}: OptionProps) {
    const quizCtx = useQuiz();

    const handleClick = () => {
      if (!quizCtx.state.answerSelected) {
        selectOption(option);
      }
    }

    const getOptionClass = () => {
      if (quizCtx.state.answerSelected) {
        if (option === answer) {
          return styles.correct;
        } else if (option === quizCtx.state.selectedAnswer) {
          return styles.incorrect;
        }
      }
      return '';
    }

  return (
    <div 
      className={`${styles.option} ${getOptionClass()}`}
      onClick={handleClick}
    >
      {option}
    </div>
  )
}

export default Option; 