import { useCallback, useMemo, useState, type ReactNode } from "react";
import { useToast } from "../hooks/useToast";
import {
  QuickItemsContext,
  type QuickItem,
  type NewQuickItemInput,
} from "./quick-items-context";

let counter = 0;

export function QuickItemsProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<QuickItem[]>([]);
  const { showToast } = useToast();

  const addItem = useCallback(
    (input: NewQuickItemInput) => {
      counter += 1;
      const item: QuickItem = {
        ...input,
        id: `qi-${Date.now()}-${counter}`,
        createdAt: new Date().toISOString(),
      };
      setItems((prev) => [item, ...prev]);
      showToast(`"${item.title}" created`, "success");
      return item;
    },
    [showToast],
  );

  const deleteItem = useCallback(
    (id: string) => {
      setItems((prev) => prev.filter((item) => item.id !== id));
      showToast("Item deleted", "error");
    },
    [showToast],
  );

  const value = useMemo(() => ({ items, addItem, deleteItem }), [items, addItem, deleteItem]);

  return (
    <QuickItemsContext.Provider value={value}>{children}</QuickItemsContext.Provider>
  );
}
