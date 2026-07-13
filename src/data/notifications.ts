export interface NotificationItem {
  id: string;
  title: string;
  detail: string;
  read: boolean;
}

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { id: "n1", title: "New order received", detail: "Order #4821 · 2 min ago", read: false },
  { id: "n2", title: "Server deployment succeeded", detail: "Production · 1 hr ago", read: false },
  { id: "n3", title: "New team member joined", detail: "Priya Nair joined Workspace · 3 hrs ago", read: false },
  { id: "n4", title: "Weekly report is ready", detail: "Analytics · Yesterday", read: true },
  { id: "n5", title: "Billing invoice paid", detail: "Invoice #2291 · 2 days ago", read: true },
];
