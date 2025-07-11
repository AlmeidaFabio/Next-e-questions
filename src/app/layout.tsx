import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/authContext'
import { QuizProvider } from '@/contexts/quizContext'
import { ThemeProvider } from '@/contexts/themeContext'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Edital em Questão',
  description: 'Sua plataforma de estudos para concursos públicos',
  keywords: 'concursos, estudos, questões, edital, aprovação',
  authors: [{ name: 'Edital em Questão' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#772adc' },
    { media: '(prefers-color-scheme: dark)', color: '#a855f7' }
  ]
}

export default function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='pt-BR' suppressHydrationWarning>
      <head>
        <meta name='color-scheme' content='light dark' />
        <link rel='icon' href='/favicon.ico' />
        <link rel='apple-touch-icon' href='/apple-touch-icon.png' />
        <link rel='manifest' href='/manifest.json' />
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable}`}
      >
        <ThemeProvider>
          <AuthProvider>
            <QuizProvider>{children}</QuizProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
