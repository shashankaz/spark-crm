export type UserRoleFilter = "all" | "user" | "admin";

export interface UserFilters {
  role: UserRoleFilter;
}

export const defaultUserFilters: UserFilters = {
  role: "all",
};

export const ROLE_LABELS: Record<UserRoleFilter, string> = {
  all: "All roles",
  user: "User",
  admin: "Admin",
};
