import { useCallback, useMemo, useState, type ReactNode } from "react";
import { orders as initialOrders } from "../data/mockData";
import type { Order } from "../types/entities";
import { useToast } from "../hooks/useToast";
import { OrdersContext, type NewOrderInput } from "./orders-context";

function generateOrderId(existing: Order[]): string {
  const numericIds = existing
    .map((order) => parseInt(order.id, 10))
    .filter((n) => !Number.isNaN(n));
  const next = (numericIds.length > 0 ? Math.max(...numericIds) : 10000) + 1;
  return String(next);
}

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const { showToast } = useToast();

  const addOrder = useCallback(
    (input: NewOrderInput) => {
      const order: Order = { ...input, id: generateOrderId(orders) };
      setOrders((prev) => [order, ...prev]);
      showToast(`Order #${order.id} created`, "success");
      return order;
    },
    [orders, showToast],
  );

  const updateOrder = useCallback(
    (id: string, updates: Partial<Order>) => {
      setOrders((prev) =>
        prev.map((order) => (order.id === id ? { ...order, ...updates } : order)),
      );
      showToast(`Order #${id} updated`, "success");
    },
    [showToast],
  );

  const deleteOrder = useCallback(
    (id: string) => {
      setOrders((prev) => prev.filter((order) => order.id !== id));
      showToast(`Order #${id} deleted`, "error");
    },
    [showToast],
  );

  const updateOrderStatus = useCallback(
    (id: string, status: Order["status"]) => {
      setOrders((prev) =>
        prev.map((order) => (order.id === id ? { ...order, status } : order)),
      );
      showToast(`Order #${id} marked as ${status}`, "info");
    },
    [showToast],
  );

  const value = useMemo(
    () => ({ orders, addOrder, updateOrder, deleteOrder, updateOrderStatus }),
    [orders, addOrder, updateOrder, deleteOrder, updateOrderStatus],
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}
