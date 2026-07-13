import type { ComponentType, ReactNode } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";
import { ProjectsProvider } from "./context/ProjectsContext";
import { OrdersProvider } from "./context/OrdersContext";
import { ProductsProvider } from "./context/ProductsContext";
import { UsersProvider } from "./context/UsersContext";
import { WorkspacesProvider } from "./context/WorkspacesContext";
import { QuickItemsProvider } from "./context/QuickItemsContext";

// Order matters: earlier entries wrap later ones. ToastProvider must be
// available to every context below it since several call showToast().
const PROVIDERS: ComponentType<{ children: ReactNode }>[] = [
  ThemeProvider,
  ToastProvider,
  AuthProvider,
  ProjectsProvider,
  OrdersProvider,
  ProductsProvider,
  UsersProvider,
  WorkspacesProvider,
  QuickItemsProvider,
];

function AppProviders({ children }: { children: ReactNode }) {
  return PROVIDERS.reduceRight(
    (acc, Provider) => <Provider>{acc}</Provider>,
    children,
  );
}

export default AppProviders;
