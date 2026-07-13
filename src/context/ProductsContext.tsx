import { useCallback, useMemo, useState, type ReactNode } from "react";
import { products as initialProducts } from "../data/mockData";
import type { Product } from "../types/entities";
import { useToast } from "../hooks/useToast";
import { ProductsContext, type NewProductInput } from "./products-context";

function generateProductId(existing: Product[]): string {
  const numericIds = existing
    .map((product) => parseInt(product.id.replace("pr", ""), 10))
    .filter((n) => !Number.isNaN(n));
  const next = (numericIds.length > 0 ? Math.max(...numericIds) : 0) + 1;
  return `pr${next}`;
}

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const { showToast } = useToast();

  const addProduct = useCallback(
    (input: NewProductInput) => {
      const product: Product = {
        ...input,
        id: generateProductId(products),
        favorite: false,
      };
      setProducts((prev) => [product, ...prev]);
      showToast(`"${product.name}" added to catalog`, "success");
      return product;
    },
    [products, showToast],
  );

  const updateProduct = useCallback(
    (id: string, updates: Partial<Product>) => {
      setProducts((prev) =>
        prev.map((product) => (product.id === id ? { ...product, ...updates } : product)),
      );
      showToast("Product updated", "success");
    },
    [showToast],
  );

  const deleteProduct = useCallback(
    (id: string) => {
      setProducts((prev) => prev.filter((product) => product.id !== id));
      showToast("Product deleted", "error");
    },
    [showToast],
  );

  const toggleFavorite = useCallback((id: string) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, favorite: !product.favorite } : product,
      ),
    );
  }, []);

  const value = useMemo(
    () => ({ products, addProduct, updateProduct, deleteProduct, toggleFavorite }),
    [products, addProduct, updateProduct, deleteProduct, toggleFavorite],
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}
