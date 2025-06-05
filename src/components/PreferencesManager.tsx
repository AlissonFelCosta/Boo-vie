
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  getUserPreferences,
  addUserPreference,
  removeUserPreference,
  MOVIE_GENRES,
  BOOK_GENRES,
  PreferenceType,
  UserPreference
} from "@/services/preferences";

export default function PreferencesManager() {
  const [selectedMovieGenres, setSelectedMovieGenres] = useState<string[]>([]);
  const [selectedBookGenres, setSelectedBookGenres] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const { data: preferences = [], isLoading } = useQuery({
    queryKey: ['user-preferences'],
    queryFn: getUserPreferences,
  });

  const addPreferenceMutation = useMutation({
    mutationFn: ({ type, value }: { type: PreferenceType; value: string }) =>
      addUserPreference(type, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-preferences'] });
      toast.success("Preferência adicionada");
    },
    onError: (error) => {
      console.error("Error adding preference:", error);
      toast.error("Erro ao adicionar preferência");
    },
  });

  const removePreferenceMutation = useMutation({
    mutationFn: removeUserPreference,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-preferences'] });
      toast.success("Preferência removida");
    },
    onError: (error) => {
      console.error("Error removing preference:", error);
      toast.error("Erro ao remover preferência");
    },
  });

  useEffect(() => {
    const movieGenres = preferences
      .filter(p => p.preference_type === 'movie_genre')
      .map(p => p.preference_value);
    const bookGenres = preferences
      .filter(p => p.preference_type === 'book_genre')
      .map(p => p.preference_value);
    
    setSelectedMovieGenres(movieGenres);
    setSelectedBookGenres(bookGenres);
  }, [preferences]);

  const handleGenreToggle = (genre: string, type: 'movie' | 'book') => {
    const preferenceType: PreferenceType = type === 'movie' ? 'movie_genre' : 'book_genre';
    const currentGenres = type === 'movie' ? selectedMovieGenres : selectedBookGenres;
    const isSelected = currentGenres.includes(genre);

    if (isSelected) {
      // Remove preference
      const preference = preferences.find(
        p => p.preference_type === preferenceType && p.preference_value === genre
      );
      if (preference) {
        removePreferenceMutation.mutate(preference.id);
      }
    } else {
      // Add preference
      addPreferenceMutation.mutate({ type: preferenceType, value: genre });
    }
  };

  if (isLoading) {
    return <div>Carregando preferências...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus size={20} />
            Gêneros de Filmes Favoritos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {MOVIE_GENRES.map((genre) => (
              <Badge
                key={genre}
                variant={selectedMovieGenres.includes(genre) ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/80"
                onClick={() => handleGenreToggle(genre, 'movie')}
              >
                {genre}
                {selectedMovieGenres.includes(genre) && (
                  <X size={14} className="ml-1" />
                )}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus size={20} />
            Gêneros de Livros Favoritos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {BOOK_GENRES.map((genre) => (
              <Badge
                key={genre}
                variant={selectedBookGenres.includes(genre) ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/80"
                onClick={() => handleGenreToggle(genre, 'book')}
              >
                {genre}
                {selectedBookGenres.includes(genre) && (
                  <X size={14} className="ml-1" />
                )}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
