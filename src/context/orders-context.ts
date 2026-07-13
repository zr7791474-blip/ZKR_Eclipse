import { createContext } from "react";
import type { Order } from "../types/entities";

export type NewOrderInput = Omit<Order, "id">;

export interface OrdersContextValue {
  orders: Order[];
  addOrder: (input: NewOrderInput) => Order;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
}

export const OrdersContext = createContext<OrdersContextValue | undefined>(
  undefined,
);
