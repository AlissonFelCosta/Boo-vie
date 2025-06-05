
import { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Star, Filter, Loader2 } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import MobileNavigation from "@/components/MobileNavigation";
import SearchBar from "@/components/SearchBar";
import FeedItem from "@/components/feed/FeedItem";
import FeedTypeFilter from "@/components/feed/FeedTypeFilter";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchFeedPage } from "@/services/feedPagination";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

export default function FeedPage() {
  const [selectedType, setSelectedType] = useState<"all" | "movie" | "book">("all");
  const [minRating, setMinRating] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Infinite query for ratings
  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: ["feed-ratings", selectedType, minRating, searchQuery],
    queryFn: ({ pageParam }) => fetchFeedPage({
      pageParam,
      selectedType,
      minRating,
      searchQuery
    }),
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor : undefined,
    initialPageParam: null,
  });

  // Infinite scroll hook
  const { loadMoreRef } = useInfiniteScroll({
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  // Flatten all pages into a single array
  const allRatings = data?.pages.flatMap(page => page.ratings) || [];

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
    <div className="flex min-h-screen bg-gray-50 w-full">
      <Sidebar />
      <MobileNavigation />
      
      <div className="flex-1 pl-0 md:pl-[200px] pb-16 md:pb-0">
        <div className="max-w-4xl mx-auto py-4 px-4">
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
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-pulse text-gray-500">Carregando avaliações...</div>
                </div>
              ) : allRatings.length > 0 ? (
                <div className="space-y-6">
                  {allRatings.map((rating) => (
                    <FeedItem key={rating.id} rating={rating} />
                  ))}
                  
                  {/* Load more trigger element */}
                  <div ref={loadMoreRef} className="py-4">
                    {isFetchingNextPage && (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-6 w-6 animate-spin text-recomendify-purple" />
                        <span className="ml-2 text-gray-500">Carregando mais avaliações...</span>
                      </div>
                    )}
                    {!hasNextPage && allRatings.length > 0 && (
                      <div className="text-center py-4 text-gray-500">
                        Não há mais avaliações para carregar.
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Nenhuma avaliação encontrada com os filtros selecionados.
                </div>
              )}
            </TabsContent>

            <TabsContent value="popular" className="space-y-4">
              <div className="text-center py-8 text-gray-500">
                Funcionalidade de avaliações populares em desenvolvimento.
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
