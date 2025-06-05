
import { supabase } from "@/lib/supabase";
import { fetchMovies, fetchBooks } from "@/services/api";

export type PaginatedRating = {
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

export type FeedPageData = {
  ratings: PaginatedRating[];
  nextCursor: string | null;
  hasMore: boolean;
};

const ITEMS_PER_PAGE = 10;

export const fetchFeedPage = async ({
  pageParam = null,
  selectedType = "all",
  minRating = 0,
  searchQuery = ""
}: {
  pageParam?: string | null;
  selectedType?: "all" | "movie" | "book";
  minRating?: number;
  searchQuery?: string;
}): Promise<FeedPageData> => {
  try {
    // Build the query
    let query = supabase
      .from('ratings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(ITEMS_PER_PAGE + 1); // Fetch one extra to check if there are more

    // Apply cursor pagination
    if (pageParam) {
      query = query.lt('created_at', pageParam);
    }

    // Apply type filter
    if (selectedType !== "all") {
      query = query.eq('item_type', selectedType);
    }

    // Apply rating filter
    if (minRating > 0) {
      query = query.gte('rating', minRating);
    }

    // Apply search query
    if (searchQuery) {
      query = query.ilike('review', `%${searchQuery}%`);
    }

    const { data: ratingsData, error: ratingsError } = await query;

    if (ratingsError) {
      console.error("Error fetching ratings:", ratingsError);
      throw ratingsError;
    }

    if (!ratingsData || ratingsData.length === 0) {
      return {
        ratings: [],
        nextCursor: null,
        hasMore: false
      };
    }

    // Check if there are more items
    const hasMore = ratingsData.length > ITEMS_PER_PAGE;
    const ratings = hasMore ? ratingsData.slice(0, ITEMS_PER_PAGE) : ratingsData;
    const nextCursor = hasMore ? ratings[ratings.length - 1].created_at : null;

    // Get all user IDs to fetch profiles
    const userIds = ratings.map(rating => rating.user_id);
    
    // Fetch user profiles
    let profilesMap = new Map();
    
    if (userIds.length > 0) {
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url')
        .in('id', userIds);
        
      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
      } else if (profilesData) {
        profilesData.forEach(profile => {
          profilesMap.set(profile.id, {
            id: profile.id,
            displayName: profile.display_name || "Usuário",
            avatar: profile.avatar_url || "/placeholder.svg"
          });
        });
      }
    }

    // Create ratings with user info
    const ratingsWithUserInfo: PaginatedRating[] = ratings.map(item => ({
      id: item.id,
      rating: item.rating,
      review: item.review,
      createdAt: item.created_at,
      item_id: item.item_id,
      item_type: item.item_type,
      user: profilesMap.get(item.user_id) || {
        id: item.user_id,
        displayName: "Usuário",
        avatar: "/placeholder.svg"
      }
    }));

    // Fetch titles for movies and books
    const movieRatings = ratingsWithUserInfo.filter(r => r.item_type === "movie");
    const bookRatings = ratingsWithUserInfo.filter(r => r.item_type === "book");
    
    // Fetch movie titles
    if (movieRatings.length > 0) {
      const movieTitles = new Map();
      
      for (const rating of movieRatings) {
        try {
          const movieData = await fetchMovies(`&ids=${rating.item_id}`);
          if (movieData.results && movieData.results[0]) {
            movieTitles.set(rating.item_id, movieData.results[0].title);
          }
        } catch (err) {
          console.error(`Failed to fetch movie ${rating.item_id}:`, err);
        }
      }
      
      movieRatings.forEach(rating => {
        rating.item_title = movieTitles.get(rating.item_id) || "Título não disponível";
      });
    }
    
    // Fetch book titles
    if (bookRatings.length > 0) {
      const bookTitles = new Map();
      
      for (const rating of bookRatings) {
        try {
          const bookData = await fetchBooks(`&q=id:${rating.item_id}`);
          if (bookData.results && bookData.results[0]) {
            bookTitles.set(rating.item_id, bookData.results[0].title);
          }
        } catch (err) {
          console.error(`Failed to fetch book ${rating.item_id}:`, err);
        }
      }
      
      bookRatings.forEach(rating => {
        rating.item_title = bookTitles.get(rating.item_id) || "Título não disponível";
      });
    }

    return {
      ratings: ratingsWithUserInfo,
      nextCursor,
      hasMore
    };
  } catch (error) {
    console.error("Error in fetchFeedPage:", error);
    throw error;
  }
};
