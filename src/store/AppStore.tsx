import { createContext, useMemo, useState, type ReactNode } from "react";
import type React from "react";
import { appUsers, notifications as seedNotifications, orders as seedOrders, projects as seedProjects, products as seedProducts, recentActivity, teamMembers, workspaces } from "../data/mockData";
import type { NotificationItem, Order, Product, Project, Workspace, AppUser, ActivityItem, TeamMember } from "../types/entities";

export interface AppStoreValue {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  notifications: NotificationItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
  workspaces: Workspace[];
  users: AppUser[];
  activities: ActivityItem[];
  members: TeamMember[];
}

export const AppStoreContext = createContext<AppStoreValue | undefined>(undefined);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState(seedProjects);
  const [orders, setOrders] = useState(seedOrders);
  const [products, setProducts] = useState(seedProducts);
  const [notifications, setNotifications] = useState(seedNotifications);

  const value = useMemo(
    () => ({
      projects,
      setProjects,
      orders,
      setOrders,
      products,
      setProducts,
      notifications,
      setNotifications,
      workspaces,
      users: appUsers,
      activities: recentActivity,
      members: teamMembers,
    }),
    [projects, orders, products, notifications],
  );

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}