import React from "react";

interface AuthContextType {
  token: string | null;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export default AuthContext;
