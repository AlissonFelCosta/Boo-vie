
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { ArrowLeft, Star, Calendar, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPersonalizedRecommendations } from "@/services/recommendations";
import PreferencesManager from "@/components/PreferencesManager";

export default function RecommendationsPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const { data: recommendations = [], isLoading, error } = useQuery({
    queryKey: ['personalized-recommendations'],
    queryFn: getPersonalizedRecommendations,
    enabled: !!currentUser,
  });

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Você precisa estar logado para ver suas recomendações.</p>
      </div>
    );
  }

  const contentClasses = "ml-[70px] md:ml-[200px] p-4";

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className={contentClasses}>
        <div className="flex items-center mb-6">
          <button 
            className="flex items-center text-gray-600 hover:text-recomendify-purple mr-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={20} className="mr-1" />
            <span>Voltar</span>
          </button>
          
          <h1 className="text-2xl font-bold">Recomendações Personalizadas</h1>
        </div>

        <div className="space-y-8">
          {/* Preferences Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Suas Preferências</h2>
            <PreferencesManager />
          </div>

          {/* Recommendations Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Recomendações para Você</h2>
            
            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {error && (
              <Card>
                <CardContent className="p-4">
                  <p className="text-red-600">Erro ao carregar recomendações</p>
                </CardContent>
              </Card>
            )}

            {!isLoading && !error && recommendations.length === 0 && (
              <Card>
                <CardContent className="p-4">
                  <p className="text-gray-600">
                    Configure suas preferências acima para receber recomendações personalizadas!
                  </p>
                </CardContent>
              </Card>
            )}

            {!isLoading && recommendations.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations.map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <Badge variant={item.type === 'movie' ? 'default' : 'secondary'}>
                          {item.type === 'movie' ? 'Filme' : 'Livro'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {item.description}
                        </p>
                        
                        <div className="flex items-center gap-2">
                          <Star className="text-yellow-500 fill-current" size={16} />
                          <span className="text-sm font-medium">{item.averageRating}</span>
                        </div>

                        {item.type === 'movie' && item.director && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User size={14} />
                            <span>Dir: {item.director}</span>
                          </div>
                        )}

                        {item.type === 'book' && item.author && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User size={14} />
                            <span>{item.author}</span>
                          </div>
                        )}

                        {item.releaseYear && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar size={14} />
                            <span>{item.releaseYear}</span>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-1">
                          {item.genres.map((genre) => (
                            <Badge key={genre} variant="outline" className="text-xs">
                              {genre}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
