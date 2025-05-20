
import { Film, BookOpen, LayoutList } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

type FeedTypeFilterProps = {
  selectedType: "all" | "movie" | "book";
  onTypeChange: (type: "all" | "movie" | "book") => void;
};

export default function FeedTypeFilter({ 
  selectedType, 
  onTypeChange 
}: FeedTypeFilterProps) {
  const options = [
    { value: "all", label: "Todos", icon: LayoutList },
    { value: "movie", label: "Filmes", icon: Film },
    { value: "book", label: "Livros", icon: BookOpen },
  ];

  return (
    <div className="flex gap-3">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onTypeChange(option.value as "all" | "movie" | "book")}
          className={cn(
            "flex items-center justify-center gap-2 flex-1 py-2 px-3 rounded-md text-sm transition-colors",
            option.value === selectedType
              ? "bg-recomendify-purple text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          )}
        >
          <option.icon size={16} />
          {option.label}
        </button>
      ))}
    </div>
  );
}
