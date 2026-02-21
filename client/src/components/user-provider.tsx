import React, { useEffect, useState } from "react";

import { UserContext } from "@/context/user-context";
import type { User } from "@/types";

import { getProfile } from "@/api/services/auth.service";

type UserProviderProps = {
  children: React.ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getProfile()
      .then((response) => setUser(response.user))
      .catch(() => setUser(null));
  }, []);

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};
