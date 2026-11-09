export const FAVORITES_COOKIE_PREFIX = "sinfo_favorites_";

export function getFavoritesKey(userId: string): string {
  return `${FAVORITES_COOKIE_PREFIX}${userId}`;
}

export function getClientFavorites(userId: string): string[] {
  if (typeof window === "undefined") return [];

  const key = getFavoritesKey(userId);

  try {
    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${key}=`));

    if (match) {
      const rawVal = match.split("=")[1];
      const parsed = JSON.parse(decodeURIComponent(rawVal));
      if (Array.isArray(parsed)) return parsed;
    }

    const local = localStorage.getItem(key);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    return [];
  }

  return [];
}

export function setClientFavorites(userId: string, favorites: string[]): void {
  if (typeof window === "undefined") return;

  const key = getFavoritesKey(userId);
  const serialized = JSON.stringify(favorites);

  try {
    document.cookie = `${key}=${encodeURIComponent(serialized)}; path=/; max-age=31536000; SameSite=Lax`;
    localStorage.setItem(key, serialized);

    window.dispatchEvent(
      new CustomEvent("sinfo-favorites-change", {
        detail: { userId, favorites },
      }),
    );
  } catch (err) {
    console.error("Failed to save favorites:", err);
  }
}
