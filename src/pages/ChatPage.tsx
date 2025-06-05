
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import MobileNavigation from "@/components/MobileNavigation";
import UserListChat from "@/components/chat/UserListChat";
import ChatConversation from "@/components/chat/ChatConversation";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

type MessageCountItem = {
  sender_id: string;
  unread_count: number;
};

type UserProfile = {
  id: string;
  display_name: string | null;
  email: string | null;
  avatar_url: string | null;
  is_bot?: boolean;
};

export default function ChatPage() {
  const { currentUser } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Handle user selection
  const handleSelectUser = (user: UserProfile | null) => {
    setSelectedUser(user);
    setSelectedUserId(user?.id || null);
  };

  // Handle going back to user list on mobile
  const handleBackToUserList = () => {
    setSelectedUser(null);
    setSelectedUserId(null);
  };

  // Handle message read update
  const handleMessageRead = (senderId: string) => {
    setUnreadCounts(prev => ({
      ...prev,
      [senderId]: 0
    }));
  };

  useEffect(() => {
    // Initial fetch of unread counts
    const fetchUnreadCounts = async () => {
      try {
        if (!currentUser?.id) return;
        
        const { data, error } = await supabase.rpc(
          'count_unread_messages_by_sender', 
          { current_user_id: currentUser.id }
        );
        
        if (error) {
          console.error("Error fetching unread counts:", error);
          return;
        }
        
        const countsMap: Record<string, number> = {};
        (data as MessageCountItem[])?.forEach(item => {
          countsMap[item.sender_id] = item.unread_count;
        });
        
        setUnreadCounts(countsMap);
      } catch (error) {
        console.error("Error fetching unread counts:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchUnreadCounts();
      
      const channel = supabase
        .channel('chat-notifications')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'private_messages',
          filter: `receiver_id=eq.${currentUser.id}`
        }, (payload) => {
          const senderId = payload.new.sender_id;
          
          console.log('New message notification received:', payload.new);
          
          // Only update unread count if not currently viewing this conversation
          if (senderId !== selectedUserId) {
            setUnreadCounts(prev => ({
              ...prev,
              [senderId]: (prev[senderId] || 0) + 1
            }));
            
            // Play notification sound
            const audio = new Audio('/message-notification.mp3');
            audio.volume = 0.5;
            audio.play().catch(e => console.log('Error playing notification sound:', e));
            
            // Show toast notification
            if (payload.new.content) {
              toast({
                title: "Nova mensagem",
                description: payload.new.content.length > 30 
                  ? payload.new.content.substring(0, 30) + "..." 
                  : payload.new.content,
                duration: 5000,
              });
            }
          }
        })
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'private_messages',
          filter: `sender_id=eq.${currentUser.id}`
        }, (payload) => {
          // Handle read status updates for sent messages
          console.log('Message read status updated:', payload.new);
        })
        .subscribe((status) => {
          console.log('Chat notifications subscription status:', status);
        });
        
      return () => {
        console.log('Cleaning up chat notifications subscription');
        supabase.removeChannel(channel);
      };
    } else {
      setLoading(false);
    }
  }, [currentUser, selectedUserId, toast]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Você precisa estar logado para acessar o chat.</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <MobileNavigation />
      
      <div className="flex-1 flex h-full pl-0 md:pl-[200px]">
        <div className="flex w-full h-full">
          {/* Lista de usuários - largura reduzida em desktop, oculta no mobile quando conversa está aberta */}
          <div className={`${selectedUser ? 'hidden md:flex' : 'flex'} w-full md:w-[280px] md:min-w-[280px]`}>
            <UserListChat 
              selectedId={selectedUserId} 
              onSelect={handleSelectUser} 
              unreadCounts={unreadCounts}
            />
          </div>
          
          {/* Área da conversa - ocupa mais espaço */}
          {selectedUser ? (
            <div className="flex-1 flex flex-col">
              <ChatConversation 
                otherUser={selectedUser} 
                onMessagesRead={() => handleMessageRead(selectedUserId || '')}
                onBack={handleBackToUserList}
              />
            </div>
          ) : (
            <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50 p-6">
              <div className="text-center">
                <h3 className="text-xl font-medium text-gray-700 mb-2">Selecione um usuário</h3>
                <p className="text-gray-500">
                  Escolha um usuário para iniciar uma conversa
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
