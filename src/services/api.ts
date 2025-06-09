// Movie API - using TMDB API
export const fetchMovies = async (query?: string, page: number = 1, genreId?: string) => {
  const BASE_URL = "https://api.themoviedb.org/3";
  const API_KEY = "a3c38a3f7afd271ee69df9c00435514f"; // TMDB API key
  
  try {
    // Check if query contains an ID request
    if (query && query.includes("&ids=")) {
      const id = query.split("&ids=")[1];
      const response = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
      if (!response.ok) throw new Error('Failed to fetch movie');
      
      const movie = await response.json();
      return {
        results: [{
          id: movie.id,
          title: movie.title,
          image: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder.svg',
          releaseDate: movie.release_date,
          description: movie.overview,
          type: 'movie'
        }],
        totalPages: 1,
        currentPage: 1
      };
    }
    
    // Regular search or discovery with genre filtering
    let endpoint;
    
    if (query) {
      // Search with genre filter and adult content filter
      endpoint = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}&include_adult=false`;
      if (genreId) {
        endpoint += `&with_genres=${genreId}`;
      }
    } else {
      // Discovery with genre filter and adult content filter
      endpoint = `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&page=${page}&include_adult=false`;
      if (genreId) {
        endpoint += `&with_genres=${genreId}`;
      }
    }
    
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error('Failed to fetch movies');
    
    const data = await response.json();
    
    return {
      results: data.results.map((movie: any) => ({
        id: movie.id,
        title: movie.title,
        image: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder.svg',
        releaseDate: movie.release_date,
        description: movie.overview,
        type: 'movie'
      })),
      totalPages: data.total_pages,
      currentPage: data.page
    };
  } catch (error) {
    console.error("Error fetching movies:", error);
    return {
      results: [],
      totalPages: 0,
      currentPage: page
    };
  }
};

// Book API - using Google Books API
export const fetchBooks = async (query?: string, page: number = 1, subject?: string) => {
  try {
    // Calculate startIndex based on page (Google Books API uses startIndex)
    const startIndex = (page - 1) * 10; // 10 items per page
    
    // Check if query contains an ID request
    if (query && query.includes("&q=id:")) {
      const id = query.split("&q=id:")[1];
      console.log("Fetching book with ID:", id);
      
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`);
      
      if (!response.ok) {
        console.error("Book API error:", response.status, response.statusText);
        throw new Error('Failed to fetch book');
      }
      
      const book = await response.json();
      console.log("Book API response:", book);
      
      // Clean HTML tags from description
      const cleanDescription = book.volumeInfo.description 
        ? stripHtmlTags(book.volumeInfo.description)
        : "No description available";
      
      return {
        results: [{
          id: book.id,
          title: book.volumeInfo.title,
          image: book.volumeInfo.imageLinks?.thumbnail || '/placeholder.svg',
          releaseDate: book.volumeInfo.publishedDate,
          description: cleanDescription,
          authors: book.volumeInfo.authors || ["Unknown Author"],
          type: 'book'
        }],
        totalPages: 1,
        currentPage: 1
      };
    }
    
    // Build search query with subject filter and safe search
    let searchQuery = "";
    
    if (query && subject) {
      searchQuery = `${query}+subject:${subject}`;
    } else if (query) {
      searchQuery = query;
    } else if (subject) {
      searchQuery = `subject:${subject}`;
    } else {
      searchQuery = "subject:fiction";
    }
    
    const endpoint = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&startIndex=${startIndex}&maxResults=10&orderBy=relevance&filter=partial`;
    
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error('Failed to fetch books');
    
    const data = await response.json();
    
    // Filter out adult content by checking maturity rating
    const filteredItems = data.items?.filter((book: any) => {
      const maturityRating = book.volumeInfo.maturityRating;
      return !maturityRating || maturityRating === 'NOT_MATURE';
    }) || [];
    
    // Calculate total pages based on totalItems
    const totalPages = Math.ceil((data.totalItems || 0) / 10);
    
    return {
      results: filteredItems.map((book: any) => {
        // Clean HTML tags from description
        const cleanDescription = book.volumeInfo.description 
          ? stripHtmlTags(book.volumeInfo.description)
          : "No description available";
          
        return {
          id: book.id,
          title: book.volumeInfo.title,
          image: book.volumeInfo.imageLinks?.thumbnail || '/placeholder.svg',
          releaseDate: book.volumeInfo.publishedDate,
          description: cleanDescription,
          authors: book.volumeInfo.authors || ["Unknown Author"],
          type: 'book'
        };
      }),
      totalPages: totalPages,
      currentPage: page
    };
  } catch (error) {
    console.error("Error fetching books:", error);
    return {
      results: [],
      totalPages: 0,
      currentPage: page
    };
  }
};

// Import the HTML utility function at the top
import { stripHtmlTags } from "@/utils/htmlUtils";

// Game API - using RAWG API
export const fetchGames = async (query?: string, page: number = 1) => {
  const BASE_URL = "https://api.rawg.io/api/games";
  const API_KEY = "YOUR_RAWG_API_KEY"; // Replace with your RAWG API key
  
  try {
    // Check if query contains an ID request
    if (query && query.includes("&ids=")) {
      const id = query.split("&ids=")[1];
      const response = await fetch(`${BASE_URL}/${id}?key=${API_KEY}`);
      if (!response.ok) throw new Error('Failed to fetch game');
      
      const game = await response.json();
      return {
        results: [{
          id: game.id,
          title: game.name,
          image: game.background_image || '/placeholder.svg',
          releaseDate: game.released,
          description: game.description_raw || "No description available",
          platforms: game.platforms?.map((p: any) => p.platform.name) || [],
          type: 'game'
        }],
        totalPages: 1,
        currentPage: 1
      };
    }
    
    // Regular search or discovery with adult content filter
    let endpoint = query 
      ? `${BASE_URL}?key=${API_KEY}&search=${encodeURIComponent(query)}&page=${page}&esrb_rating=1,2,3` // Everyone, Everyone 10+, Teen
      : `${BASE_URL}?key=${API_KEY}&ordering=-rating&page=${page}&esrb_rating=1,2,3`;
    
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error('Failed to fetch games');
    
    const data = await response.json();
    
    return {
      results: data.results.map((game: any) => ({
        id: game.id,
        title: game.name,
        image: game.background_image || '/placeholder.svg',
        releaseDate: game.released,
        description: game.description_raw || "No description available",
        platforms: game.platforms?.map((p: any) => p.platform.name) || [],
        type: 'game'
      })),
      totalPages: Math.min(data.count ? Math.ceil(data.count / 20) : 0, 500),
      currentPage: page
    };
  } catch (error) {
    console.error("Error fetching games:", error);
    return {
      results: [],
      totalPages: 0,
      currentPage: page
    };
  }
};

// Fetch similar items based on user ratings
export const fetchSimilarItems = async (itemId: string, itemType: 'movie' | 'book') => {
  try {
    if (itemType === 'movie') {
      const BASE_URL = "https://api.themoviedb.org/3";
      const API_KEY = "a3c38a3f7afd271ee69df9c00435514f";
      
      const response = await fetch(`${BASE_URL}/movie/${itemId}/similar?api_key=${API_KEY}&include_adult=false`);
      if (!response.ok) throw new Error('Failed to fetch similar movies');
      
      const data = await response.json();
      return data.results.slice(0, 5).map((movie: any) => ({
        id: movie.id,
        title: movie.title,
        type: 'movie'
      }));
    } else if (itemType === 'book') {
      // For books, we'll search for books by the same author or similar genre
      const bookResponse = await fetch(`https://www.googleapis.com/books/v1/volumes/${itemId}`);
      if (!bookResponse.ok) throw new Error('Failed to fetch book details');
      
      const book = await bookResponse.json();
      const authors = book.volumeInfo.authors || [];
      const categories = book.volumeInfo.categories || [];
      
      let searchQuery = "";
      if (authors.length > 0) {
        searchQuery = `inauthor:"${authors[0]}"`;
      } else if (categories.length > 0) {
        searchQuery = `subject:"${categories[0]}"`;
      } else {
        return []; // No similar books found
      }
      
      const similarResponse = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&maxResults=5&filter=partial`);
      if (!similarResponse.ok) throw new Error('Failed to fetch similar books');
      
      const similarData = await similarResponse.json();
      return similarData.items?.filter((similarBook: any) => {
        const maturityRating = similarBook.volumeInfo.maturityRating;
        return similarBook.id !== itemId && (!maturityRating || maturityRating === 'NOT_MATURE');
      }).slice(0, 5).map((similarBook: any) => ({
        id: similarBook.id,
        title: similarBook.volumeInfo.title,
        type: 'book'
      })) || [];
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching similar items:", error);
    return [];
  }
};
