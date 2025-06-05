
// This is a placeholder service for Firebase Firestore functionality
// Since the application is primarily using Supabase, this file provides type definitions
// but operations will return mock data or empty results

import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  orderBy,
  serverTimestamp
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

// Type for user ratings
export type Rating = {
  id: string;
  userId: string;
  itemId: string;
  itemType: 'movie' | 'book' | 'game';
  rating: number;
  review?: string;
  createdAt: Date;
  user?: {
    id: string;
    displayName: string;
    avatar: string;
  };
};

// Mock implementations that don't actually use Firebase
// These will prevent runtime errors if any part of the code still references these functions

export const addRating = async (
  userId: string,
  itemId: string, 
  itemType: 'movie' | 'book' | 'game', 
  rating: number, 
  review?: string
) => {
  console.warn("Firebase Firestore functionality is disabled. Using Supabase instead.");
  return {
    id: "mock-id",
    userId,
    itemId,
    itemType,
    rating,
    review,
    createdAt: new Date()
  };
};

export const getRatingsForItem = async (itemId: string, itemType: 'movie' | 'book' | 'game') => {
  console.warn("Firebase Firestore functionality is disabled. Using Supabase instead.");
  return [];
};

export const getUserRatingForItem = async (userId: string, itemId: string) => {
  console.warn("Firebase Firestore functionality is disabled. Using Supabase instead.");
  return null;
};

export const updateRating = async (ratingId: string, data: Partial<Omit<Rating, 'id' | 'userId' | 'itemId' | 'itemType'>>) => {
  console.warn("Firebase Firestore functionality is disabled. Using Supabase instead.");
};

export const deleteRating = async (ratingId: string) => {
  console.warn("Firebase Firestore functionality is disabled. Using Supabase instead.");
};

export const getUserRatings = async () => {
  console.warn("Firebase Firestore functionality is disabled. Using Supabase instead.");
  return [];
};
