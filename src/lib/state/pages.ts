import { proxy } from "valtio";

export type Page = "home" | "leaderboard" | "avatar" | "chat";

export const pages = proxy({
  current: "home" as Page,
  opened: true,
});

export const setCurrentPage = (page: Page) => {
  pages.current = page;
  if (!pages.opened) {
    pages.opened = true;
  }
};

export const togglePage = () => {
  pages.opened = !pages.opened;
};
