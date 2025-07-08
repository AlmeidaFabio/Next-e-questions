export const OFFLINE_CONFIG = {
  // Duração do cache em millisegundos (24 horas)
  CACHE_DURATION: 24 * 60 * 60 * 1000,
  
  // Intervalo para verificar conectividade (30 segundos)
  CONNECTIVITY_CHECK_INTERVAL: 30000,
  
  // Número máximo de quizzes offline para manter
  MAX_OFFLINE_QUIZZES: 20,
  
  // Tamanho máximo do cache em MB
  MAX_CACHE_SIZE: 50,
  
  // Configurações de sincronização
  SYNC: {
    // Tentativas de sincronização
    MAX_RETRIES: 3,
    // Intervalo entre tentativas (5 segundos)
    RETRY_INTERVAL: 5000,
    // Timeout para sincronização (30 segundos)
    TIMEOUT: 30000,
  },
  
  // Mensagens de erro
  MESSAGES: {
    NO_CACHE: 'Nenhum cache disponível offline',
    CACHE_EXPIRED: 'Cache expirado. Conecte-se à internet para atualizar.',
    SYNC_FAILED: 'Falha na sincronização. Tente novamente.',
    OFFLINE_MODE: 'Modo offline ativo. Usando questões em cache.',
    NO_INTERNET: 'Sem conexão com a internet.',
  },
  
  // Configurações de UI
  UI: {
    // Cores para diferentes estados
    COLORS: {
      ONLINE: '#4caf50',
      OFFLINE: '#f44336',
      CACHE_AVAILABLE: '#2196f3',
      CACHE_EXPIRED: '#ff9800',
    },
    
    // Ícones para diferentes estados
    ICONS: {
      ONLINE: 'wifi',
      OFFLINE: 'cloud-offline',
      CACHE_AVAILABLE: 'cloud-done',
      CACHE_EXPIRED: 'cloud-offline',
      SYNCING: 'sync',
    },
  },
}; 