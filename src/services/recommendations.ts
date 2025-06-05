
import { supabase } from "@/lib/supabase";
import { getUserPreferences } from "./preferences";

export type RecommendationItem = {
  id: string;
  title: string;
  type: 'movie' | 'book';
  genres: string[];
  averageRating: number;
  description?: string;
  image?: string;
  releaseYear?: number;
  author?: string;
  director?: string;
};

// Mock data para demonstração - em um app real, isso viria de uma API
const MOCK_MOVIES = [
  {
    id: "movie1",
    title: "Inception",
    type: "movie" as const,
    genres: ["Science Fiction", "Action", "Thriller"],
    averageRating: 8.8,
    description: "A thief who enters people's dreams",
    releaseYear: 2010,
    director: "Christopher Nolan"
  },
  {
    id: "movie2",
    title: "The Dark Knight",
    type: "movie" as const,
    genres: ["Action", "Crime", "Drama"],
    averageRating: 9.0,
    description: "Batman faces the Joker",
    releaseYear: 2008,
    director: "Christopher Nolan"
  },
  {
    id: "movie3",
    title: "Interstellar",
    type: "movie" as const,
    genres: ["Science Fiction", "Drama"],
    averageRating: 8.6,
    description: "A team explores space through a wormhole",
    releaseYear: 2014,
    director: "Christopher Nolan"
  },
  {
    id: "movie4",
    title: "The Shawshank Redemption",
    type: "movie" as const,
    genres: ["Drama"],
    averageRating: 9.3,
    description: "Two imprisoned men bond over years",
    releaseYear: 1994,
    director: "Frank Darabont"
  }
];

const MOCK_BOOKS = [
  {
    id: "book1",
    title: "Dune",
    type: "book" as const,
    genres: ["Science Fiction", "Fantasy"],
    averageRating: 8.5,
    description: "A desert planet holds the key to the universe",
    author: "Frank Herbert"
  },
  {
    id: "book2",
    title: "The Hobbit",
    type: "book" as const,
    genres: ["Fantasy", "Adventure"],
    averageRating: 8.7,
    description: "A hobbit goes on an unexpected journey",
    author: "J.R.R. Tolkien"
  },
  {
    id: "book3",
    title: "1984",
    type: "book" as const,
    genres: ["Science Fiction", "Thriller"],
    averageRating: 8.9,
    description: "A dystopian future where Big Brother watches",
    author: "George Orwell"
  },
  {
    id: "book4",
    title: "To Kill a Mockingbird",
    type: "book" as const,
    genres: ["Fiction", "Drama"],
    averageRating: 8.3,
    description: "A story of racial injustice and moral growth",
    author: "Harper Lee"
  }
];

export const getPersonalizedRecommendations = async (): Promise<RecommendationItem[]> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    throw new Error("User not authenticated");
  }

  try {
    // Get user preferences
    const preferences = await getUserPreferences();
    const movieGenres = preferences
      .filter(p => p.preference_type === 'movie_genre')
      .map(p => p.preference_value);
    const bookGenres = preferences
      .filter(p => p.preference_type === 'book_genre')
      .map(p => p.preference_value);

    // Get user's highly rated items
    const { data: userRatings } = await supabase
      .from('ratings')
      .select('*')
      .eq('user_id', session.user.id)
      .gte('rating', 4);

    const recommendations: RecommendationItem[] = [];

    // Filter movies based on preferences and ratings
    const movieRecommendations = MOCK_MOVIES.filter(movie => {
      if (movieGenres.length === 0) return true;
      return movie.genres.some(genre => movieGenres.includes(genre));
    });

    // Filter books based on preferences and ratings
    const bookRecommendations = MOCK_BOOKS.filter(book => {
      if (bookGenres.length === 0) return true;
      return book.genres.some(genre => bookGenres.includes(genre));
    });

    recommendations.push(...movieRecommendations, ...bookRecommendations);

    // Sort by average rating
    return recommendations.sort((a, b) => b.averageRating - a.averageRating);
  } catch (error) {
    console.error("Error getting recommendations:", error);
    throw error;
  }
};
