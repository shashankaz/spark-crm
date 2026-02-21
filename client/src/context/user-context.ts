import { createContext } from "react";
import type { User } from "@/types";

export interface UserContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

type UserProviderState = {
  user: UserContextType["user"];
  loading: boolean;
  setUser: UserContextType["setUser"];
  clearUser: UserContextType["clearUser"];
};

const initialState: UserProviderState = {
  user: null,
  loading: true,
  setUser: () => {},
  clearUser: () => {},
};

export const UserContext = createContext<UserContextType>(
  initialState as UserContextType,
);
