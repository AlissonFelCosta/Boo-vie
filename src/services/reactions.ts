
import { supabase } from "@/lib/supabase";

export type ReactionType = 'like' | 'love' | 'laugh' | 'wow' | 'sad' | 'angry';

export type Reaction = {
  id: string;
  rating_id: string;
  user_id: string;
  reaction_type: ReactionType;
  created_at: string;
};

export const addOrUpdateReaction = async (
  ratingId: string,
  reactionType: ReactionType
) => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    throw new Error("User not authenticated");
  }

  const userId = session.user.id;

  // Check if user already has a reaction for this rating
  const { data: existingReaction } = await supabase
    .from('rating_reactions')
    .select('*')
    .eq('rating_id', ratingId)
    .eq('user_id', userId)
    .single();

  if (existingReaction) {
    // If same reaction type, remove it (toggle off)
    if (existingReaction.reaction_type === reactionType) {
      const { error } = await supabase
        .from('rating_reactions')
        .delete()
        .eq('id', existingReaction.id);

      if (error) throw error;
      return null;
    } else {
      // Update to new reaction type
      const { data, error } = await supabase
        .from('rating_reactions')
        .update({ reaction_type: reactionType })
        .eq('id', existingReaction.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  } else {
    // Create new reaction
    const { data, error } = await supabase
      .from('rating_reactions')
      .insert({
        rating_id: ratingId,
        user_id: userId,
        reaction_type: reactionType
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

export const getReactionsForRating = async (ratingId: string) => {
  const { data, error } = await supabase
    .from('rating_reactions')
    .select('*')
    .eq('rating_id', ratingId);

  if (error) throw error;
  return data || [];
};

export const getUserReactionForRating = async (ratingId: string) => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    return null;
  }

  const { data, error } = await supabase
    .from('rating_reactions')
    .select('*')
    .eq('rating_id', ratingId)
    .eq('user_id', session.user.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data;
};
