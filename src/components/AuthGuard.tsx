import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { Navigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const AuthGuard = ({ children, fallback }: AuthGuardProps) => {
  const { user, loading } = useSupabaseAuth();

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Card className="p-8 text-center shadow-elegant">
        <div className="w-16 h-16 bg-gradient-islamic rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-primary mb-2">Authentication Required</h3>
        <p className="text-muted-foreground mb-6">
          Please sign in to access this feature and save your progress.
        </p>
        <Button 
          onClick={() => window.location.href = '/auth'}
          className="btn-hero"
        >
          Sign In to Continue
        </Button>
      </Card>
    );
  }

  return <>{children}</>;
};