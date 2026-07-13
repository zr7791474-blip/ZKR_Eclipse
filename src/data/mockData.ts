import type {
  Project,
  TeamMember,
  AppUser,
  Product,
  Order,
  ActivityItem,
  ChartPoint,
  NotificationItem,
  Workspace,
} from "../types/entities";

export const initialProjects: Project[] = [
  { id: "p1", name: "Atlas Rebrand", client: "Atlas Studio", category: "Branding", tags: ["design", "identity"], status: "active", priority: "high", progress: 72, dueDate: "Aug 14", updatedAt: "2026-07-08", commentsCount: 12, attachmentsCount: 6, teamAvatars: ["/zkr.jpg", "/zkr.jpg", "/zkr.jpg"], pinned: true, favorite: true, archived: false, createdAt: "2026-06-01" },
  { id: "p2", name: "Nimbus Mobile App", client: "Nimbus Inc.", category: "Mobile", tags: ["react-native", "ios", "android"], status: "active", priority: "medium", progress: 45, dueDate: "Sep 02", updatedAt: "2026-07-07", commentsCount: 8, attachmentsCount: 3, teamAvatars: ["/zkr.jpg", "/zkr.jpg"], pinned: false, favorite: false, archived: false, createdAt: "2026-06-04" },
  { id: "p3", name: "Vertex Dashboard", client: "Vertex Labs", category: "Web App", tags: ["analytics", "saas"], status: "on-hold", priority: "low", progress: 30, dueDate: "Sep 20", updatedAt: "2026-07-01", commentsCount: 3, attachmentsCount: 1, teamAvatars: ["/zkr.jpg"], pinned: false, favorite: false, archived: false, createdAt: "2026-06-10" },
  { id: "p4", name: "Halcyon Landing Page", client: "Halcyon Co.", category: "Marketing", tags: ["landing", "copywriting"], status: "completed", priority: "medium", progress: 100, dueDate: "Jun 28", updatedAt: "2026-06-27", commentsCount: 20, attachmentsCount: 9, teamAvatars: ["/zkr.jpg", "/zkr.jpg"], pinned: false, favorite: true, archived: false, createdAt: "2026-05-20" },
  { id: "p5", name: "Forge Design System", client: "Forge Digital", category: "Design System", tags: ["components", "tokens"], status: "active", priority: "high", progress: 58, dueDate: "Oct 05", updatedAt: "2026-07-09", commentsCount: 15, attachmentsCount: 11, teamAvatars: ["/zkr.jpg", "/zkr.jpg", "/zkr.jpg"], pinned: false, favorite: false, archived: false, createdAt: "2026-06-15" },
  { id: "p6", name: "Lumen Onboarding", client: "Lumen Health", category: "UX Research", tags: ["onboarding", "research"], status: "on-hold", priority: "low", progress: 12, dueDate: "Oct 18", updatedAt: "2026-06-30", commentsCount: 2, attachmentsCount: 0, teamAvatars: ["/zkr.jpg"], pinned: false, favorite: false, archived: false, createdAt: "2026-06-20" },
];

export const teamMembers: TeamMember[] = [
  { id: "u1", name: "Sara Ahmed", role: "Product Designer", avatar: "/zkr.jpg", status: "online" },
  { id: "u2", name: "Yassine Karim", role: "Frontend Engineer", avatar: "/zkr.jpg", status: "online" },
  { id: "u3", name: "Lina Torres", role: "Backend Engineer", avatar: "/zkr.jpg", status: "away" },
  { id: "u4", name: "Omar Belkacem", role: "Project Manager", avatar: "/zkr.jpg", status: "offline" },
  { id: "u5", name: "Nora Fassi", role: "QA Engineer", avatar: "/zkr.jpg", status: "online" },
  { id: "u6", name: "Adam Chraibi", role: "DevOps Engineer", avatar: "/zkr.jpg", status: "away" },
];

export const appUsers: AppUser[] = [
  { id: "a1", name: "Sara Ahmed", email: "sara@zkr.dev", role: "admin", status: "active", joinedAt: "Jan 12, 2025" },
  { id: "a2", name: "Yassine Karim", email: "yassine@zkr.dev", role: "editor", status: "active", joinedAt: "Feb 03, 2025" },
  { id: "a3", name: "Lina Torres", email: "lina@zkr.dev", role: "viewer", status: "invited", joinedAt: "Mar 21, 2025" },
  { id: "a4", name: "Omar Belkacem", email: "omar@zkr.dev", role: "editor", status: "suspended", joinedAt: "Apr 09, 2025" },
  { id: "a5", name: "Nora Fassi", email: "nora@zkr.dev", role: "viewer", status: "active", joinedAt: "May 17, 2025" },
];

export const products: Product[] = [
  { id: "pr1", name: "Aurora Desk Lamp", category: "Lighting", price: 89, stock: 124, status: "in-stock", rating: 4.6, favorite: true },
  { id: "pr2", name: "Nimbus Office Chair", category: "Furniture", price: 349, stock: 8, status: "low-stock", rating: 4.2, favorite: false },
  { id: "pr3", name: "Forge Mechanical Keyboard", category: "Electronics", price: 159, stock: 0, status: "out-of-stock", rating: 4.8, favorite: true },
  { id: "pr4", name: "Halo Monitor Stand", category: "Accessories", price: 59, stock: 76, status: "in-stock", rating: 4.0, favorite: false },
  { id: "pr5", name: "Drift Standing Desk", category: "Furniture", price: 599, stock: 14, status: "low-stock", rating: 4.5, favorite: false },
];

export const orders: Order[] = [
  { id: "10234", customer: "Sara Ahmed", date: "Jul 04, 2026", amount: 249, status: "paid", items: 3 },
  { id: "10235", customer: "Yassine Karim", date: "Jul 04, 2026", amount: 89, status: "pending", items: 1 },
  { id: "10236", customer: "Lina Torres", date: "Jul 03, 2026", amount: 599, status: "paid", items: 1 },
  { id: "10237", customer: "Omar Belkacem", date: "Jul 02, 2026", amount: 159, status: "failed", items: 2 },
  { id: "10238", customer: "Nora Fassi", date: "Jul 01, 2026", amount: 118, status: "refunded", items: 2 },
  { id: "10239", customer: "Adam Chraibi", date: "Jun 30, 2026", amount: 349, status: "paid", items: 1 },
];

export const recentActivity: ActivityItem[] = [
  { id: "ac1", actor: "Sara Ahmed", action: "updated the progress on", target: "Atlas Rebrand", timestamp: "10 min ago" },
  { id: "ac2", actor: "Yassine Karim", action: "merged a pull request in", target: "Forge Design System", timestamp: "42 min ago" },
  { id: "ac3", actor: "Omar Belkacem", action: "closed order", target: "#10236", timestamp: "1 hr ago" },
  { id: "ac4", actor: "Nora Fassi", action: "invited a new member to", target: "Workspace", timestamp: "3 hrs ago" },
  { id: "ac5", actor: "Lina Torres", action: "flagged low stock on", target: "Nimbus Office Chair", timestamp: "5 hrs ago" },
];

export const revenueByMonth: ChartPoint[] = [
  { label: "Jan", value: 32 },
  { label: "Feb", value: 41 },
  { label: "Mar", value: 38 },
  { label: "Apr", value: 52 },
  { label: "May", value: 47 },
  { label: "Jun", value: 61 },
  { label: "Jul", value: 58 },
];

export const visitorsByDay: ChartPoint[] = [
  { label: "Mon", value: 210 },
  { label: "Tue", value: 260 },
  { label: "Wed", value: 240 },
  { label: "Thu", value: 310 },
  { label: "Fri", value: 290 },
  { label: "Sat", value: 180 },
  { label: "Sun", value: 150 },
];

export const projects = initialProjects;

export const notifications: NotificationItem[] = [
  {
    id: "n1",
    title: "New order received",
    message: "Order #4821 was placed by Nimbus Inc.",
    type: "success",
    timestamp: "2 min ago",
    read: false,
  },
  {
    id: "n2",
    title: "Server deployment succeeded",
    message: "Production deployment finished with no errors",
    type: "success",
    timestamp: "1 hour ago",
    read: false,
  },
  {
    id: "n3",
    title: "Storage nearing limit",
    message: "Your workspace is at 82% of its storage quota",
    type: "warning",
    timestamp: "3 hours ago",
    read: false,
  },
  {
    id: "n4",
    title: "Payment failed",
    message: "The card on file for Halcyon Co. was declined",
    type: "error",
    timestamp: "5 hours ago",
    read: true,
  },
  {
    id: "n5",
    title: "Project updated",
    message: "Atlas Rebrand progress was updated to 72%",
    type: "info",
    timestamp: "Yesterday",
    read: true,
  },
  {
    id: "n6",
    title: "New team member",
    message: "Priya Nair joined the workspace",
    type: "info",
    timestamp: "2 days ago",
    read: true,
  },
];

export const workspaces: Workspace[] = [
  {
    id: "w1",
    name: "ZKR Eclipse",
    description: "Main workspace",
    members: 6,
    createdAt: "2026-01-01",
  },
];