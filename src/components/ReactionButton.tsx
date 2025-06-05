
import { useState } from "react";
import { ReactionType } from "@/services/reactions";
import { cn } from "@/lib/utils";

type ReactionButtonProps = {
  reactionType: ReactionType;
  count: number;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
};

const reactionEmojis: Record<ReactionType, string> = {
  like: "👍",
  love: "❤️",
  laugh: "😂",
  wow: "😮",
  sad: "😢",
  angry: "😠"
};

const reactionLabels: Record<ReactionType, string> = {
  like: "Curtir",
  love: "Amar",
  laugh: "Rir",
  wow: "Uau",
  sad: "Triste",
  angry: "Raiva"
};

export default function ReactionButton({
  reactionType,
  count,
  isActive,
  onClick,
  disabled = false
}: ReactionButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all duration-200",
        "hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed",
        isActive 
          ? "bg-recomendify-purple text-white" 
          : "bg-gray-50 text-gray-600 hover:text-gray-800"
      )}
      title={reactionLabels[reactionType]}
    >
      <span className={cn(
        "text-sm transition-transform duration-200",
        isHovered && "scale-110"
      )}>
        {reactionEmojis[reactionType]}
      </span>
      {count > 0 && (
        <span className="font-medium">{count}</span>
      )}
    </button>
  );
}
