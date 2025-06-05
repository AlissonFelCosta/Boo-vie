
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Search, MessageCircle, Bot } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

// Update the type definition to include optional fields and is_bot
type UserProfile = {
  id: string;
  display_name: string | null;
  email: string | null;
  avatar_url: string | null;
  last_message?: string;
  last_message_time?: string;
  is_bot?: boolean; // Add is_bot property to the type
};

type Props = {
  onSelect: (user: UserProfile | null) => void;
  selectedId?: string;
  unreadCounts?: {[userId: string]: number};
};

export default function UserListChat({ onSelect, selectedId, unreadCounts = {} }: Props) {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!currentUser) return;

    const fetchUsers = async () => {
      setLoading(true);
      // Busca todos usuarios exceto o atual
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", currentUser.id);

      if (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
        return;
      }

      // Fetch last message for each user
      const usersWithLastMessages = await Promise.all(
        profiles.map(async (profile) => {
          const { data: messages } = await supabase
            .from("private_messages")
            .select("*")
            .or(
              `and(sender_id.eq.${currentUser.id},receiver_id.eq.${profile.id}),and(sender_id.eq.${profile.id},receiver_id.eq.${currentUser.id})`
            )
            .order("created_at", { ascending: false })
            .limit(1);

          const lastMessage = messages && messages.length > 0 ? messages[0] : null;
          
          return {
            ...profile,
            last_message: lastMessage?.content || "",
            last_message_time: lastMessage?.created_at || "",
          };
        })
      );

      // Add bot to the list with empty defaults for last_message properties
      const botUser: UserProfile = {
        id: "bot-assistant",
        display_name: "Assistente de Livros e Filmes",
        email: null,
        avatar_url: "https://api.dicebear.com/9.x/bottts/svg?seed=Boovie",
        is_bot: true,
        last_message: "",  // Add default empty values for bot
        last_message_time: "",
      };
      
      const allUsers = [botUser, ...usersWithLastMessages];

      // Sort users with messages first, then by last message time
      const sortedUsers = allUsers.sort((a, b) => {
        if (a.last_message && !b.last_message) return -1;
        if (!a.last_message && b.last_message) return 1;
        if (a.last_message && b.last_message) {
          return new Date(b.last_message_time || "").getTime() - 
                 new Date(a.last_message_time || "").getTime();
        }
        return 0;
      });

      setUsers(sortedUsers);
      setLoading(false);
    };

    fetchUsers();
  }, [currentUser]);

  // Filter users by search term
  const filteredUsers = users.filter(
    (user) =>
      (user.display_name &&
        user.display_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="w-full h-full bg-white border-r border-gray-200 flex flex-col overflow-hidden">
      <div className="p-4 border-b bg-white">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Pesquisar usuários..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-recomendify-purple"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-gray-500 p-4 text-center">
            Nenhum usuário encontrado
          </div>
        ) : (
          <div className="divide-y">
            {filteredUsers.map((user) => {
              const isSelected = user.id === selectedId;
              const unreadCount = unreadCounts[user.id] || 0;
              
              return (
                <div
                  key={user.id}
                  className={`p-4 flex items-center gap-3 cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-recomendify-purple/10"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => onSelect(user)}
                >
                  <div className="relative">
                    <img
                      src={user.avatar_url || ""}
                      alt={user.display_name || ""}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {unreadCount > 0 && (
                      <Badge
                        className="absolute -top-1 -right-1 px-1.5 py-0 min-w-[20px] h-5 flex items-center justify-center bg-recomendify-purple text-[11px]"
                      >
                        {unreadCount}
                      </Badge>
                    )}
                    {user.is_bot && (
                      <span className="absolute bottom-0 right-0 bg-yellow-400 p-0.5 rounded-full">
                        <Bot size={12} className="text-white" />
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 flex items-center justify-between">
                      <span className="truncate">
                        {user.display_name || user.email}
                      </span>
                      {user.last_message_time && (
                        <span className="text-xs text-gray-500 ml-2 hidden md:block">
                          {new Date(user.last_message_time).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 truncate flex items-center">
                      {user.last_message ? (
                        <>
                          <MessageCircle className="w-3 h-3 mr-1 inline-block" />
                          {user.last_message.length > 20
                            ? user.last_message.substring(0, 20) + "..."
                            : user.last_message}
                        </>
                      ) : user.is_bot ? (
                        "Assistente AI"
                      ) : (
                        "Nenhuma mensagem ainda"
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
