
import { supabase } from "@/lib/supabase";

export type PreferenceType = 'movie_genre' | 'book_genre' | 'movie_rating' | 'book_rating';

export type UserPreference = {
  id: string;
  user_id: string;
  preference_type: PreferenceType;
  preference_value: string;
  created_at: string;
};

export const MOVIE_GENRES = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
  'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Mystery',
  'Romance', 'Science Fiction', 'Thriller', 'War', 'Western'
];

export const BOOK_GENRES = [
  'Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Science Fiction',
  'Fantasy', 'Thriller', 'Biography', 'History', 'Self-Help',
  'Business', 'Health', 'Travel', 'Children', 'Young Adult'
];

export const getUserPreferences = async (): Promise<UserPreference[]> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const addUserPreference = async (
  preferenceType: PreferenceType,
  preferenceValue: string
) => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from('user_preferences')
    .insert({
      user_id: session.user.id,
      preference_type: preferenceType,
      preference_value: preferenceValue
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const removeUserPreference = async (preferenceId: string) => {
  const { error } = await supabase
    .from('user_preferences')
    .delete()
    .eq('id', preferenceId);

  if (error) throw error;
};
