export interface ContactFilters {
  starred: "all" | "starred" | "unstarred";
}

export const defaultContactFilters: ContactFilters = {
  starred: "all",
};
