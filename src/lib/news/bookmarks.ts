import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { NewsArticle } from "./types";

type BookmarkState = {
  items: NewsArticle[];
  toggle: (article: NewsArticle) => void;
  has: (id: string) => boolean;
};

export const useBookmarks = create<BookmarkState>()(
  persist(
    (set, get) => ({
      items: [],
      has: (id) => get().items.some((a) => a.id === id),
      toggle: (article) =>
        set((state) => {
          const exists = state.items.some((a) => a.id === article.id);
          return {
            items: exists
              ? state.items.filter((a) => a.id !== article.id)
              : [article, ...state.items].slice(0, 80),
          };
        }),
    }),
    { name: "shinpo-bookmarks" },
  ),
);
