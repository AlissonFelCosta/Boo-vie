
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { AlertCircle, Info, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    if (!email || !password || !confirmPassword) {
      setError("Por favor, preencha todos os campos");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }
    
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }
    
    setIsLoading(true);
    try {
      await register(email, password);
      setSuccess("Conta criada com sucesso! Enviamos um email de confirmação para o seu endereço de email. Por favor, verifique sua caixa de entrada e siga as instruções para ativar sua conta.");
      
      // Limpar os campos após o registro bem-sucedido
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      
      toast.success("Cadastro realizado com sucesso!");
      toast.info("Verifique seu email para confirmar sua conta", {
        duration: 6000,
      });
    } catch (error: any) {
      console.error("Register error:", error);
      if (error.code === "auth/email-already-in-use") {
        setError("Este email já está em uso");
      } else if (error.code === "auth/invalid-email") {
        setError("Email inválido");
      } else if (error.code === "auth/weak-password") {
        setError("Senha muito fraca");
      } else if (error.code === "auth/network-request-failed") {
        setError("Erro de conexão. Verifique sua internet.");
      } else {
        setError("Erro ao criar conta. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive" className="bg-red-900/40 border-red-800 text-boovie-cream">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="bg-green-900/40 border-green-800 text-boovie-cream">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      
      <div>
        <label htmlFor="register-email" className="block text-sm font-medium text-boovie-cream">
          Email
        </label>
        <input
          id="register-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border border-boovie-teal/50 bg-black/30 px-3 py-2 text-sm text-boovie-cream focus:border-boovie-teal focus:outline-none"
          placeholder="seu@email.com"
          required
        />
      </div>
      
      <div>
        <label htmlFor="register-password" className="block text-sm font-medium text-boovie-cream">
          Senha
        </label>
        <input
          id="register-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border border-boovie-teal/50 bg-black/30 px-3 py-2 text-sm text-boovie-cream focus:border-boovie-teal focus:outline-none"
          placeholder="••••••••"
          required
        />
        <p className="mt-1 text-xs text-boovie-cream/70">Mínimo de 6 caracteres</p>
      </div>
      
      <div>
        <label htmlFor="confirm-password" className="block text-sm font-medium text-boovie-cream">
          Confirmar Senha
        </label>
        <input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border border-boovie-teal/50 bg-black/30 px-3 py-2 text-sm text-boovie-cream focus:border-boovie-teal focus:outline-none"
          placeholder="••••••••"
          required
        />
      </div>
      
      <div className="bg-boovie-teal/20 p-3 rounded-md border border-boovie-teal/30">
        <div className="flex items-start">
          <Info className="h-4 w-4 text-boovie-cream mt-0.5 mr-2 flex-shrink-0" />
          <p className="text-xs text-boovie-cream/90">
            Após o cadastro, você receberá um email para confirmar sua conta. 
            Verifique sua caixa de entrada e siga as instruções para ativar seu acesso.
          </p>
        </div>
      </div>
      
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-md bg-boovie-orange px-4 py-2 text-boovie-cream font-medium hover:bg-boovie-orange/80 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Criando conta..." : "Criar conta"}
      </button>
    </form>
  );
}
