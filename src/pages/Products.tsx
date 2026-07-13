import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Star,
  Heart,
  MoreVertical,
  Pencil,
  Trash2,
  LayoutGrid,
  List,
  Lightbulb,
  Armchair,
  Keyboard,
  Package,
  Inbox,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import PageHeader from "../components/layout/PageHeader";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import DropdownMenu from "../components/ui/DropdownMenu";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import EmptyState from "../components/ui/EmptyState";
import DataTable, { type DataTableColumn } from "../components/tables/DataTable";
import ProductModal from "../components/modals/ProductModal";
import { useProducts } from "../hooks/useProducts";
import type { Product } from "../types/entities";
import styles from "./Products.module.css";

const statusVariant: Record<Product["status"], "success" | "warning" | "danger"> = {
  "in-stock": "success",
  "low-stock": "warning",
  "out-of-stock": "danger",
};

const CATEGORY_ICONS: Record<string, typeof Package> = {
  Lighting: Lightbulb,
  Furniture: Armchair,
  Electronics: Keyboard,
  Accessories: Package,
};

const CATEGORY_GRADIENTS = [
  "linear-gradient(135deg, rgba(22,138,173,0.9), rgba(30,96,145,0.55))",
  "linear-gradient(135deg, rgba(52,160,164,0.85), rgba(22,138,173,0.4))",
  "linear-gradient(135deg, rgba(118,200,147,0.85), rgba(52,160,164,0.35))",
  "linear-gradient(135deg, rgba(153,217,140,0.8), rgba(217,237,146,0.3))",
  "linear-gradient(135deg, rgba(26,117,159,0.85), rgba(24,78,119,0.5))",
];

function gradientForCategory(category: string) {
  let hash = 0;
  for (let i = 0; i < category.length; i++) hash = (hash + category.charCodeAt(i)) % CATEGORY_GRADIENTS.length;
  return CATEGORY_GRADIENTS[hash];
}

type ViewMode = "grid" | "list";
type StatusFilter = "all" | Product["status"];
type SortKey = "name" | "price" | "stock" | "rating";

const PAGE_SIZE_GRID = 8;
const PAGE_SIZE_LIST = 10;

function Products() {
  const { products, deleteProduct, toggleFavorite } = useProducts();
  const [view, setView] = useState<ViewMode>("grid");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [page, setPage] = useState(1);

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort(),
    [products],
  );

  const filtered = useMemo(() => {
    return products
      .filter((p) => `${p.name} ${p.category}`.toLowerCase().includes(search.toLowerCase()))
      .filter((p) => category === "all" || p.category === category)
      .filter((p) => statusFilter === "all" || p.status === statusFilter)
      .sort((a, b) => {
        if (a.favorite !== b.favorite) return a.favorite ? -1 : 1;
        if (sortKey === "price") return b.price - a.price;
        if (sortKey === "stock") return b.stock - a.stock;
        if (sortKey === "rating") return b.rating - a.rating;
        return a.name.localeCompare(b.name);
      });
  }, [products, search, category, statusFilter, sortKey]);

  const pageSize = view === "grid" ? PAGE_SIZE_GRID : PAGE_SIZE_LIST;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage(1);
  }, [search, category, statusFilter, sortKey, view]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const columns: DataTableColumn<Product>[] = [
    { key: "name", header: "Product", render: (row) => row.name },
    { key: "category", header: "Category", render: (row) => row.category },
    { key: "price", header: "Price", align: "right", render: (row) => `$${row.price.toFixed(2)}` },
    { key: "stock", header: "Stock", align: "right", render: (row) => row.stock },
    {
      key: "rating",
      header: "Rating",
      render: (row) => (
        <span className={styles.inlineRating}>
          <Star size={13} className={styles.starIcon} data-filled="true" />
          {row.rating.toFixed(1)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge label={row.status.replace("-", " ")} variant={statusVariant[row.status]} />
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
            { label: "Edit", icon: <Pencil size={14} />, onClick: () => setEditingProduct(row) },
            {
              label: row.favorite ? "Unfavorite" : "Favorite",
              icon: <Heart size={14} />,
              onClick: () => toggleFavorite(row.id),
            },
            {
              label: "Delete",
              icon: <Trash2 size={14} />,
              danger: true,
              onClick: () => setDeletingProduct(row),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <PageHeader
        title="Products"
        description="Catalog and inventory overview."
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus size={16} />
            Add product
          </Button>
        }
      />

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select className={styles.select} value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          className={styles.select}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
        >
          <option value="all">All statuses</option>
          <option value="in-stock">In stock</option>
          <option value="low-stock">Low stock</option>
          <option value="out-of-stock">Out of stock</option>
        </select>

        <select className={styles.select} value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)}>
          <option value="name">Sort by name</option>
          <option value="price">Sort by price</option>
          <option value="stock">Sort by stock</option>
          <option value="rating">Sort by rating</option>
        </select>

        <div className={styles.viewToggle}>
          <button
            className={styles.viewButton}
            data-active={view === "grid" || undefined}
            onClick={() => setView("grid")}
            aria-label="Grid view"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            className={styles.viewButton}
            data-active={view === "list" || undefined}
            onClick={() => setView("list")}
            aria-label="List view"
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className={styles.emptyWrap}>
          <EmptyState
            icon={Inbox}
            title="No products found"
            description="Try adjusting your search or filters, or add a new product."
            action={
              <Button variant="secondary" onClick={() => setCreateOpen(true)}>
                <Plus size={16} />
                Add product
              </Button>
            }
          />
        </div>
      ) : view === "list" ? (
        <Card padded={false}>
          <DataTable columns={columns} data={paginated} keyExtractor={(row) => row.id} />
        </Card>
      ) : (
        <div className={styles.grid}>
          {paginated.map((product, index) => {
            const CategoryIcon = CATEGORY_ICONS[product.category] ?? Package;
            return (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03, duration: 0.25, ease: "easeOut" }}
              >
                <Card className={styles.productCard}>
                  <div
                    className={styles.imageTile}
                    style={{ background: gradientForCategory(product.category) }}
                  >
                    <CategoryIcon size={32} className={styles.imageIcon} />
                    <span className={styles.categoryBadge}>{product.category}</span>
                    <button
                      className={styles.favoriteButton}
                      data-active={product.favorite || undefined}
                      onClick={() => toggleFavorite(product.id)}
                      aria-label={product.favorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Heart size={15} />
                    </button>
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.cardTop}>
                      <h3 className={styles.productName}>{product.name}</h3>
                      <DropdownMenu
                        trigger={<MoreVertical size={16} />}
                        items={[
                          { label: "Edit", icon: <Pencil size={14} />, onClick: () => setEditingProduct(product) },
                          {
                            label: "Delete",
                            icon: <Trash2 size={14} />,
                            danger: true,
                            onClick: () => setDeletingProduct(product),
                          },
                        ]}
                      />
                    </div>

                    <div className={styles.ratingRow}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={13}
                          className={styles.starIcon}
                          data-filled={i < Math.round(product.rating) || undefined}
                        />
                      ))}
                      <span className={styles.ratingValue}>{product.rating.toFixed(1)}</span>
                    </div>

                    <div className={styles.cardFooter}>
                      <span className={styles.price}>${product.price.toFixed(2)}</span>
                      <Badge
                        label={product.status.replace("-", " ")}
                        variant={statusVariant[product.status]}
                      />
                    </div>
                    <p className={styles.stockText}>{product.stock} in stock</p>

                    <div className={styles.quickActions}>
                      <Button
                        variant="secondary"
                        className={styles.quickActionButton}
                        onClick={() => setEditingProduct(product)}
                      >
                        <Pencil size={14} />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        className={styles.quickActionButton}
                        onClick={() => setDeletingProduct(product)}
                      >
                        <Trash2 size={14} />
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {filtered.length > 0 && totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageButton}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>
          <span className={styles.pageInfo}>
            Page {page} of {totalPages}
          </span>
          <button
            className={styles.pageButton}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      <ProductModal isOpen={isCreateOpen} onClose={() => setCreateOpen(false)} />
      <ProductModal
        isOpen={Boolean(editingProduct)}
        onClose={() => setEditingProduct(null)}
        product={editingProduct}
      />
      <ConfirmDialog
        isOpen={Boolean(deletingProduct)}
        onClose={() => setDeletingProduct(null)}
        onConfirm={() => {
          if (deletingProduct) deleteProduct(deletingProduct.id);
        }}
        title="Delete product"
        message={`Delete "${deletingProduct?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
}

export default Products;
