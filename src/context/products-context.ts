import { createContext } from "react";
import type { Product } from "../types/entities";

export type NewProductInput = Omit<Product, "id" | "favorite">;

export interface ProductsContextValue {
  products: Product[];
  addProduct: (input: NewProductInput) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleFavorite: (id: string) => void;
}

export const ProductsContext = createContext<ProductsContextValue | undefined>(
  undefined,
);
