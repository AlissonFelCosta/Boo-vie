import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Send, AlertCircle, MessageCircle, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

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
}

export default function ChatConversation({ otherUser, onMessagesRead }: ChatProps) {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Carregar mensagens iniciais
  useEffect(() => {
    let isMounted = true;

    async function fetchMessages() {
      setLoading(true);
      setError(null);

      // Se for bot, usar localStorage ou só memória
      if (otherUser.is_bot) {
        const botMsgs = JSON.parse(localStorage.getItem("chat_bot_history") || "[]");
        setMessages(botMsgs);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("private_messages")
        .select("*")
        .or(
          `and(sender_id.eq.${currentUser?.id},receiver_id.eq.${otherUser.id}),and(sender_id.eq.${otherUser.id},receiver_id.eq.${currentUser?.id})`
        )
        .order("created_at", { ascending: true });

      if (!isMounted) return;
      setLoading(false);

      if (error) {
        setError("Erro ao carregar mensagens.");
        setMessages([]);
      } else {
        setMessages(data || []);
        
        // Mark messages from other user as read
        const unreadMessages = data?.filter(msg => 
          msg.sender_id === otherUser.id && 
          msg.receiver_id === currentUser?.id && 
          !msg.read
        ) || [];
        
        if (unreadMessages.length > 0) {
          unreadMessages.forEach(async (msg) => {
            await supabase
              .from("private_messages")
              .update({ read: true })
              .eq("id", msg.id);
          });
          
          // Call the onMessagesRead prop if it exists
          if (onMessagesRead) {
            onMessagesRead();
          }
        }
      }
    }

    fetchMessages();

    // Opcional: Realtime (exceto bot)
    if (!otherUser.is_bot) {
      const channel = supabase
        .channel("msg:" + [currentUser?.id, otherUser.id].sort().join("-"))
        .on("postgres_changes", { event: "*", schema: "public", table: "private_messages" }, (payload) => {
          const msg = payload.new as Message;
          console.log("Realtime update:", payload.eventType, msg);
          
          if (
            (msg.sender_id === currentUser?.id && msg.receiver_id === otherUser.id) ||
            (msg.sender_id === otherUser.id && msg.receiver_id === currentUser?.id)
          ) {
            setMessages((m) => {
              if (m.some((mm) => mm.id === msg.id)) return m;
              
              // If message is from other user, show notification
              if (msg.sender_id === otherUser.id) {
                setHasNewMessage(true);
                // Play notification sound
                const audio = new Audio('/message-notification.mp3');
                audio.volume = 0.5;
                audio.play().catch(e => console.log("Audio play error:", e));
                
                // Show toast notification
                toast({
                  title: `Nova mensagem de ${otherUser.display_name || otherUser.email}`,
                  description: msg.content.length > 30 ? msg.content.substring(0, 30) + "..." : msg.content,
                });
                
                // Mark as read if we're actively looking at this conversation
                if (document.visibilityState === "visible") {
                  supabase
                    .from("private_messages")
                    .update({ read: true })
                    .eq("id", msg.id)
                    .then(() => console.log("Marked message as read"));
                }
              }
              
              return [...m, msg].sort((a, b) => a.created_at.localeCompare(b.created_at));
            });
          }
        })
        .subscribe();

      return () => {
        isMounted = false;
        supabase.removeChannel(channel);
      };
    } else {
      return () => {
        isMounted = false;
      };
    }
    // eslint-disable-next-line
  }, [currentUser?.id, otherUser.id, otherUser.is_bot]);

  useEffect(() => {
    if (hasNewMessage) {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
      setHasNewMessage(false);
    }
  }, [hasNewMessage, messages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMsg.trim()) return;
    setSending(true);
    setError(null);

    // Conversa com Bot
    if (otherUser.is_bot) {
      // Adiciona mensagem do usuário
      const myMsg: Message = {
        id: "LOCAL_" + Date.now(),
        sender_id: currentUser?.id || "anon",
        receiver_id: otherUser.id,
        content: newMsg,
        created_at: new Date().toISOString(),
        read: true,
      };
      const nextMsgs = [...messages, myMsg];
      setMessages(nextMsgs);
      localStorage.setItem("chat_bot_history", JSON.stringify(nextMsgs));
      setNewMsg("");

      // Obtém resposta do bot via edge function
      try {
        console.log("Chamando função Edge do bot...");
        const resp = await fetch("https://atxtojnnwookypaqapvx.supabase.co/functions/v1/openai-bot", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ prompt: newMsg }),
        }).catch(err => {
          console.error("Erro na conexão com a API:", err);
          throw new Error(`Erro de conexão: ${err.message || 'Não foi possível conectar ao servidor'}`);
        });
        
        if (!resp.ok) {
          console.error("Erro na resposta da API:", resp.status, resp.statusText);
          let errorMessage = `Erro do servidor: ${resp.status}`;
          
          try {
            const errorData = await resp.json();
            errorMessage = errorData.error || errorMessage;
          } catch (e) {
            // Se não conseguir ler como JSON, tenta ler como texto
            try {
              const errorText = await resp.text();
              errorMessage = errorText || errorMessage;
            } catch {
              // Se também não conseguir ler como texto, mantém a mensagem padrão
            }
          }
          
          throw new Error(errorMessage);
        }
        
        const data = await resp.json().catch(e => {
          console.error("Erro ao processar JSON da resposta:", e);
          throw new Error("Resposta inválida do servidor");
        });
        
        console.log("Resposta do bot:", data);
        
        if (!data.generatedText) {
          throw new Error("Resposta vazia do bot");
        }
        
        const botMsg: Message = {
          id: "BOT_" + Date.now(),
          sender_id: otherUser.id,
          receiver_id: currentUser?.id || "anon",
          content: data.generatedText,
          created_at: new Date().toISOString(),
          read: true,
          is_bot: true,
        };
        const updatedMsgs = [...nextMsgs, botMsg];
        setMessages(updatedMsgs);
        localStorage.setItem("chat_bot_history", JSON.stringify(updatedMsgs));
      } catch (e: any) {
        console.error("Erro ao processar resposta do bot:", e);
        setError(e.message || "Erro ao obter resposta do bot");
        toast({
          title: "Erro na comunicação",
          description: "Houve um problema ao se comunicar com o bot: " + (e.message || "Erro desconhecido"),
          variant: "destructive",
        });
      } finally {
        setSending(false);
      }
      return;
    }

    // Conversa normal com usuário real
    const { error } = await supabase.from("private_messages").insert({
      sender_id: currentUser?.id,
      receiver_id: otherUser.id,
      content: newMsg,
    });
    setSending(false);
    if (error) {
      setError("Erro ao enviar mensagem.");
      return;
    }
    setNewMsg("");
  };

  return (
    <div className="flex flex-col h-full">
      <header className="border-b bg-white flex items-center gap-4 px-4 py-3">
        <div className="relative">
          <img
            src={
              otherUser.is_bot
                ? "https://api.dicebear.com/7.x/adventurer/svg?seed=BotAssistant"
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
        className="border-t bg-white flex gap-2 p-4"
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
