
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Send, AlertCircle, MessageCircle, Bell, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { filterProfanity, containsProfanity } from "@/utils/profanityFilter";

type UserProfile = {
  id: string;
  display_name: string | null;
  email: string | null;
  avatar_url: string | null;
  is_bot?: boolean;
};

type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
  is_bot?: boolean;
};

interface ChatProps {
  otherUser: UserProfile;
  onMessagesRead?: () => void;
  onBack?: () => void;
}

export default function ChatConversation({ otherUser, onMessagesRead, onBack }: ChatProps) {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const channelRef = useRef<any>(null);

  // Load initial messages and setup real-time subscription
  useEffect(() => {
    let isMounted = true;

    async function fetchMessages() {
      if (!currentUser?.id) return;
      
      setLoading(true);
      setError(null);

      // If bot, use localStorage or just memory
      if (otherUser.is_bot) {
        const botMsgs = JSON.parse(localStorage.getItem("chat_bot_history") || "[]");
        if (isMounted) {
          setMessages(botMsgs);
          setLoading(false);
        }
        return;
      }

      try {
        const { data, error } = await supabase
          .from("private_messages")
          .select("*")
          .or(
            `and(sender_id.eq.${currentUser.id},receiver_id.eq.${otherUser.id}),and(sender_id.eq.${otherUser.id},receiver_id.eq.${currentUser.id})`
          )
          .order("created_at", { ascending: true });

        if (!isMounted) return;
        setLoading(false);

        if (error) {
          console.error("Error loading messages:", error);
          setError("Erro ao carregar mensagens.");
          setMessages([]);
        } else {
          setMessages(data || []);
          
          // Mark messages from other user as read
          const unreadMessages = data?.filter(msg => 
            msg.sender_id === otherUser.id && 
            msg.receiver_id === currentUser.id && 
            !msg.read
          ) || [];
          
          if (unreadMessages.length > 0) {
            // Use Promise.all with proper error handling
            try {
              const updatePromises = unreadMessages.map(msg => 
                supabase
                  .from("private_messages")
                  .update({ read: true })
                  .eq("id", msg.id)
              );
              
              await Promise.all(updatePromises);
              
              if (onMessagesRead) {
                onMessagesRead();
              }
            } catch (updateError) {
              console.error("Error marking messages as read:", updateError);
            }
          }
        }
      } catch (err) {
        console.error("Exception loading messages:", err);
        if (isMounted) {
          setError("Erro ao carregar mensagens.");
          setLoading(false);
        }
      }
    }

    fetchMessages();

    // Real-time subscription (except bot)
    if (!otherUser.is_bot && currentUser?.id) {
      console.log(`Setting up real-time subscription for conversation with ${otherUser.id}`);
      
      const channelName = `conversation:${currentUser.id}:${otherUser.id}`;
      
      const channel = supabase
        .channel(channelName)
        .on('postgres_changes', 
          {
            event: 'INSERT',
            schema: 'public',
            table: 'private_messages'
          }, 
          (payload) => {
            console.log('Real-time INSERT received:', payload);
            const newMessage = payload.new as Message;
            
            // Only process messages relevant to this conversation
            const isRelevantMessage = (
              (newMessage.sender_id === currentUser.id && newMessage.receiver_id === otherUser.id) ||
              (newMessage.sender_id === otherUser.id && newMessage.receiver_id === currentUser.id)
            );
            
            if (!isRelevantMessage) {
              console.log('Message not relevant to this conversation, ignoring');
              return;
            }
            
            setMessages(currentMessages => {
              // Check if message already exists
              if (currentMessages.some(msg => msg.id === newMessage.id)) {
                console.log('Message already exists, skipping');
                return currentMessages;
              }
              
              console.log('Adding new message to conversation');
              setHasNewMessage(true);
              
              // If it's from the other user, mark it as read automatically
              if (newMessage.sender_id === otherUser.id && newMessage.receiver_id === currentUser.id) {
                // Mark as read immediately with proper error handling
                supabase
                  .from("private_messages")
                  .update({ read: true })
                  .eq("id", newMessage.id)
                  .then((result) => {
                    if (result.error) {
                      console.error("Error marking message as read:", result.error);
                    } else if (onMessagesRead) {
                      onMessagesRead();
                    }
                  });
              }
              
              return [...currentMessages, newMessage];
            });
          }
        )
        .on('postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'private_messages'
          },
          (payload) => {
            console.log('Real-time UPDATE received:', payload);
            const updatedMessage = payload.new as Message;
            
            // Only process messages relevant to this conversation
            const isRelevantMessage = (
              (updatedMessage.sender_id === currentUser.id && updatedMessage.receiver_id === otherUser.id) ||
              (updatedMessage.sender_id === otherUser.id && updatedMessage.receiver_id === currentUser.id)
            );
            
            if (!isRelevantMessage) {
              return;
            }
            
            setMessages(currentMessages => 
              currentMessages.map(msg => 
                msg.id === updatedMessage.id ? updatedMessage : msg
              )
            );
          }
        )
        .subscribe((status) => {
          console.log(`Real-time subscription status for ${channelName}:`, status);
          if (status === 'SUBSCRIBED') {
            console.log('Successfully subscribed to real-time updates');
          } else if (status === 'CHANNEL_ERROR') {
            console.error('Real-time subscription error');
            setError('Erro na conexão em tempo real. Recarregue a página.');
          }
        });

      channelRef.current = channel;
    }

    return () => {
      isMounted = false;
      if (channelRef.current) {
        console.log('Cleaning up real-time subscription');
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [currentUser?.id, otherUser.id, otherUser.is_bot, onMessagesRead]);

  // Scroll to bottom when messages change or new message arrives
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
        setHasNewMessage(false);
      }, 100);
    }
  }, [messages, hasNewMessage]);

  const handleSend = async () => {
    if (!newMsg.trim() || !currentUser?.id || sending) return;
    
    setSending(true);
    setError(null);

    // Check if message contains profanity
    if (containsProfanity(newMsg)) {
      toast({
        title: "Aviso",
        description: "Sua mensagem contém palavras inadequadas que foram substituídas.",
        variant: "default",
      });
    }
    
    // Filter the message for profanity
    const filteredMessage = filterProfanity(newMsg);

    // Chat with Bot
    if (otherUser.is_bot) {
      // Add user message
      const myMsg: Message = {
        id: "LOCAL_" + Date.now(),
        sender_id: currentUser.id || "anon",
        receiver_id: otherUser.id,
        content: filteredMessage,
        created_at: new Date().toISOString(),
        read: true,
      };
      const nextMsgs = [...messages, myMsg];
      setMessages(nextMsgs);
      localStorage.setItem("chat_bot_history", JSON.stringify(nextMsgs));
      setNewMsg("");

      // Get bot response via edge function
      try {
        console.log("Calling bot Edge function...");
        const resp = await fetch("https://atxtojnnwookypaqapvx.supabase.co/functions/v1/openai-bot", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ prompt: filteredMessage }),
        });
        
        if (!resp.ok) {
          console.error("API response error:", resp.status, resp.statusText);
          let errorMessage = `Server error: ${resp.status}`;
          
          try {
            const errorData = await resp.json();
            errorMessage = errorData.error || errorMessage;
          } catch (e) {
            try {
              const errorText = await resp.text();
              errorMessage = errorText || errorMessage;
            } catch {
              // Keep default message
            }
          }
          
          throw new Error(errorMessage);
        }
        
        const data = await resp.json();
        console.log("Bot response:", data);
        
        if (!data.generatedText) {
          throw new Error("Empty bot response");
        }
        
        const botMsg: Message = {
          id: "BOT_" + Date.now(),
          sender_id: otherUser.id,
          receiver_id: currentUser.id || "anon",
          content: data.generatedText,
          created_at: new Date().toISOString(),
          read: true,
          is_bot: true,
        };
        const updatedMsgs = [...nextMsgs, botMsg];
        setMessages(updatedMsgs);
        localStorage.setItem("chat_bot_history", JSON.stringify(updatedMsgs));
      } catch (e: any) {
        console.error("Error processing bot response:", e);
        setError(e.message || "Error getting bot response");
        toast({
          title: "Erro de Comunicação",
          description: "Houve um problema na comunicação com o bot: " + (e.message || "Erro desconhecido"),
          variant: "destructive",
        });
      } finally {
        setSending(false);
      }
      return;
    }

    // Normal conversation with real user
    try {
      console.log("Sending message to database...");
      const { data, error: sendError } = await supabase
        .from("private_messages")
        .insert({
          sender_id: currentUser.id,
          receiver_id: otherUser.id,
          content: filteredMessage,
        })
        .select()
        .single();
      
      if (sendError) {
        console.error("Error sending message:", sendError);
        setError("Erro ao enviar mensagem.");
        toast({
          title: "Erro",
          description: "Não foi possível enviar a mensagem. Tente novamente.",
          variant: "destructive",
        });
      } else {
        console.log("Message sent successfully:", data);
        setNewMsg("");
        // Real-time subscription will handle adding the message to the UI
      }
    } catch (e) {
      console.error("Exception sending message:", e);
      setError("Erro ao enviar mensagem.");
      toast({
        title: "Erro",
        description: "Erro inesperado ao enviar mensagem.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="border-b bg-white flex items-center gap-4 px-4 py-3">
        {onBack && (
          <button
            onClick={onBack}
            className="md:hidden p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
        )}
        
        <div className="relative">
          <img
            src={
              otherUser.is_bot
                ? "https://api.dicebear.com/9.x/bottts/svg?seed=Boovie"
                : otherUser.avatar_url ?? ""
            }
            alt={otherUser.display_name ?? ""}
            className="w-10 h-10 rounded-full"
          />
          {!otherUser.is_bot && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          )}
        </div>
        <div>
          <div className="font-semibold text-recomendify-purple flex items-center gap-2">
            {otherUser.display_name ?? otherUser.email}
            {otherUser.is_bot && <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800">Bot</Badge>}
          </div>
          <div className="text-xs text-gray-400">
            {otherUser.is_bot ? "Assistente automatizado sobre livros e filmes" : "Conversa privada"}
          </div>
        </div>
      </header>
      
      <ScrollArea className="flex-1 px-4 py-3 bg-gray-50">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center text-gray-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-recomendify-purple mb-2"></div>
              <span>Carregando mensagens...</span>
            </div>
          </div>
        ) : error ? (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4 text-gray-500 p-6">
            <MessageCircle size={40} className="text-recomendify-purple opacity-50" />
            <div className="text-center">
              <p className="font-medium">Nenhuma mensagem ainda!</p>
              <p className="text-sm">Envie uma mensagem para iniciar a conversa.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 pb-2">
            {messages.map((msg) => {
              const isCurrentUser = msg.sender_id === currentUser?.id;
              return (
                <div 
                  key={msg.id} 
                  className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                  data-message-id={msg.id}
                >
                  <div
                    className={`px-4 py-2 rounded-xl text-sm max-w-xs md:max-w-md break-words shadow-sm transition-all ${
                      isCurrentUser
                        ? "bg-recomendify-purple text-white rounded-br-none"
                        : msg.is_bot
                        ? "bg-yellow-100 border text-yellow-800 rounded-bl-none"
                        : "bg-white border text-gray-700 rounded-bl-none"
                    } ${hasNewMessage && msg === messages[messages.length - 1] && !isCurrentUser ? "animate-fade-in" : ""}`}
                    title={new Date(msg.created_at).toLocaleString()}
                  >
                    {msg.content}
                    <div className={`text-xs mt-1 text-right ${isCurrentUser ? "text-recomendify-purple-light" : "text-gray-400"}`}>
                      {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      {isCurrentUser && (
                        <span className="ml-1">{msg.read ? "✓✓" : "✓"}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={chatBottomRef}></div>
          </div>
        )}
      </ScrollArea>

      <form
        className="border-t bg-white flex gap-2 p-4 mb-16 md:mb-0"
        onSubmit={e => {
          e.preventDefault();
          handleSend();
        }}
      >
        <Input
          value={newMsg}
          placeholder={otherUser.is_bot ? "Pergunte sobre livros ou filmes..." : "Digite sua mensagem..."}
          onChange={e => setNewMsg(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={sending}
          className="border-gray-200 focus-visible:ring-recomendify-purple"
        />
        <Button
          type="submit"
          disabled={sending || !newMsg.trim()}
          className="px-3 h-10 flex items-center bg-recomendify-purple hover:bg-recomendify-purple-dark"
        >
          <Send size={18} className="mr-1" /> {sending ? "Enviando..." : "Enviar"}
        </Button>
      </form>
    </div>
  );
}
