import { useEffect, useState } from "react";
import type React from "react";
import Modal from "../ui/Modal";
import FormField from "../ui/FormField";
import Button from "../ui/Button";
import { useOrders } from "../../hooks/useOrders";
import type { Order } from "../../types/entities";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order?: Order | null;
}

function todayFormatted() {
  return new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

const EMPTY_FORM = {
  customer: "",
  amount: "",
  items: "1",
  status: "pending" as Order["status"],
  date: todayFormatted(),
};

function OrderModal({ isOpen, onClose, order }: OrderModalProps) {
  const { addOrder, updateOrder } = useOrders();
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const isEditing = Boolean(order);

  useEffect(() => {
    if (order) {
      setForm({
        customer: order.customer,
        amount: String(order.amount),
        items: String(order.items),
        status: order.status,
        date: order.date,
      });
    } else {
      setForm({ ...EMPTY_FORM, date: todayFormatted() });
    }
    setError(null);
  }, [order, isOpen]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!form.customer.trim()) {
      setError("Customer name is required.");
      return;
    }
    const amount = Number(form.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Enter a valid order amount.");
      return;
    }
    const items = parseInt(form.items, 10);
    if (!Number.isFinite(items) || items <= 0) {
      setError("Enter a valid item count.");
      return;
    }

    const payload = {
      customer: form.customer.trim(),
      amount,
      items,
      status: form.status,
      date: form.date,
    };

    if (isEditing && order) {
      updateOrder(order.id, payload);
    } else {
      addOrder(payload);
    }
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Edit order" : "New order"}>
      <form onSubmit={handleSubmit} noValidate>
        <FormField label="Customer" htmlFor="order-customer">
          <input
            id="order-customer"
            value={form.customer}
            onChange={(e) => setForm({ ...form, customer: e.target.value })}
            placeholder="e.g. Sara Ahmed"
            required
          />
        </FormField>

        <FormField label="Amount ($)" htmlFor="order-amount">
          <input
            id="order-amount"
            type="number"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            placeholder="e.g. 249"
            required
          />
        </FormField>

        <FormField label="Items" htmlFor="order-items">
          <input
            id="order-items"
            type="number"
            min="1"
            step="1"
            value={form.items}
            onChange={(e) => setForm({ ...form, items: e.target.value })}
            required
          />
        </FormField>

        <FormField label="Status" htmlFor="order-status">
          <select
            id="order-status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as Order["status"] })}
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="refunded">Refunded</option>
            <option value="failed">Failed</option>
          </select>
        </FormField>

        {error && (
          <p style={{ color: "var(--color-danger)", fontSize: "var(--fs-sm)", marginBottom: "var(--space-4)" }}>
            {error}
          </p>
        )}

        <Button type="submit" style={{ width: "100%", justifyContent: "center" }}>
          {isEditing ? "Save changes" : "Create order"}
        </Button>
      </form>
    </Modal>
  );
}

export default OrderModal;
