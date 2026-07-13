import { createContext } from "react";

export type QuickItemType = "task" | "report" | "team" | "folder" | "note";

export interface QuickItem {
  id: string;
  type: QuickItemType;
  title: string;
  detail?: string;
  createdAt: string;
}

export type NewQuickItemInput = Omit<QuickItem, "id" | "createdAt">;

export interface QuickItemsContextValue {
  items: QuickItem[];
  addItem: (input: NewQuickItemInput) => QuickItem;
  deleteItem: (id: string) => void;
}

export const QuickItemsContext = createContext<QuickItemsContextValue | undefined>(
  undefined,
);
