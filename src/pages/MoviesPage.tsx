import { useState, useEffect } from "react";
import { fetchMovies } from "@/services/api";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import ItemCard from "@/components/ItemCard";
import CategoryFilter from "@/components/CategoryFilter";
import MobileNavigation from "@/components/MobileNavigation";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

// Movie categories with TMDB genre IDs
const MOVIE_CATEGORIES = [
  { id: "28", name: "Ação" },
  { id: "12", name: "Aventura" },
  { id: "35", name: "Comédia" },
  { id: "18", name: "Drama" },
  { id: "27", name: "Terror" },
  { id: "10749", name: "Romance" },
  { id: "53", name: "Suspense" },
  { id: "878", name: "Ficção Científica" }
];

export default function MoviesPage() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  useEffect(() => {
    const getMovies = async () => {
      setLoading(true);
      const response = await fetchMovies(searchQuery, currentPage, selectedCategory || undefined);
      setMovies(response.results);
      setTotalPages(response.totalPages);
      setLoading(false);
    };
    
    getMovies();
  }, [searchQuery, currentPage, selectedCategory]);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to page 1 when searching
  };
  
  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // Reset to page 1 when changing category
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Scroll back to top when changing page
  };
  
  // Generate pagination numbers
  const getPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust startPage if endPage is maxed out
    if (endPage === totalPages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            onClick={() => handlePageChange(i)} 
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <MobileNavigation />
      
      <main className="pl-4 md:pl-[220px] pr-4 py-4 pb-20 md:pb-4">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Filmes</h1>
        </header>
        
        <SearchBar onSearch={handleSearch} placeholder="Buscar filmes..." />
        
        <div className="my-4">
          <CategoryFilter 
            categories={MOVIE_CATEGORIES}
            selectedCategory={selectedCategory}
            onChange={handleCategoryChange}
          />
        </div>
        
        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-boovie-orange"></div>
            <p className="mt-2 text-gray-700">Carregando filmes...</p>
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-10 text-gray-600">
            Nenhum filme encontrado
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
              {movies.map((movie, index) => (
                <ItemCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  image={movie.image}
                  releaseDate={movie.releaseDate}
                  type="movie"
                  priority={index < 5} // Priority for first 5 items
                />
              ))}
            </div>
            
            {totalPages > 1 && (
              <Pagination className="my-8">
                <PaginationContent>
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => handlePageChange(currentPage - 1)} 
                      />
                    </PaginationItem>
                  )}
                  
                  {getPaginationItems()}
                  
                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => handlePageChange(currentPage + 1)} 
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </main>
    </div>
  );
}
