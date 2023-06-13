"use client";

import { User } from "@/types/api";
import axios, { HttpStatusCode } from "axios";
import React, { createContext, useContext, useState } from "react";

type AuthContextInterface = {
  connectedUser: User | null;
  login: (email: string) => Promise<User>;
  logout: () => void;
};

const AuthContext = createContext({} as AuthContextInterface);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [connectedUser, setUser] = useState<User | null>(null);

  const login = async (email: string) => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/users/email/${email}`,
    );

    if (response.status === HttpStatusCode.Ok) {
      setUser(response.data);
      return response.data;
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        connectedUser,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;
