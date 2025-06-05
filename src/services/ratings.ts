
import { supabase } from "@/lib/supabase";

export type Rating = {
  id?: string;
  item_id: string;
  item_type: 'movie' | 'book' | 'game';
  rating: number;
  review?: string;
  user_id: string;
  created_at?: string;
  user?: {
    id: string;
    display_name: string;
    avatar_url: string;
  };
};

export const addRating = async (
  itemId: string, 
  itemType: 'movie' | 'book' | 'game', 
  rating: number, 
  review?: string
) => {
  // Get current user from Supabase session
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    throw new Error("User not authenticated");
  }
  
  const userId = session.user.id;

  // Check if user already rated this item
  const { data: existingRatings } = await supabase
    .from('ratings')
    .select('*')
    .eq('item_id', itemId)
    .eq('user_id', userId);

  const ratingData = {
    item_id: itemId,
    item_type: itemType,
    rating,
    review: review || null,
    user_id: userId
  };

  if (existingRatings && existingRatings.length > 0) {
    // Update existing rating
    const { data, error } = await supabase
      .from('ratings')
      .update(ratingData)
      .eq('item_id', itemId)
      .eq('user_id', userId)
      .select();

    if (error) {
      console.error("Error updating rating:", error);
      throw error;
    }
    return data?.[0];
  } else {
    // Create new rating
    const { data, error } = await supabase
      .from('ratings')
      .insert(ratingData)
      .select();

    if (error) {
      console.error("Error inserting rating:", error);
      throw error;
    }
    return data?.[0];
  }
};

export const getRatingsForItem = async (
  itemId: string, 
  itemType: 'movie' | 'book' | 'game'
) => {
  console.log(`Fetching ratings for item: ${itemId}, type: ${itemType}`);
  
  try {
    // First, fetch all ratings for the item
    const { data: ratingsData, error: ratingsError } = await supabase
      .from('ratings')
      .select('*')
      .eq('item_id', itemId)
      .eq('item_type', itemType)
      .order('created_at', { ascending: false });

    if (ratingsError) {
      console.error("Supabase error fetching ratings:", ratingsError);
      throw ratingsError;
    }

    if (!ratingsData || ratingsData.length === 0) {
      console.log("No ratings data returned");
      return [];
    }

    console.log(`Found ${ratingsData.length} ratings`);
    
    // Get all user IDs from ratings to fetch their profiles
    const userIds = ratingsData.map(rating => rating.user_id);
    
    // Then fetch profiles for those users
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, display_name, avatar_url')
      .in('id', userIds);
      
    if (profilesError) {
      console.error("Supabase error fetching profiles:", profilesError);
      // Continue even if profiles fetch fails, we'll use placeholders
    }
    
    // Create a map of user_id to profile for easy lookup
    const profilesMap = new Map();
    if (profilesData && profilesData.length > 0) {
      profilesData.forEach(profile => {
        profilesMap.set(profile.id, profile);
      });
    }

    // Transform data to match expected format
    return ratingsData.map(rating => {
      // Get profile from map or use default values if not found
      const profile = profilesMap.get(rating.user_id);
      
      return {
        id: rating.id,
        rating: rating.rating,
        review: rating.review,
        createdAt: rating.created_at,
        user: {
          id: rating.user_id,
          displayName: profile ? profile.display_name : 'Usuário',
          avatar: profile ? profile.avatar_url : '/placeholder.svg'
        }
      };
    });
  } catch (error) {
    console.error("Error in getRatingsForItem:", error);
    throw error;
  }
};

export const getUserRatingForItem = async (
  itemId: string
) => {
  // Get current user from Supabase session
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    return null; // No user logged in
  }

  try {
    const { data, error } = await supabase
      .from('ratings')
      .select('*')
      .eq('item_id', itemId)
      .eq('user_id', session.user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rating found - this is not actually an error
        return null;
      }
      console.error("Error fetching user rating:", error);
      throw error;
    }

    return {
      id: data.id,
      rating: data.rating,
      review: data.review,
      createdAt: data.created_at
    };
  } catch (error) {
    console.error("Error in getUserRatingForItem:", error);
    return null;
  }
};
