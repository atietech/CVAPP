
'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);
  
  // Ne rend le contenu que si l'utilisateur est connecté
  if (user) {
    return <>{children}</>;
  }
  
  // Affiche null ou un loader pendant la redirection
  return null;
}
