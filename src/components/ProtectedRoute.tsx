"use client"
import { useAuth } from '@/contexts/authContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AuthLoading } from './AuthLoading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({ children, redirectTo = '/login' }: ProtectedRouteProps) {
  const { user, isLoading, isInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Só verificar após a inicialização da autenticação
    if (isInitialized && !isLoading && !user) {
      router.push(redirectTo);
    }
  }, [user, isLoading, isInitialized, router, redirectTo]);

  // Mostrar loading enquanto verifica autenticação
  if (isLoading || !isInitialized) {
    return <AuthLoading message="Verificando autenticação..." />;
  }

  // Se não está autenticado, não renderizar nada (será redirecionado)
  if (!user) {
    return null;
  }

  // Se está autenticado, renderizar o conteúdo
  return <>{children}</>;
} 