
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email || !password) {
      setError("Por favor, preencha todos os campos");
      return;
    }
    
    setIsLoading(true);
    try {
      await login(email, password);
      // O redirecionamento acontece no AuthContext quando o usuário é autenticado
    } catch (error: any) {
      console.error("Login form error:", error);
      if (error.message?.includes("Email not confirmed")) {
        setError("Por favor, verifique seu email para confirmar sua conta.");
      } else if (error.message?.includes("Invalid login credentials")) {
        setError("Email ou senha incorretos.");
      } else {
        setError("Erro ao entrar. Por favor, tente novamente.");
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
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-boovie-cream">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border border-boovie-teal/50 bg-black/30 px-3 py-2 text-sm text-boovie-cream focus:border-boovie-teal focus:outline-none"
          placeholder="seu@email.com"
          required
        />
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-boovie-cream">
          Senha
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border border-boovie-teal/50 bg-black/30 px-3 py-2 text-sm text-boovie-cream focus:border-boovie-teal focus:outline-none"
          placeholder="••••••••"
          required
        />
      </div>
      
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-md bg-boovie-teal px-4 py-2 text-boovie-cream font-medium hover:bg-boovie-teal/80 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
