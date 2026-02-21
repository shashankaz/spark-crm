import { createContext } from "react";
import type { User } from "@/types";

export interface UserContextType {
  user: User | null;
}

type UserProviderState = {
  user: UserContextType["user"];
};

const initialState: UserProviderState = {
  user: null,
};

export const UserContext = createContext<UserContextType>(initialState);
