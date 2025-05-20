
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Star, Filter, Search as SearchIcon } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import FeedItem from "@/components/feed/FeedItem";
import FeedTypeFilter from "@/components/feed/FeedTypeFilter";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchMovies, fetchBooks } from "@/services/api";

type Rating = {
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

export default function FeedPage() {
  const [selectedType, setSelectedType] = useState<"all" | "movie" | "book">("all");
  const [minRating, setMinRating] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch ratings data
  const { data: ratings, isLoading, error, refetch } = useQuery({
    queryKey: ["ratings", selectedType, minRating, searchQuery],
    queryFn: async () => {
      try {
        // First, fetch the ratings
        let query = supabase
          .from('ratings')
          .select('*')
          .order('created_at', { ascending: false });

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
          return [];
        }

        // Get all user IDs to fetch profiles
        const userIds = ratingsData.map(rating => rating.user_id);
        
        // If we have user IDs, fetch their profiles
        let profilesMap = new Map();
        
        if (userIds.length > 0) {
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('id, display_name, avatar_url')
            .in('id', userIds);
            
          if (profilesError) {
            console.error("Error fetching profiles:", profilesError);
            // Continue with default profile values if this fails
          } else if (profilesData) {
            // Create map of user_id to profile data
            profilesData.forEach(profile => {
              profilesMap.set(profile.id, {
                id: profile.id,
                displayName: profile.display_name || "Usuário",
                avatar: profile.avatar_url || "/placeholder.svg"
              });
            });
          }
        }

        // Create basic ratings with user info
        const ratingsWithUserInfo: Rating[] = ratingsData.map(item => ({
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

        // Group by item type to fetch titles efficiently
        const movieRatings = ratingsWithUserInfo.filter(r => r.item_type === "movie");
        const bookRatings = ratingsWithUserInfo.filter(r => r.item_type === "book");
        const gameRatings = ratingsWithUserInfo.filter(r => r.item_type === "game");
        
        // Fetch movie titles
        if (movieRatings.length > 0) {
          const movieTitles = new Map();
          
          // Fetch movie titles in batches to avoid too many API calls
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
          
          // Add titles to movie ratings
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
          
          // Add titles to book ratings
          bookRatings.forEach(rating => {
            rating.item_title = bookTitles.get(rating.item_id) || "Título não disponível";
          });
        }
        
        // Combine all ratings back together and sort by created date
        const allRatingsWithTitles = [...movieRatings, ...bookRatings, ...gameRatings]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return allRatingsWithTitles;
      } catch (error) {
        console.error("Error in ratings query function:", error);
        toast.error("Erro ao carregar avaliações");
        throw error;
      }
    },
  });

  useEffect(() => {
    // Recuperar filtros do localStorage
    const savedFilters = localStorage.getItem("feedFilters");
    if (savedFilters) {
      const { type, rating } = JSON.parse(savedFilters);
      setSelectedType(type);
      setMinRating(rating);
    }
  }, []);

  useEffect(() => {
    // Salvar filtros no localStorage
    localStorage.setItem(
      "feedFilters",
      JSON.stringify({ type: selectedType, rating: minRating })
    );
  }, [selectedType, minRating]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleTypeChange = (type: "all" | "movie" | "book") => {
    setSelectedType(type);
  };

  const handleRatingChange = (value: number[]) => {
    setMinRating(value[0]);
  };

  if (error) {
    toast.error("Erro ao carregar avaliações");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 pl-[70px] md:pl-[200px]">
        <div className="max-w-3xl mx-auto py-4 px-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold">Feed de Avaliações</h1>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 rounded-full bg-white hover:bg-gray-100 border"
              >
                <Filter 
                  size={20} 
                  className={minRating > 0 || selectedType !== "all" ? "text-recomendify-purple" : "text-gray-600"} 
                />
              </button>
            </div>
          </div>

          <div className="mb-4">
            <SearchBar onSearch={handleSearch} placeholder="Buscar avaliações..." />
          </div>

          {showFilters && (
            <div className="bg-white p-4 rounded-lg shadow-sm mb-4 animate-fade-in">
              <div className="mb-4">
                <div className="text-sm font-medium mb-2">Tipo</div>
                <FeedTypeFilter 
                  selectedType={selectedType} 
                  onTypeChange={handleTypeChange} 
                />
              </div>

              <div>
                <div className="flex items-center mb-2">
                  <div className="text-sm font-medium">Avaliação mínima</div>
                  <div className="ml-2 flex items-center text-yellow-400">
                    <span className="mr-1">{minRating}</span>
                    <Star size={16} fill="currentColor" />
                  </div>
                </div>
                <Slider 
                  defaultValue={[minRating]} 
                  min={0}
                  max={5}
                  step={1}
                  onValueChange={handleRatingChange}
                  className="py-4"
                />
              </div>
            </div>
          )}

          <Tabs defaultValue="recent" className="w-full">
            <TabsList className="mb-4 w-full">
              <TabsTrigger value="recent" className="flex-1">Recentes</TabsTrigger>
              <TabsTrigger value="popular" className="flex-1">Populares</TabsTrigger>
            </TabsList>

            <TabsContent value="recent" className="space-y-4">
              <ScrollArea className="h-[calc(100vh-200px)] pr-4">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-pulse text-gray-500">Carregando avaliações...</div>
                  </div>
                ) : ratings && ratings.length > 0 ? (
                  <div className="space-y-6">
                    {ratings.map((rating) => (
                      <FeedItem key={rating.id} rating={rating} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Nenhuma avaliação encontrada com os filtros selecionados.
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="popular" className="space-y-4">
              <ScrollArea className="h-[calc(100vh-200px)] pr-4">
                <div className="text-center py-8 text-gray-500">
                  Funcionalidade de avaliações populares em desenvolvimento.
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
