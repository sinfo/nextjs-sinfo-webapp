import { cookies } from "next/headers";
import { getFavoritesKey } from "./favorites";

export function getServerFavorites(userId: string): string[] {
  try {
    const cookieStore = cookies();
    const key = getFavoritesKey(userId);
    const val = cookieStore.get(key)?.value;
    if (!val) return [];
    const parsed = JSON.parse(decodeURIComponent(val));
    if (Array.isArray(parsed)) return parsed;
  } catch {
    return [];
  }
  return [];
}
