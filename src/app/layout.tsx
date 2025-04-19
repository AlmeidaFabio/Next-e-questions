import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { QuizProvider } from '@/contexts/quiz'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Master NERD',
  description: 'Desafie seus conhecimentos nerds no Master Nerd, o quiz definitivo sobre cultura pop! Teste seu domínio sobre filmes, séries, games, animes e muito mais. Jogue sozinho ou desafie amigos para ver quem é o verdadeiro mestre da cultura geek!',
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
