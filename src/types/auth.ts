export type UserRole = "admin" | "manager" | "analyst" | "viewer";

export interface AuthUser {
  name: string;
  email: string;
  role: UserRole;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Administrator",
  manager: "Manager",
  analyst: "Analyst",
  viewer: "Viewer",
};

export const ROLE_REDIRECTS: Record<UserRole, string> = {
  admin: "/dashboard",
  manager: "/projects",
  analyst: "/dashboard",
  viewer: "/workspace",
};

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<AuthUser>;
  logout: () => void;
}
