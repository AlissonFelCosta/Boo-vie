
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { toast } from "sonner";

type UserProfile = {
  uid: string;
  email: string | null;
  displayName: string | null;
  avatar?: string;
};

type AuthContextType = {
  currentUser: User | null;
  profile: UserProfile | null;
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>; 
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Primeiro configure o listener para mudanças de estado
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      
      if (!mounted) return;
      
      if (session?.user) {
        setCurrentUser(session.user);
        // Use setTimeout para evitar problemas de deadlock com callbacks do Supabase
        setTimeout(async () => {
          if (mounted) {
            const profileData = await fetchUserProfile(session.user.id);
            setProfile(profileData);
            setLoading(false);
          }
        }, 0);
      } else {
        setCurrentUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    // Depois verifique a sessão existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      if (session?.user) {
        setCurrentUser(session.user);
        fetchUserProfile(session.user.id).then(profileData => {
          if (mounted) {
            setProfile(profileData);
            setLoading(false);
          }
        });
      } else {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string): Promise<UserProfile> => {
    try {
      // Using type assertion to bypass TypeScript errors with table names
      const { data, error } = await (supabase
        .from('profiles') as any)
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (data) {
        return {
          uid: data.id,
          email: data.email,
          displayName: data.display_name || data.email?.split('@')[0] || "User",
          avatar: data.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${userId}`
        };
      }
      
      throw new Error("No profile data found");
    } catch (error) {
      console.error("Error fetching user profile:", error);
      // Return a default profile if fetching fails
      return {
        uid: userId,
        email: currentUser?.email,
        displayName: currentUser?.email?.split('@')[0] || "User",
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${userId}`
      };
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/email-confirmation`
        }
      });

      if (error) {
        console.error("Register error:", error);
        toast.error(error.message || "Erro ao criar conta. Tente novamente.");
        throw error;
      }

      if (data.user) {
        // Create profile for new user
        try {
          await (supabase
            .from('profiles') as any)
            .upsert({
              id: data.user.id,
              email: data.user.email,
              display_name: data.user.email?.split('@')[0] || "User",
              avatar_url: `https://api.dicebear.com/7.x/adventurer/svg?seed=${data.user.id}`
            });
        } catch (profileError) {
          console.error("Error creating profile:", profileError);
        }
        
        // Feedback já será exibido no componente RegisterForm
      }
    } catch (error: any) {
      console.error("Register error:", error);
      toast.error(error.message || "Erro ao criar conta. Tente novamente.");
      throw error;
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error("Login error:", error);
        toast.error(error.message || "Email ou senha incorretos");
        throw error;
      }
      
      console.log("Login successful:", data.user);
      toast.success("Login realizado com sucesso!");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Erro ao fazer login. Tente novamente.");
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error);
        toast.error(error.message || "Erro ao fazer logout");
        throw error;
      }
      toast.success("Logout realizado com sucesso!");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error(error.message || "Erro ao fazer logout");
      throw error;
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!currentUser) return;

    try {
      // Using type assertion to bypass TypeScript errors with table names
      const { error } = await (supabase
        .from('profiles') as any)
        .upsert({
          id: currentUser.id,
          display_name: data.displayName,
          avatar_url: data.avatar
        });

      if (error) {
        console.error("Update profile error:", error);
        toast.error(error.message || "Erro ao atualizar perfil");
        throw error;
      }

      // Fetch updated profile
      const updatedProfile = await fetchUserProfile(currentUser.id);
      setProfile(updatedProfile);
      toast.success("Perfil atualizado com sucesso!");
    } catch (error: any) {
      console.error("Update profile error:", error);
      toast.error(error.message || "Erro ao atualizar perfil");
      throw error;
    }
  };

  const value: AuthContextType = {
    currentUser,
    profile,
    register,
    login,
    logout,
    updateUserProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
