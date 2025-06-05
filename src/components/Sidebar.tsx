
import { useNavigate, useLocation } from "react-router-dom";
import { Film, BookOpen, MessageCircle, User, ListFilter, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {
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
    <div className="fixed left-0 top-0 h-full bg-boovie-dark shadow-md w-[70px] md:w-[200px] flex flex-col hidden md:flex">
      {/* Logo at the top */}
      <div className="flex items-center justify-center py-3">
        <img 
          src="/lovable-uploads/1d582c34-d581-4047-9f87-6832eddf8628.png" 
          alt="Boovie Logo" 
          className="w-12 h-12 md:w-16 md:h-16 object-contain cursor-pointer"
          onClick={() => navigate("/")}
        />
      </div>
      
      {/* Profile section */}
      <div 
        className="flex items-center justify-center py-3 cursor-pointer"
        onClick={() => navigate("/profile")}
      >
        {profile?.avatar ? (
          <img 
            src={profile.avatar} 
            alt="Avatar" 
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <User className="w-10 h-10 p-1 bg-boovie-cream-light rounded-full text-boovie-teal" />
        )}
      </div>
      
      {/* Menu items */}
      <div className="flex flex-col mt-8 gap-4">
        {menuItems.map((item) => (
          <div 
            key={item.name}
            className={cn(
              "flex flex-col md:flex-row items-center justify-center md:justify-start p-3 cursor-pointer transition-colors",
              item.active 
                ? "text-boovie-cream font-medium" 
                : "text-gray-400 hover:text-boovie-orange"
            )}
            onClick={() => navigate(item.path)}
          >
            <item.icon className={cn(
              "w-6 h-6",
              item.active && "text-boovie-orange"
            )} />
            <span className="text-xs md:text-sm md:ml-3 mt-1 md:mt-0">{item.name}</span>
          </div>
        ))}
      </div>

      {/* Footer links */}
      <div className="mt-auto p-4 space-y-2">
        <div className="text-xs text-gray-400 space-y-1">
          <div 
            className="hover:text-boovie-orange cursor-pointer" 
            onClick={() => navigate("/about")}
          >
            Sobre
          </div>
          <div 
            className="hover:text-boovie-orange cursor-pointer" 
            onClick={() => navigate("/contact")}
          >
            Contato
          </div>
          <div 
            className="hover:text-boovie-orange cursor-pointer" 
            onClick={() => navigate("/privacy")}
          >
            Privacidade
          </div>
          <div 
            className="hover:text-boovie-orange cursor-pointer" 
            onClick={() => navigate("/terms")}
          >
            Termos
          </div>
        </div>
      </div>
    </div>
  );
};
