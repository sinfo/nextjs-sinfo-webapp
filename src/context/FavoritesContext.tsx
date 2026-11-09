"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getClientFavorites, setClientFavorites } from "@/utils/favorites";

interface FavoritesContextType {
  favorites: string[];
  isFavorite: (speakerId: string) => boolean;
  toggleFavorite: (speakerId: string) => void;
  addFavorite: (speakerId: string) => void;
  removeFavorite: (speakerId: string) => void;
  reorderFavorites: (newOrder: string[]) => void;
  moveFavorite: (speakerId: string, direction: "left" | "right") => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);

interface FavoritesProviderProps {
  children: React.ReactNode;
  userId: string;
  initialFavorites?: string[];
}

export function FavoritesProvider({
  children,
  userId,
  initialFavorites = [],
}: FavoritesProviderProps) {
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const clientSaved = getClientFavorites(userId);
      if (clientSaved.length > 0) return clientSaved;
    }
    return initialFavorites;
  });

  useEffect(() => {
    if (!userId) return;
    const clientSaved = getClientFavorites(userId);
    if (clientSaved.length > 0) {
      setFavorites(clientSaved);
    } else if (initialFavorites.length > 0) {
      setFavorites(initialFavorites);
      setClientFavorites(userId, initialFavorites);
    }
  }, [userId, initialFavorites]);

  useEffect(() => {
    if (!userId) return;

    const handleCustomChange = (e: Event) => {
      const customEvent = e as CustomEvent<{
        userId: string;
        favorites: string[];
      }>;
      if (customEvent.detail && customEvent.detail.userId === userId) {
        setFavorites(customEvent.detail.favorites);
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `sinfo_favorites_${userId}` && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setFavorites(parsed);
          }
        } catch {
          // ignore parsing error
        }
      }
    };

    window.addEventListener("sinfo-favorites-change", handleCustomChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("sinfo-favorites-change", handleCustomChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [userId]);

  const updateFavorites = useCallback(
    (newFavorites: string[]) => {
      setFavorites(newFavorites);
      if (userId) {
        setClientFavorites(userId, newFavorites);
      }
    },
    [userId],
  );

  const isFavorite = useCallback(
    (speakerId: string) => {
      return favorites.includes(speakerId);
    },
    [favorites],
  );

  const toggleFavorite = useCallback(
    (speakerId: string) => {
      if (favorites.includes(speakerId)) {
        updateFavorites(favorites.filter((id) => id !== speakerId));
      } else {
        updateFavorites([...favorites, speakerId]);
      }
    },
    [favorites, updateFavorites],
  );

  const addFavorite = useCallback(
    (speakerId: string) => {
      if (!favorites.includes(speakerId)) {
        updateFavorites([...favorites, speakerId]);
      }
    },
    [favorites, updateFavorites],
  );

  const removeFavorite = useCallback(
    (speakerId: string) => {
      updateFavorites(favorites.filter((id) => id !== speakerId));
    },
    [favorites, updateFavorites],
  );

  const reorderFavorites = useCallback(
    (newOrder: string[]) => {
      updateFavorites(newOrder);
    },
    [updateFavorites],
  );

  const moveFavorite = useCallback(
    (speakerId: string, direction: "left" | "right") => {
      const index = favorites.indexOf(speakerId);
      if (index === -1) return;

      const targetIndex = direction === "left" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= favorites.length) return;

      const newOrder = [...favorites];
      const [item] = newOrder.splice(index, 1);
      newOrder.splice(targetIndex, 0, item);

      updateFavorites(newOrder);
    },
    [favorites, updateFavorites],
  );

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        toggleFavorite,
        addFavorite,
        removeFavorite,
        reorderFavorites,
        moveFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
