import {
  Search,
  Sun,
  Moon,
  LogOut,
  Settings,
  Plus,
  User,
  Building2,
  LayoutDashboard,
  CreditCard,
  HelpCircle,
  Menu,
  ChevronDown,
  Check,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../hooks/useAuth";
import { useWorkspaces } from "../../hooks/useWorkspaces";
import { useToast } from "../../hooks/useToast";
import { ROLE_LABELS } from "../../types/auth";
import CommandPalette from "./CommandPalette";
import NotificationCenter from "./NotificationCenter";
import QuickCreateModal from "../modals/QuickCreateModal";
import styles from "./Topbar.module.css";

interface TopbarProps {
  onOpenMobileNav: () => void;
}

function Topbar({ onOpenMobileNav }: TopbarProps) {
  const { mode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { workspaces, activeWorkspaceId, setActiveWorkspaceId } = useWorkspaces();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isPaletteOpen, setPaletteOpen] = useState(false);
  const [isQuickCreateOpen, setQuickCreateOpen] = useState(false);
  const [isWorkspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
      if (workspaceRef.current && !workspaceRef.current.contains(event.target as Node)) {
        setWorkspaceMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    setMenuOpen(false);
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className={styles.topbar}>
      <button
        className={styles.hamburger}
        onClick={onOpenMobileNav}
        aria-label="Open navigation menu"
      >
        <Menu size={20} />
      </button>

      <Link to="/dashboard" className={styles.brand}>
        <img src="/zkr.jpg" alt="" className={styles.brandLogo} />
        <span className={styles.brandName}>ZKR Eclipse</span>
      </Link>

      <div className={styles.workspaceWrap} ref={workspaceRef}>
        <button
          className={styles.workspaceButton}
          onClick={() => setWorkspaceMenuOpen((prev) => !prev)}
          aria-expanded={isWorkspaceMenuOpen}
        >
          <Building2 size={15} />
          <span className={styles.workspaceName}>{activeWorkspace?.name ?? "Workspace"}</span>
          <ChevronDown size={14} />
        </button>

        {isWorkspaceMenuOpen && (
          <div className={styles.dropdown}>
            {workspaces.map((workspace) => (
              <button
                key={workspace.id}
                className={styles.dropdownItem}
                onClick={() => {
                  setActiveWorkspaceId(workspace.id);
                  setWorkspaceMenuOpen(false);
                  showToast(`Switched to "${workspace.name}"`, "info");
                }}
              >
                <Building2 size={15} />
                <span>{workspace.name}</span>
                {workspace.id === activeWorkspaceId && (
                  <Check size={14} style={{ marginLeft: "auto" }} />
                )}
              </button>
            ))}
            <div className={styles.dropdownDivider} />
            <button
              className={styles.dropdownItem}
              onClick={() => {
                setWorkspaceMenuOpen(false);
                setQuickCreateOpen(true);
              }}
            >
              <Plus size={15} />
              <span>New workspace</span>
            </button>
          </div>
        )}
      </div>

      <button
        className={styles.searchWrap}
        onClick={() => setPaletteOpen(true)}
        aria-label="Open command palette"
      >
        <Search size={17} className={styles.searchIcon} />
        <span className={styles.searchPlaceholder}>Search anything...</span>
        <kbd className={styles.searchKbd}>⌘K</kbd>
      </button>

      <button
        className={styles.mobileSearchButton}
        onClick={() => setPaletteOpen(true)}
        aria-label="Open search"
      >
        <Search size={18} />
      </button>

      <div className={styles.actions}>
        <button className={styles.quickCreate} onClick={() => setQuickCreateOpen(true)}>
          <Plus size={16} />
          <span>Quick create</span>
        </button>

        <button
          className={styles.iconButton}
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {mode === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <NotificationCenter />

        <div className={styles.profileWrap} ref={profileRef}>
          <button
            className={styles.avatarButton}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Open profile menu"
            aria-expanded={isMenuOpen}
          >
            <img src="/zkr.jpg" alt="User avatar" className={styles.avatar} />
          </button>

          {isMenuOpen && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownUser}>
                <span className={styles.dropdownName}>{user?.name ?? "Guest"}</span>
                <span className={styles.dropdownEmail}>{user?.email}</span>
                {user && (
                  <span className={styles.dropdownRole}>{ROLE_LABELS[user.role]}</span>
                )}
              </div>

              <button
                className={styles.dropdownItem}
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/settings");
                }}
              >
                <User size={16} />
                <span>Profile</span>
              </button>
              <button
                className={styles.dropdownItem}
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/workspace");
                }}
              >
                <Building2 size={16} />
                <span>Workspace</span>
              </button>
              <button
                className={styles.dropdownItem}
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/dashboard");
                }}
              >
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </button>
              <button
                className={styles.dropdownItem}
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/settings");
                }}
              >
                <Settings size={16} />
                <span>Settings</span>
              </button>
              <button
                className={styles.dropdownItem}
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/settings?tab=billing");
                }}
              >
                <CreditCard size={16} />
                <span>Billing</span>
              </button>
              <button
                className={styles.dropdownItem}
                onClick={() => {
                  setMenuOpen(false);
                  window.open("https://github.com/zr7791474-blip", "_blank", "noreferrer");
                }}
              >
                <HelpCircle size={16} />
                <span>Help</span>
              </button>

              <div className={styles.dropdownDivider} />

              <button
                className={`${styles.dropdownItem} ${styles.dropdownDanger}`}
                onClick={handleLogout}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <CommandPalette isOpen={isPaletteOpen} onClose={() => setPaletteOpen(false)} />
      <QuickCreateModal isOpen={isQuickCreateOpen} onClose={() => setQuickCreateOpen(false)} />
    </header>
  );
}

export default Topbar;
