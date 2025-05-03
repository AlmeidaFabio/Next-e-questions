import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { QuizProvider } from '@/contexts/quiz'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'E-Questão',
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
