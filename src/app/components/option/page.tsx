import { useQuiz } from '@/contexts/quiz';
import React from 'react'
import styles from './option.module.css'

type Props = {
    option: string;
    answer: string;
    selectOption: (option: string) => void;
}

function Option({option, answer, selectOption}: Props) {
    const quizCtx = useQuiz();

    const handleClick = () => {
      selectOption(option);
    }

  return (
    <div className={`${styles.option} ${quizCtx.state.answerSelected && option === answer ? `${styles.correct}` : ""} ${quizCtx.state.answerSelected && option !== answer ? `${styles.wrong}` : ""}`} onClick={handleClick}>
      {option}
    </div>
  )
}

export default Option
