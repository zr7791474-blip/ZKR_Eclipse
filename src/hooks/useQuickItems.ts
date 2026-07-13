import { useContext } from "react";
import { QuickItemsContext } from "../context/quick-items-context";

export function useQuickItems() {
  const context = useContext(QuickItemsContext);
  if (!context) throw new Error("useQuickItems must be used within a QuickItemsProvider");
  return context;
}
