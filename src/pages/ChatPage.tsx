
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import UserListChat from "@/components/chat/UserListChat";
import ChatConversation from "@/components/chat/ChatConversation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

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

  // Handle user selection
  const handleSelectUser = (user: UserProfile | null) => {
    setSelectedUser(user);
    setSelectedUserId(user?.id || null);
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
        // Use a type assertion to fix the type issue with RPC
        const { data, error } = await supabase.rpc(
          'count_unread_messages_by_sender', 
          { current_user_id: currentUser?.id } as any
        );
        
        if (error) {
          console.error("Error fetching unread counts:", error);
          return;
        }
        
        // Process the results into a map of sender_id -> count
        const countsMap: Record<string, number> = {};
        (data as MessageCountItem[]).forEach(item => {
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
      
      // Subscribe to realtime updates for new messages
      const channel = supabase
        .channel('public:private_messages')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'private_messages',
          filter: `receiver_id=eq.${currentUser.id}`
        }, (payload) => {
          // Update unread count for this sender
          const senderId = payload.new.sender_id;
          setUnreadCounts(prev => ({
            ...prev,
            [senderId]: (prev[senderId] || 0) + 1
          }));
          
          // Play notification sound if the message is not from the currently selected user
          if (senderId !== selectedUserId) {
            const audio = new Audio('/message-notification.mp3');
            audio.play().catch(e => console.log('Error playing notification sound:', e));
          }
        })
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [currentUser, selectedUserId]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Você precisa estar logado para acessar o chat.</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      
      <div className="flex-1 pl-[70px] md:pl-[200px] overflow-hidden">
        <div className="h-full flex">
          <UserListChat 
            selectedId={selectedUserId} 
            onSelect={handleSelectUser} 
            unreadCounts={unreadCounts}
          />
          
          {selectedUser ? (
            <ChatConversation 
              otherUser={selectedUser} 
              onMessagesRead={() => handleMessageRead(selectedUserId || '')}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50 p-6">
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
