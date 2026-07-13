import { useEffect, useMemo, useRef, useState } from "react";
import type React from "react";
import {
  Bell,
  Check,
  Inbox,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  X,
  Trash2,
} from "lucide-react";
import { notifications as SEED_NOTIFICATIONS } from "../../data/mockData";
import type { NotificationItem } from "../../types/entities";
import styles from "./NotificationCenter.module.css";

const TYPE_ICON: Record<NotificationItem["type"], typeof CheckCircle2> = {
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
};

const STORAGE_KEY = "zkr-notifications";

type FilterKey = "all" | "unread" | NotificationItem["type"];

const FILTERS: Array<{ key: FilterKey; label: string }> = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "success", label: "Success" },
  { key: "warning", label: "Warning" },
  { key: "error", label: "Error" },
  { key: "info", label: "Info" },
];

function loadInitialNotifications(): NotificationItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as NotificationItem[];
  } catch {
    // fall through to seed data
  }
  return SEED_NOTIFICATIONS;
}

function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>(loadInitialNotifications);
  const [filter, setFilter] = useState<FilterKey>("all");
  const containerRef = useRef<HTMLDivElement>(null);

  const unreadCount = items.filter((item) => !item.read).length;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const visibleItems = useMemo(() => {
    if (filter === "all") return items;
    if (filter === "unread") return items.filter((item) => !item.read);
    return items.filter((item) => item.type === filter);
  }, [items, filter]);

  function toggleRead(id: string) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: !item.read } : item)),
    );
  }

  function markAllRead() {
    setItems((prev) => prev.map((item) => ({ ...item, read: true })));
  }

  function deleteItem(id: string, event: React.MouseEvent) {
    event.stopPropagation();
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function clearAll() {
    setItems([]);
  }

  return (
    <div className={styles.wrap} ref={containerRef}>
      <button
        className={styles.trigger}
        aria-label="Notifications"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Bell size={18} />
        {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className={styles.panel} role="menu">
          <div className={styles.header}>
            <span>Notifications</span>
            <div className={styles.headerActions}>
              {unreadCount > 0 && (
                <button className={styles.markAllRead} onClick={markAllRead}>
                  Mark all read
                </button>
              )}
              {items.length > 0 && (
                <button className={styles.clearAll} onClick={clearAll} aria-label="Clear all">
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          </div>

          <div className={styles.filterRow}>
            {FILTERS.map((f) => (
              <button
                key={f.key}
                className={styles.filterChip}
                data-active={filter === f.key || undefined}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {visibleItems.length === 0 ? (
            <div className={styles.empty}>
              <Inbox size={22} />
              <p>{items.length === 0 ? "You're all caught up." : "No notifications match this filter."}</p>
            </div>
          ) : (
            <div className={styles.list}>
              {visibleItems.map((item) => {
                const TypeIcon = TYPE_ICON[item.type];
                return (
                  <div
                    key={item.id}
                    className={styles.item}
                    data-unread={!item.read || undefined}
                    onClick={() => toggleRead(item.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") toggleRead(item.id);
                    }}
                  >
                    <span className={styles.typeIcon} data-type={item.type}>
                      <TypeIcon size={14} />
                    </span>
                    <span className={styles.text}>
                      <span className={styles.title}>{item.title}</span>
                      <span className={styles.detail}>{item.message}</span>
                      <span className={styles.timestamp}>{item.timestamp}</span>
                    </span>
                    {item.read && <Check size={14} className={styles.checkIcon} />}
                    <button
                      className={styles.deleteButton}
                      onClick={(event) => deleteItem(item.id, event)}
                      aria-label="Delete notification"
                    >
                      <X size={13} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationCenter;
