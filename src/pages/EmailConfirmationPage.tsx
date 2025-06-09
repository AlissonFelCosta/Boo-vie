
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function EmailConfirmationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Verifica se há parâmetros de confirmação na URL
        const access_token = searchParams.get('access_token');
        const refresh_token = searchParams.get('refresh_token');
        const type = searchParams.get('type');

        if (type === 'signup' && access_token && refresh_token) {
          // Se há tokens, significa que a confirmação foi bem-sucedida
          const { data, error } = await supabase.auth.setSession({
            access_token,
            refresh_token
          });

          if (error) {
            console.error('Erro ao confirmar email:', error);
            setStatus('error');
            setMessage('Erro ao confirmar o email. O link pode ter expirado.');
          } else if (data.user) {
            setStatus('success');
            setMessage('Email confirmado com sucesso! Você já está logado.');
          }
        } else {
          // Verifica se o usuário já está logado
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user && user.email_confirmed_at) {
            setStatus('success');
            setMessage('Email já confirmado! Você está logado.');
          } else {
            setStatus('error');
            setMessage('Link de confirmação inválido ou expirado.');
          }
        }
      } catch (error) {
        console.error('Erro na confirmação:', error);
        setStatus('error');
        setMessage('Ocorreu um erro inesperado. Tente novamente.');
      }
    };

    handleEmailConfirmation();
  }, [searchParams]);

  const handleGoToHome = () => {
    navigate('/');
  };

  const handleGoToLogin = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-boovie-dark px-4">
      <Card className="max-w-md w-full bg-black/40 backdrop-blur-sm border border-boovie-teal/30">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {status === 'loading' && (
              <Loader2 className="h-12 w-12 text-boovie-orange animate-spin" />
            )}
            {status === 'success' && (
              <CheckCircle className="h-12 w-12 text-green-500" />
            )}
            {status === 'error' && (
              <XCircle className="h-12 w-12 text-red-500" />
            )}
          </div>
          
          <CardTitle className="text-2xl font-bold text-boovie-cream">
            {status === 'loading' && 'Confirmando email...'}
            {status === 'success' && 'Email Confirmado!'}
            {status === 'error' && 'Erro na Confirmação'}
          </CardTitle>
          
          <CardDescription className="text-boovie-cream/70 mt-2">
            {message}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {status === 'success' && (
            <div className="space-y-3">
              <Button 
                onClick={handleGoToHome}
                className="w-full bg-boovie-orange hover:bg-boovie-orange/90 text-white font-semibold"
              >
                Ir para o início
              </Button>
              <p className="text-center text-sm text-boovie-cream/60">
                Bem-vindo ao Boovie! Agora você pode explorar filmes e livros.
              </p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="space-y-3">
              <Button 
                onClick={handleGoToLogin}
                className="w-full bg-boovie-teal hover:bg-boovie-teal/90 text-white font-semibold"
              >
                Fazer login
              </Button>
              <p className="text-center text-sm text-boovie-cream/60">
                Você pode tentar fazer login normalmente ou solicitar um novo email de confirmação.
              </p>
            </div>
          )}
          
          {status === 'loading' && (
            <div className="text-center">
              <p className="text-sm text-boovie-cream/60">
                Aguarde enquanto validamos seu email...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
