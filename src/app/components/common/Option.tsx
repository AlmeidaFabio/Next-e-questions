"use client";

import { useQuiz } from '@/contexts/quiz';
import React from 'react'
import styles from './Option.module.css'

interface OptionProps {
    option: string;
    answer: string;
    selectOption: (option: string) => void;
    letter: string;
}

function Option({option, answer, selectOption, letter}: OptionProps) {
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
      className={`${styles.option} ${getOptionClass()} ${quizCtx.state.answerSelected ? styles.disabled : ''}`}
      onClick={handleClick}
    >
      <span className={styles.optionLetter}>{letter}</span>
      <div className={styles.optionText}>
        <p>{option}</p>
      </div>
    </div>
  )
}

export default Option; 