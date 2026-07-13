import { useEffect, useMemo, useState } from "react";
import { Plus, Search, MoreVertical, Pencil, Trash2, Inbox, Circle } from "lucide-react";
import PageHeader from "../components/layout/PageHeader";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import DropdownMenu from "../components/ui/DropdownMenu";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import EmptyState from "../components/ui/EmptyState";
import DataTable, { type DataTableColumn } from "../components/tables/DataTable";
import OrderModal from "../components/modals/OrderModal";
import { useOrders } from "../hooks/useOrders";
import type { Order } from "../types/entities";
import styles from "./Orders.module.css";

const statusVariant: Record<Order["status"], "success" | "warning" | "danger" | "neutral"> = {
  paid: "success",
  pending: "warning",
  refunded: "neutral",
  failed: "danger",
};

const STATUS_OPTIONS: Order["status"][] = ["paid", "pending", "refunded", "failed"];
type StatusFilter = "all" | Order["status"];

const PAGE_SIZE = 8;

function Orders() {
  const { orders, deleteOrder, updateOrderStatus } = useOrders();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<Order | null>(null);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return orders
      .filter((order) => `${order.customer} ${order.id}`.toLowerCase().includes(search.toLowerCase()))
      .filter((order) => statusFilter === "all" || order.status === statusFilter);
  }, [orders, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const columns: DataTableColumn<Order>[] = [
    { key: "id", header: "Order", render: (row) => `#${row.id}` },
    { key: "customer", header: "Customer", render: (row) => row.customer },
    { key: "date", header: "Date", render: (row) => row.date },
    { key: "items", header: "Items", align: "right", render: (row) => row.items },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      render: (row) => `$${row.amount.toFixed(2)}`,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <DropdownMenu
          trigger={<Badge label={row.status} variant={statusVariant[row.status]} />}
          items={STATUS_OPTIONS.filter((status) => status !== row.status).map((status) => ({
            label: `Mark as ${status}`,
            icon: <Circle size={10} className={styles.statusDot} data-status={status} />,
            onClick: () => updateOrderStatus(row.id, status),
          }))}
        />
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (row) => (
        <DropdownMenu
          trigger={<MoreVertical size={16} />}
          items={[
            { label: "Edit", icon: <Pencil size={14} />, onClick: () => setEditingOrder(row) },
            {
              label: "Delete",
              icon: <Trash2 size={14} />,
              danger: true,
              onClick: () => setDeletingOrder(row),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <PageHeader
        title="Orders"
        description="All customer orders across your store."
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus size={16} />
            New order
          </Button>
        }
      />

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Search by customer or order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className={styles.select}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
        >
          <option value="all">All statuses</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="refunded">Refunded</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <Card padded={false}>
        {filtered.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No orders found"
            description="Try adjusting your search or filters, or create a new order."
            action={
              <Button variant="secondary" onClick={() => setCreateOpen(true)}>
                <Plus size={16} />
                New order
              </Button>
            }
          />
        ) : (
          <DataTable columns={columns} data={paginated} keyExtractor={(row) => row.id} />
        )}
      </Card>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageButton}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className={styles.pageInfo}>
            Page {page} of {totalPages}
          </span>
          <button
            className={styles.pageButton}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}

      <OrderModal isOpen={isCreateOpen} onClose={() => setCreateOpen(false)} />
      <OrderModal
        isOpen={Boolean(editingOrder)}
        onClose={() => setEditingOrder(null)}
        order={editingOrder}
      />
      <ConfirmDialog
        isOpen={Boolean(deletingOrder)}
        onClose={() => setDeletingOrder(null)}
        onConfirm={() => {
          if (deletingOrder) deleteOrder(deletingOrder.id);
        }}
        title="Delete order"
        message={`Delete order #${deletingOrder?.id}? This action cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
}

export default Orders;
