import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { QuizProvider } from '@/contexts/quiz'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Edital em Questão',
  description: 'Teste seus conhecimentos para concursos públicos com questões de diversas disciplinas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <QuizProvider>
        <body className={inter.className}>{children}</body>
      </QuizProvider>
    </html>
  )
}
