"use client"
import { useAuth } from '@/contexts/authContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AuthLoading } from './AuthLoading';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function PublicRoute({ children, redirectTo = '/' }: PublicRouteProps) {
  const { user, isLoading, isInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Só verificar após a inicialização da autenticação
    if (isInitialized && !isLoading && user) {
      router.push(redirectTo);
    }
  }, [user, isLoading, isInitialized, router, redirectTo]);

  // Mostrar loading enquanto verifica autenticação
  if (isLoading || !isInitialized) {
    return <AuthLoading message="Carregando..." />;
  }

  // Se está autenticado, não renderizar nada (será redirecionado)
  if (user) {
    return null;
  }

  // Se não está autenticado, renderizar o conteúdo
  return <>{children}</>;
} 