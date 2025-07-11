import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { AuthProvider } from '@/contexts/authContext'
import { QuizProvider } from '@/contexts/quizContext'
import { ThemeProvider } from '@/contexts/themeContext'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const themeColor = [
  { media: '(prefers-color-scheme: light)', color: '#772adc' },
  { media: '(prefers-color-scheme: dark)', color: '#a855f7' }
];

export const metadata: Metadata = {
  title: 'Edital em Questão',
  description: 'Sua plataforma de estudos para concursos públicos',
  keywords: 'concursos, estudos, questões, edital, aprovação',
  authors: [{ name: 'Edital em Questão' }]
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
