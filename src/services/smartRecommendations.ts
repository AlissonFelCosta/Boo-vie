
import { supabase } from "@/lib/supabase";
import { fetchSimilarItems } from "./api";

export type SmartRecommendation = {
  id: string;
  title: string;
  type: 'movie' | 'book';
};

export const getSmartRecommendations = async (): Promise<SmartRecommendation[]> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    throw new Error("User not authenticated");
  }

  try {
    // Get user's highly rated items (4 or 5 stars)
    const { data: userRatings, error } = await supabase
      .from('ratings')
      .select('item_id, item_type, rating')
      .eq('user_id', session.user.id)
      .gte('rating', 4)
      .order('created_at', { ascending: false })
      .limit(10); // Get last 10 highly rated items

    if (error) {
      console.error("Error fetching user ratings:", error);
      throw error;
    }

    if (!userRatings || userRatings.length === 0) {
      return []; // No highly rated items found
    }

    console.log("Found highly rated items:", userRatings);

    // Get similar items for each highly rated item
    const allRecommendations: SmartRecommendation[] = [];
    
    for (const rating of userRatings) {
      if (rating.item_type === 'movie' || rating.item_type === 'book') {
        try {
          const similarItems = await fetchSimilarItems(rating.item_id, rating.item_type);
          allRecommendations.push(...similarItems);
        } catch (error) {
          console.error(`Error fetching similar items for ${rating.item_id}:`, error);
        }
      }
    }

    // Remove duplicates and limit to 15 recommendations
    const uniqueRecommendations = allRecommendations.filter((item, index, self) => 
      index === self.findIndex(t => t.id === item.id && t.type === item.type)
    ).slice(0, 15);

    console.log("Generated smart recommendations:", uniqueRecommendations);
    return uniqueRecommendations;
  } catch (error) {
    console.error("Error generating smart recommendations:", error);
    throw error;
  }
};
