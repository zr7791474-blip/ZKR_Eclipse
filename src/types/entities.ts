export interface Project {
  id: string;
  name: string;
  client: string;
  description?: string;
  framework?: string;
  category?: string;
  difficulty?: string;
  status: "active" | "completed" | "on-hold";
  priority: "low" | "medium" | "high";
  progress: number;
  dueDate: string;
  updatedAt: string;
  tags: string[];
  commentsCount: number;
  attachmentsCount: number;
  teamAvatars: string[];
  pinned: boolean;
  favorite: boolean;
  archived: boolean;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: "online" | "offline" | "away";
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  status: "active" | "invited" | "suspended";
  joinedAt: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "in-stock" | "low-stock" | "out-of-stock";
  rating: number;
  favorite: boolean;
}

export interface Order {
  id: string;
  customer: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "refunded" | "failed";
  items: number;
}

export interface ActivityItem {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
}

export interface ChartPoint {
  label: string;
  value: number;
}

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}
export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: string;
  read: boolean;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  members: number;
  createdAt: string;
}