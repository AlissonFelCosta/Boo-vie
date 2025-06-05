
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LazyImage from "./LazyImage";

type ItemCardProps = {
  id: string;
  title: string;
  image: string;
  releaseDate: string;
  type: 'movie' | 'book' | 'game';
  priority?: boolean;
};

export default function ItemCard({ id, title, image, releaseDate, type, priority = false }: ItemCardProps) {
  const navigate = useNavigate();
  
  const formattedDate = releaseDate 
    ? new Date(releaseDate).toLocaleDateString('pt-BR')
    : 'Data desconhecida';
  
  // Route based on item type
  const handleClick = () => {
    console.log(`Navigating to ${type}/${id}`);
    switch(type) {
      case 'movie':
        navigate(`/movie/${id}`);
        break;
      case 'book':
        navigate(`/book/${id}`);
        break;
      case 'game':
        navigate(`/game/${id}`);
        break;
    }
  };

  const typeLabel = type === 'movie' ? 'Filme' : type === 'book' ? 'Livro' : 'Jogo';

  return (
    <article 
      className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-md focus-within:ring-2 focus-within:ring-boovie-teal focus-within:ring-offset-2"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`Ver detalhes de ${title}, ${typeLabel} de ${formattedDate}`}
    >
      <div className="aspect-[2/3] relative">
        <LazyImage
          src={image}
          alt={`Capa de ${title}`}
          className="w-full h-full"
          priority={priority}
        />
        <div className="absolute top-2 right-2 bg-gray-900/80 text-white text-xs px-2 py-1 rounded-full font-medium">
          {typeLabel}
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-medium text-sm line-clamp-1 text-gray-900">{title}</h3>
        <p className="text-xs text-gray-600 mt-1">{formattedDate}</p>
      </div>
    </article>
  );
}
