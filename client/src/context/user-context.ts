import { createContext } from "react";
import type { User } from "@/types";

export interface UserContextType {
  user: User | null;
  loading: boolean;
}

type UserProviderState = {
  user: UserContextType["user"];
  loading: boolean;
};

const initialState: UserProviderState = {
  user: null,
  loading: true,
};

export const UserContext = createContext<UserContextType>(initialState as UserContextType);
