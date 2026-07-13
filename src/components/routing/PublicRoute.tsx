import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ROLE_REDIRECTS } from "../../types/auth";

function PublicRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user) {
    return <Navigate to={ROLE_REDIRECTS[user.role]} replace />;
  }

  return <>{children}</>;
}

export default PublicRoute;
