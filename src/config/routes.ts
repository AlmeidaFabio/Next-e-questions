export const ROUTES = {
  // Rotas públicas (não requerem autenticação)
  PUBLIC: [
    '/',
    '/login',
    '/register',
    '/privacy-policy',
    '/terms-of-service',
  ] as const,
  
  // Rotas protegidas (requerem autenticação)
  PROTECTED: [
    '/start',
    '/question',
    '/end',
    '/user',
    '/stats',
    '/history',
    '/settings',
    '/offline-quizzes',
    '/offline-settings',
    '/quiz-details',
  ] as const,
} as const;

// Funções removidas por não serem utilizadas 