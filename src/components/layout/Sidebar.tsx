import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Building2,
  Users,
  Package,
  ShoppingCart,
  Settings,
  BarChart3,
  ChevronsLeft,
  X,
} from "lucide-react";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItemDef {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  end?: boolean;
}

const NAV_SECTIONS: { label: string; items: NavItemDef[] }[] = [
  {
    label: "General",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
      { to: "/reports", label: "Reports", icon: BarChart3 },
      { to: "/workspace", label: "Workspace", icon: Building2 },
    ],
  },
  {
    label: "Management",
    items: [
      { to: "/projects", label: "Projects", icon: FolderKanban },
      { to: "/users", label: "Users", icon: Users },
      { to: "/products", label: "Products", icon: Package },
      { to: "/orders", label: "Orders", icon: ShoppingCart },
    ],
  },
  {
    label: "Preferences",
    items: [{ to: "/settings", label: "Settings", icon: Settings }],
  },
];

function Sidebar({ isCollapsed, onToggle, isMobileOpen, onCloseMobile }: SidebarProps) {
  useEffect(() => {
    if (!isMobileOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseMobile();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileOpen, onCloseMobile]);

  return (
    <>
      {isMobileOpen && (
        <div
          className={styles.backdrop}
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={styles.sidebar}
        data-collapsed={isCollapsed || undefined}
        data-mobile-open={isMobileOpen || undefined}
      >
        <div className={styles.brand}>
          <img src="/zkr.jpg" alt="ZKR Eclipse logo" className={styles.logo} />
          <span className={styles.brandName}>ZKR Eclipse</span>
          <button
            className={styles.mobileCloseButton}
            onClick={onCloseMobile}
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        <nav className={styles.nav}>
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} className={styles.section}>
              <span className={styles.sectionLabel}>{section.label}</span>
              {section.items.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
                  }
                  data-tooltip={label}
                >
                  <span className={styles.navIndicator} aria-hidden="true" />
                  <Icon size={19} strokeWidth={2} className={styles.navIcon} />
                  <span className={styles.navLabel}>{label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <button
          className={styles.collapseButton}
          onClick={onToggle}
          aria-label="Toggle sidebar"
          data-tooltip={isCollapsed ? "Expand" : "Collapse"}
        >
          <ChevronsLeft
            size={18}
            className={styles.collapseIcon}
            data-collapsed={isCollapsed || undefined}
          />
          <span className={styles.navLabel}>Collapse</span>
        </button>
      </aside>
    </>
  );
}

export default Sidebar;
