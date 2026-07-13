import { createContext } from "react";
import type { AuthContextValue, AuthUser } from "../types/auth";

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

export const DEMO_ACCOUNTS: Array<{
  email: string;
  password: string;
  user: AuthUser;
}> = [
  {
    email: "admin@zkreclipse.com",
    password: "Admin123",
    user: { name: "Alex Morgan", email: "admin@zkreclipse.com", role: "admin" },
  },
  {
    email: "manager@zkreclipse.com",
    password: "Manager123",
    user: { name: "Jamie Chen", email: "manager@zkreclipse.com", role: "manager" },
  },
  {
    email: "analyst@zkreclipse.com",
    password: "Analyst123",
    user: { name: "Priya Nair", email: "analyst@zkreclipse.com", role: "analyst" },
  },
  {
    email: "viewer@zkreclipse.com",
    password: "Viewer123",
    user: { name: "Sam Ortiz", email: "viewer@zkreclipse.com", role: "viewer" },
  },
];
