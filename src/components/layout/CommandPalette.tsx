import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  FolderKanban,
  Building2,
  Users,
  Package,
  ShoppingCart,
  Settings,
  BarChart3,
  Search,
  CornerDownLeft,
} from "lucide-react";
import { projects, appUsers, products, orders } from "../../data/mockData";
import styles from "./CommandPalette.module.css";

const PAGE_COMMANDS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/workspace", label: "Workspace", icon: Building2 },
  { to: "/users", label: "Users", icon: Users },
  { to: "/products", label: "Products", icon: Package },
  { to: "/orders", label: "Orders", icon: ShoppingCart },
  { to: "/settings", label: "Settings", icon: Settings },
];

interface ResultItem {
  key: string;
  to: string;
  label: string;
  sublabel?: string;
  icon: typeof LayoutDashboard;
  group: string;
}

const PAGE_RESULTS: ResultItem[] = PAGE_COMMANDS.map((command) => ({
  key: `page-${command.to}`,
  to: command.to,
  label: command.label,
  icon: command.icon,
  group: "Pages",
}));

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const results = useMemo<ResultItem[]>(() => {
    const q = query.trim().toLowerCase();

    if (!q) return PAGE_RESULTS;

    const pageMatches = PAGE_RESULTS.filter((item) =>
      item.label.toLowerCase().includes(q),
    );

    const projectMatches: ResultItem[] = projects
      .filter((p) => `${p.name} ${p.client}`.toLowerCase().includes(q))
      .slice(0, 4)
      .map((p) => ({
        key: `project-${p.id}`,
        to: "/projects",
        label: p.name,
        sublabel: p.client,
        icon: FolderKanban,
        group: "Projects",
      }));

    const userMatches: ResultItem[] = appUsers
      .filter((u) => `${u.name} ${u.email}`.toLowerCase().includes(q))
      .slice(0, 4)
      .map((u) => ({
        key: `user-${u.id}`,
        to: "/users",
        label: u.name,
        sublabel: u.email,
        icon: Users,
        group: "Users",
      }));

    const productMatches: ResultItem[] = products
      .filter((p) => `${p.name} ${p.category}`.toLowerCase().includes(q))
      .slice(0, 4)
      .map((p) => ({
        key: `product-${p.id}`,
        to: "/products",
        label: p.name,
        sublabel: p.category,
        icon: Package,
        group: "Products",
      }));

    const orderMatches: ResultItem[] = orders
      .filter((o) => `${o.customer} ${o.id}`.toLowerCase().includes(q))
      .slice(0, 4)
      .map((o) => ({
        key: `order-${o.id}`,
        to: "/orders",
        label: `Order #${o.id}`,
        sublabel: o.customer,
        icon: ShoppingCart,
        group: "Orders",
      }));

    return [
      ...pageMatches,
      ...projectMatches,
      ...userMatches,
      ...productMatches,
      ...orderMatches,
    ];
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((index) => Math.min(index + 1, results.length - 1));
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((index) => Math.max(index - 1, 0));
      } else if (event.key === "Enter" && results[activeIndex]) {
        navigate(results[activeIndex].to);
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, activeIndex, navigate, onClose]);

  let groupCursor = "";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={styles.panel}
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
          >
            <div className={styles.searchRow}>
              <Search size={17} className={styles.searchIcon} />
              <input
                ref={inputRef}
                className={styles.searchInput}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search pages, projects, users, products, orders..."
                aria-label="Command palette search"
              />
              <kbd className={styles.kbd}>Esc</kbd>
            </div>

            <div className={styles.results} role="listbox">
              {results.length === 0 && (
                <div className={styles.empty}>No results found.</div>
              )}
              {results.map((item, index) => {
                const showGroupLabel = item.group !== groupCursor;
                groupCursor = item.group;
                return (
                  <div key={item.key}>
                    {showGroupLabel && (
                      <div className={styles.groupLabel}>{item.group}</div>
                    )}
                    <button
                      className={styles.result}
                      data-active={index === activeIndex || undefined}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => {
                        navigate(item.to);
                        onClose();
                      }}
                      role="option"
                      aria-selected={index === activeIndex}
                    >
                      <item.icon size={16} className={styles.resultIcon} />
                      <span className={styles.resultText}>
                        <span>{item.label}</span>
                        {item.sublabel && (
                          <span className={styles.resultSublabel}>{item.sublabel}</span>
                        )}
                      </span>
                      {index === activeIndex && (
                        <CornerDownLeft size={14} className={styles.enterIcon} />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CommandPalette;
