
import { useQuery } from "@tanstack/react-query";
import { getSmartRecommendations } from "@/services/smartRecommendations";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

export default function SmartRecommendations() {
  const { data: recommendations = [], isLoading, error } = useQuery({
    queryKey: ['smart-recommendations'],
    queryFn: getSmartRecommendations,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="text-yellow-500" size={20} />
            Recomendações para Você
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Carregando recomendações...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="text-yellow-500" size={20} />
            Recomendações para Você
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">Erro ao carregar recomendações</p>
        </CardContent>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="text-yellow-500" size={20} />
            Recomendações para Você
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Avalie alguns filmes ou livros para receber recomendações personalizadas!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="text-yellow-500" size={20} />
          Recomendações para Você
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {recommendations.map((item) => (
            <Link
              key={`${item.type}-${item.id}`}
              to={`/${item.type}/${item.id}`}
              className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <span className="text-sm font-medium text-gray-800 truncate flex-1">
                {item.title}
              </span>
              <Badge variant={item.type === 'movie' ? 'default' : 'secondary'} className="ml-2">
                {item.type === 'movie' ? 'Filme' : 'Livro'}
              </Badge>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
