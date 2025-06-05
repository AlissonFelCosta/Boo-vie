
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import MobileNavigation from "@/components/MobileNavigation";
import AvatarEditor from "@/components/AvatarEditor";
import SmartRecommendations from "@/components/SmartRecommendations";
import { ArrowLeft, LogOut } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logout realizado com sucesso");
      navigate("/auth");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Erro ao fazer logout");
    }
  };
  
  // Push content away from sidebar
  const contentClasses = "ml-[70px] md:ml-[200px] p-4 pb-20 md:pb-4";

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <MobileNavigation />
      
      <div className={contentClasses}>
        <div className="flex justify-between items-center mb-6">
          <button 
            className="flex items-center text-gray-600 hover:text-recomendify-purple"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={20} className="mr-1" />
            <span>Voltar</span>
          </button>
          
          <button 
            className="flex items-center text-gray-600 hover:text-red-500"
            onClick={handleLogout}
          >
            <LogOut size={20} className="mr-1" />
            <span>Sair</span>
          </button>
        </div>
        
        {/* Facebook-style profile header */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          {/* Cover photo area */}
          <div className="h-32 bg-gradient-to-r from-recomendify-purple to-purple-400 rounded-t-lg"></div>
          
          {/* Profile info */}
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 md:-mt-12">
              {/* Avatar */}
              <div className="relative mb-4 md:mb-0">
                <img 
                  src={profile?.avatar || '/placeholder.svg'} 
                  alt="Profile Avatar"
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                />
              </div>
              
              {/* User info and edit button */}
              <div className="md:ml-6 text-center md:text-left flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {profile?.displayName || "Usuário"}
                </h1>
                <p className="text-gray-600 mb-2">
                  {profile?.email || "Email não disponível"}
                </p>
                
                <AvatarEditor />
              </div>
            </div>
          </div>
        </div>
        
        {/* Recommendations section */}
        <div className="max-w-2xl">
          <SmartRecommendations />
        </div>
      </div>
    </div>
  );
}
