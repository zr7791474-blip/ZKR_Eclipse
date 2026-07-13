import { useEffect, useState } from "react";
import type React from "react";
import Modal from "../ui/Modal";
import FormField from "../ui/FormField";
import Button from "../ui/Button";
import { useProducts } from "../../hooks/useProducts";
import type { Product } from "../../types/entities";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
}

const EMPTY_FORM = {
  name: "",
  category: "",
  price: "",
  stock: "",
  status: "in-stock" as Product["status"],
  rating: "4.5",
};

function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
  const { addProduct, updateProduct } = useProducts();
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const isEditing = Boolean(product);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        category: product.category,
        price: String(product.price),
        stock: String(product.stock),
        status: product.status,
        rating: String(product.rating),
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setError(null);
  }, [product, isOpen]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Product name is required.");
      return;
    }
    const price = Number(form.price);
    if (!Number.isFinite(price) || price < 0) {
      setError("Enter a valid price.");
      return;
    }
    const stock = parseInt(form.stock, 10);
    if (!Number.isFinite(stock) || stock < 0) {
      setError("Enter a valid stock count.");
      return;
    }
    const rating = Number(form.rating);
    if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
      setError("Rating must be between 0 and 5.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      category: form.category.trim() || "General",
      price,
      stock,
      status: form.status,
      rating,
    };

    if (isEditing && product) {
      updateProduct(product.id, payload);
    } else {
      addProduct(payload);
    }
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Edit product" : "New product"}>
      <form onSubmit={handleSubmit} noValidate>
        <FormField label="Product name" htmlFor="product-name">
          <input
            id="product-name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Aurora Desk Lamp"
            required
          />
        </FormField>

        <FormField label="Category" htmlFor="product-category">
          <input
            id="product-category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            placeholder="e.g. Lighting"
          />
        </FormField>

        <FormField label="Price ($)" htmlFor="product-price">
          <input
            id="product-price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
        </FormField>

        <FormField label="Stock" htmlFor="product-stock">
          <input
            id="product-stock"
            type="number"
            min="0"
            step="1"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            required
          />
        </FormField>

        <FormField label="Status" htmlFor="product-status">
          <select
            id="product-status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as Product["status"] })}
          >
            <option value="in-stock">In stock</option>
            <option value="low-stock">Low stock</option>
            <option value="out-of-stock">Out of stock</option>
          </select>
        </FormField>

        <FormField label="Rating (0–5)" htmlFor="product-rating">
          <input
            id="product-rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={form.rating}
            onChange={(e) => setForm({ ...form, rating: e.target.value })}
          />
        </FormField>

        {error && (
          <p style={{ color: "var(--color-danger)", fontSize: "var(--fs-sm)", marginBottom: "var(--space-4)" }}>
            {error}
          </p>
        )}

        <Button type="submit" style={{ width: "100%", justifyContent: "center" }}>
          {isEditing ? "Save changes" : "Create product"}
        </Button>
      </form>
    </Modal>
  );
}

export default ProductModal;
