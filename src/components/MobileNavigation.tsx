
import { useNavigate, useLocation } from "react-router-dom";
import { Film, BookOpen, MessageCircle, User, ListFilter, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export default function MobileNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuth();
  
  const menuItems = [
    {
      name: "Home",
      icon: Home,
      path: "/",
      active: location.pathname === "/"
    },
    {
      name: "Filmes",
      icon: Film,
      path: "/movies",
      active: location.pathname === "/movies"
    },
    {
      name: "Livros",
      icon: BookOpen,
      path: "/books",
      active: location.pathname === "/books"
    },
    {
      name: "Feed",
      icon: ListFilter,
      path: "/feed",
      active: location.pathname === "/feed"
    },
    {
      name: "Chat",
      icon: MessageCircle,
      path: "/chat",
      active: location.pathname === "/chat"
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-boovie-dark border-t border-gray-700 md:hidden">
      <div className="flex items-center justify-around py-2">
        {menuItems.map((item) => (
          <button
            key={item.name}
            className={cn(
              "flex flex-col items-center justify-center p-2 min-w-0 flex-1 transition-colors",
              item.active 
                ? "text-boovie-orange" 
                : "text-gray-400 hover:text-boovie-cream"
            )}
            onClick={() => navigate(item.path)}
          >
            <item.icon className="w-5 h-5 mb-1" />
            <span className="text-xs">{item.name}</span>
          </button>
        ))}
        
        {/* Profile button */}
        <button
          className="flex flex-col items-center justify-center p-2 min-w-0 flex-1 text-gray-400 hover:text-boovie-cream transition-colors"
          onClick={() => navigate("/profile")}
        >
          {profile?.avatar ? (
            <img 
              src={profile.avatar} 
              alt="Avatar" 
              className="w-5 h-5 rounded-full mb-1"
            />
          ) : (
            <User className="w-5 h-5 mb-1" />
          )}
          <span className="text-xs">Perfil</span>
        </button>
      </div>
    </div>
  );
}
