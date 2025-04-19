"use client"
import React from 'react'
import Image from 'next/image'
import Quiz from '../../assets/imgs/quiz.png'
import styles from './welcome.module.css'
import { useQuiz } from '@/contexts/quiz'

const Welcome = () => {
  const quizCtx = useQuiz();

  return (
    <div className={styles.welcome}>
      <h2>Seja bem-vindo</h2>
      <p>Desafie seus conhecimentos nerds no Master Nerd, o quiz definitivo sobre cultura pop! Teste seu domínio sobre filmes, séries, games, animes e muito mais. Jogue sozinho ou desafie amigos para ver quem é o verdadeiro mestre da cultura geek!</p>
      <Image 
        src={Quiz}
        width={500}
        height={500}
        alt='Inicio do quiz'
        priority
      />
      <p>Clique no botão abaixo para começar:</p>
      <button onClick={() => quizCtx.dispatch({type: 'START_QUIZ'})}>Iniciar</button>
    </div>
  )
}

export default Welcome
