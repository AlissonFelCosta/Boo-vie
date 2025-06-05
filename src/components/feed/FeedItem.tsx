
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, MessageSquare, Film, BookOpen, Gamepad } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { filterProfanity } from "@/utils/profanityFilter";
import ReactionsBar from "../ReactionsBar";

type FeedItemProps = {
  rating: {
    id: string;
    rating: number;
    review: string;
    createdAt: string;
    item_id: string;
    item_type: "movie" | "book" | "game";
    item_title?: string;
    user: {
      id: string;
      displayName: string;
      avatar: string;
    };
  };
};

export default function FeedItem({ rating }: FeedItemProps) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  // Filter the review for profanity
  const filteredReview = filterProfanity(rating.review);

  // Obter ícone baseado no tipo
  const ItemIcon = rating.item_type === "movie" ? Film 
                : rating.item_type === "book" ? BookOpen 
                : Gamepad;

  const formattedDate = formatDistanceToNow(new Date(rating.createdAt), { 
    addSuffix: true,
    locale: ptBR
  });

  const itemTypeLabel = 
    rating.item_type === "movie" ? "filme" : 
    rating.item_type === "book" ? "livro" : "jogo";

  const handleItemClick = () => {
    navigate(`/${rating.item_type}/${rating.item_id}`);
  };

  // Se o review for maior que 150 caracteres e não estiver expandido, truncar
  const shouldTruncate = filteredReview && filteredReview.length > 150 && !expanded;
  const displayReview = shouldTruncate 
    ? `${filteredReview.substring(0, 150)}...` 
    : filteredReview;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        {/* Header - User info */}
        <div className="flex items-center p-4 border-b">
          <img 
            src={rating.user.avatar || '/placeholder.svg'} 
            alt={rating.user.displayName}
            className="w-10 h-10 rounded-full mr-3 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
          <div className="flex-1">
            <div className="font-medium">{rating.user.displayName}</div>
            <div className="text-xs text-gray-500 flex items-center">
              {formattedDate} • 
              <span className="flex items-center ml-1">
                <ItemIcon size={14} className="mr-1" />
                <span className="capitalize">{itemTypeLabel}</span>
              </span>
            </div>
          </div>
          
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={16}
                className={star <= rating.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
              />
            ))}
          </div>
        </div>
        
        {/* Item Title */}
        {rating.item_title && (
          <div className="px-4 pt-3 pb-1">
            <h4 className="text-sm font-medium flex items-center">
              <ItemIcon size={16} className="mr-1.5 text-gray-500" />
              {rating.item_title}
            </h4>
          </div>
        )}
        
        {/* Content */}
        {filteredReview && (
          <div className="p-4 pt-2">
            <p className="text-sm text-gray-700">{displayReview}</p>
            
            {shouldTruncate && (
              <button
                onClick={() => setExpanded(true)}
                className="text-xs text-recomendify-purple font-medium mt-1"
              >
                Mostrar mais
              </button>
            )}
          </div>
        )}

        {/* Reactions */}
        <div className="px-4 pb-2">
          <ReactionsBar ratingId={rating.id} />
        </div>
        
        {/* Footer */}
        <CardFooter className="border-t p-0">
          <button
            onClick={handleItemClick}
            className="py-3 px-4 text-sm text-center w-full hover:bg-gray-50 text-recomendify-purple font-medium transition-colors"
          >
            Ver detalhes do {itemTypeLabel}
          </button>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
