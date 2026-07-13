import { useCallback, useMemo, useState, type ReactNode } from "react";
import { appUsers as initialUsers } from "../data/mockData";
import type { AppUser } from "../types/entities";
import { useToast } from "../hooks/useToast";
import { UsersContext, type NewUserInput } from "./users-context";

function generateUserId(existing: AppUser[]): string {
  const numericIds = existing
    .map((user) => parseInt(user.id.replace("u", ""), 10))
    .filter((n) => !Number.isNaN(n));
  const next = (numericIds.length > 0 ? Math.max(...numericIds) : 0) + 1;
  return `u${next}`;
}

function todayFormatted() {
  return new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export function UsersProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<AppUser[]>(initialUsers);
  const { showToast } = useToast();

  const addUser = useCallback(
    (input: NewUserInput) => {
      const user: AppUser = {
        ...input,
        id: generateUserId(users),
        status: "invited",
        joinedAt: todayFormatted(),
      };
      setUsers((prev) => [user, ...prev]);
      showToast(`Invitation sent to ${user.email}`, "success");
      return user;
    },
    [users, showToast],
  );

  const deleteUser = useCallback(
    (id: string) => {
      setUsers((prev) => prev.filter((user) => user.id !== id));
      showToast("User removed", "error");
    },
    [showToast],
  );

  const updateUserStatus = useCallback(
    (id: string, status: AppUser["status"]) => {
      setUsers((prev) =>
        prev.map((user) => (user.id === id ? { ...user, status } : user)),
      );
      showToast(`User marked as ${status}`, "info");
    },
    [showToast],
  );

  const value = useMemo(
    () => ({ users, addUser, deleteUser, updateUserStatus }),
    [users, addUser, deleteUser, updateUserStatus],
  );

  return <UsersContext.Provider value={value}>{children}</UsersContext.Provider>;
}
