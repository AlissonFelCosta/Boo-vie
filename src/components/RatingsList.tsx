
import { useEffect, useState } from "react";
import { getRatingsForItem } from "@/services/ratings";
import { Star } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { filterProfanity } from "@/utils/profanityFilter";
import ReactionsBar from "./ReactionsBar";

type RatingsListProps = {
  itemId: string;
  itemType: 'movie' | 'book' | 'game';
  refreshTrigger?: number;
  itemTitle?: string;
};

type Rating = {
  id: string;
  rating: number;
  review: string;
  createdAt: any;
  user: {
    id: string;
    displayName: string;
    avatar: string;
  };
};

export default function RatingsList({ 
  itemId, 
  itemType,
  refreshTrigger = 0,
  itemTitle
}: RatingsListProps) {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRatings = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log(`Fetching ratings for ${itemType} with ID: ${itemId}`);
        const data = await getRatingsForItem(itemId, itemType);
        console.log("Ratings data received:", data);
        
        // Apply profanity filter to reviews
        const filteredData = data.map(rating => ({
          ...rating,
          review: filterProfanity(rating.review)
        }));
        
        setRatings(filteredData);
      } catch (error: any) {
        console.error("Error fetching ratings:", error);
        if (error.message) {
          setError(`Erro ao carregar avaliações: ${error.message}`);
        } else {
          setError("Erro ao carregar avaliações");
        }
      } finally {
        setLoading(false);
      }
    };

    if (itemId) {
      fetchRatings();
    } else {
      console.error("No itemId provided to RatingsList");
      setError("ID do item não fornecido");
      setLoading(false);
    }
  }, [itemId, itemType, refreshTrigger]);

  if (loading) {
    return <div className="text-center py-4">Carregando avaliações...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (ratings.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        Nenhuma avaliação ainda. Seja o primeiro a avaliar!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-3">Avaliações</h3>
      
      {ratings.map((rating) => (
        <div key={rating.id} className="border-b pb-4 last:border-b-0">
          <div className="flex items-center">
            <img 
              src={rating.user.avatar || '/placeholder.svg'} 
              alt={rating.user.displayName}
              className="w-8 h-8 rounded-full mr-3"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
            <div>
              <div className="font-medium text-sm">{rating.user.displayName}</div>
              <div className="flex mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={star <= rating.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {rating.review && (
            <p className="mt-2 text-sm text-gray-700">{rating.review}</p>
          )}
          
          <div className="text-xs text-gray-500 mt-2">
            {rating.createdAt
              ? new Date(rating.createdAt).toLocaleDateString('pt-BR')
              : 'Recentemente'}
          </div>

          <ReactionsBar ratingId={rating.id} />
        </div>
      ))}
    </div>
  );
}
