import { createContext } from "react";
import type { AppUser } from "../types/entities";

export type NewUserInput = Omit<AppUser, "id" | "joinedAt" | "status">;

export interface UsersContextValue {
  users: AppUser[];
  addUser: (input: NewUserInput) => AppUser;
  deleteUser: (id: string) => void;
  updateUserStatus: (id: string, status: AppUser["status"]) => void;
}

export const UsersContext = createContext<UsersContextValue | undefined>(
  undefined,
);
