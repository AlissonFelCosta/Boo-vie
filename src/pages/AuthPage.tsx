
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AuthPage() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("login");
  
  // Redirect if already logged in
  if (currentUser) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-boovie-dark px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-boovie-orange">Boovie</h1>
          <p className="text-boovie-cream mt-2">Descubra filmes, livros e jogos recomendados para você</p>
        </div>
        
        <div className="bg-black/40 backdrop-blur-sm border border-boovie-teal/30 p-6 rounded-lg shadow-lg">
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-6 bg-boovie-dark/80">
              <TabsTrigger 
                value="login" 
                className="data-[state=active]:bg-boovie-teal data-[state=active]:text-boovie-cream"
              >
                Entrar
              </TabsTrigger>
              <TabsTrigger 
                value="register"
                className="data-[state=active]:bg-boovie-teal data-[state=active]:text-boovie-cream"
              >
                Criar conta
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <LoginForm />
              <div className="mt-4 text-center text-sm text-boovie-cream/70">
                <span>Não tem uma conta? </span>
                <button 
                  className="text-boovie-orange hover:underline"
                  onClick={() => setActiveTab("register")}
                >
                  Criar conta
                </button>
              </div>
            </TabsContent>
            
            <TabsContent value="register">
              <RegisterForm />
              <div className="mt-4 text-center text-sm text-boovie-cream/70">
                <span>Já tem uma conta? </span>
                <button 
                  className="text-boovie-orange hover:underline"
                  onClick={() => setActiveTab("login")}
                >
                  Entrar
                </button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
