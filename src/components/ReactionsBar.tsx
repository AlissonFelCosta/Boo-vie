import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { addOrUpdateReaction, getReactionsForRating, getUserReactionForRating, ReactionType } from "@/services/reactions";
import ReactionButton from "./ReactionButton";
import { toast } from "sonner";

type ReactionsBarProps = {
  ratingId: string;
  onReactionChange?: () => void;
};

export default function ReactionsBar({ ratingId, onReactionChange }: ReactionsBarProps) {
  const { currentUser } = useAuth();
  const [reactions, setReactions] = useState<Record<ReactionType, number>>({
    like: 0,
    love: 0,
    laugh: 0,
    wow: 0,
    sad: 0,
    angry: 0
  });
  const [userReaction, setUserReaction] = useState<ReactionType | null>(null);
  const [loading, setLoading] = useState(false);

  const reactionTypes: ReactionType[] = ['like', 'love', 'laugh', 'wow', 'sad', 'angry'];

  useEffect(() => {
    fetchReactions();
    if (currentUser) {
      fetchUserReaction();
    }
  }, [ratingId, currentUser]);

  const fetchReactions = async () => {
    try {
      const reactionsData = await getReactionsForRating(ratingId);
      
      // Count reactions by type
      const counts: Record<ReactionType, number> = {
        like: 0,
        love: 0,
        laugh: 0,
        wow: 0,
        sad: 0,
        angry: 0
      };

      reactionsData.forEach(reaction => {
        if (reaction.reaction_type in counts) {
          counts[reaction.reaction_type as ReactionType]++;
        }
      });

      setReactions(counts);
    } catch (error) {
      console.error("Error fetching reactions:", error);
    }
  };

  const fetchUserReaction = async () => {
    try {
      const reaction = await getUserReactionForRating(ratingId);
      setUserReaction(reaction?.reaction_type || null);
    } catch (error) {
      console.error("Error fetching user reaction:", error);
    }
  };

  const handleReactionClick = async (reactionType: ReactionType) => {
    if (!currentUser) {
      toast.error("Você precisa estar logado para reagir");
      return;
    }

    if (loading) return;

    setLoading(true);
    try {
      await addOrUpdateReaction(ratingId, reactionType);
      
      // Update local state optimistically
      setReactions(prev => {
        const newReactions = { ...prev };
        
        // If user had a previous reaction, decrease its count
        if (userReaction) {
          newReactions[userReaction] = Math.max(0, newReactions[userReaction] - 1);
        }
        
        // If toggling the same reaction, user reaction becomes null
        if (userReaction === reactionType) {
          setUserReaction(null);
        } else {
          // Otherwise, increase the new reaction count and set as user reaction
          newReactions[reactionType] = newReactions[reactionType] + 1;
          setUserReaction(reactionType);
        }
        
        return newReactions;
      });

      if (onReactionChange) {
        onReactionChange();
      }
    } catch (error) {
      console.error("Error updating reaction:", error);
      toast.error("Erro ao reagir. Tente novamente.");
      // Refresh data on error
      fetchReactions();
      fetchUserReaction();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {reactionTypes.map(reactionType => (
        <ReactionButton
          key={reactionType}
          reactionType={reactionType}
          count={reactions[reactionType]}
          isActive={userReaction === reactionType}
          onClick={() => handleReactionClick(reactionType)}
          disabled={loading}
        />
      ))}
    </div>
  );
}
