import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import {
  User,
  Bell,
  Palette,
  Shield,
  CreditCard,
  KeyRound,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  Plus,
} from "lucide-react";
import PageHeader from "../components/layout/PageHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import ProgressBar from "../components/ui/ProgressBar";
import Skeleton from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { ROLE_LABELS } from "../types/auth";
import styles from "./Settings.module.css";

type TabId = "profile" | "preferences" | "appearance" | "security" | "billing" | "api-keys";

const TABS: Array<{ id: TabId; label: string; icon: typeof User }> = [
  { id: "profile", label: "Profile", icon: User },
  { id: "preferences", label: "Preferences", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "security", label: "Security", icon: Shield },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "api-keys", label: "API Keys", icon: KeyRound },
];

interface ApiKey {
  id: string;
  label: string;
  key: string;
  createdAt: string;
  revealed: boolean;
}

function generateKey() {
  return `zkr_live_${crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`;
}

const PREFERENCES_KEY = "zkr-preferences";

interface Preferences {
  notifyEmail: boolean;
  notifyPush: boolean;
  twoFactor: boolean;
}

const DEFAULT_PREFERENCES: Preferences = {
  notifyEmail: true,
  notifyPush: false,
  twoFactor: false,
};

function loadPreferences(): Preferences {
  try {
    const raw = localStorage.getItem(PREFERENCES_KEY);
    if (raw) return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
  } catch {
    // fall through to defaults
  }
  return DEFAULT_PREFERENCES;
}

function Settings() {
  const { mode, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get("tab") as TabId | null;
  const [activeTab, setActiveTab] = useState<TabId>(
    tabParam && TABS.some((tab) => tab.id === tabParam) ? tabParam : "profile",
  );
  const [isLoading, setIsLoading] = useState(true);

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [preferences, setPreferences] = useState<Preferences>(loadPreferences);
  const { notifyEmail, notifyPush, twoFactor } = preferences;
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);

  useEffect(() => {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
  }, [preferences]);

  function setNotifyEmail(value: boolean | ((prev: boolean) => boolean)) {
    setPreferences((prev) => ({
      ...prev,
      notifyEmail: typeof value === "function" ? value(prev.notifyEmail) : value,
    }));
  }

  function setNotifyPush(value: boolean | ((prev: boolean) => boolean)) {
    setPreferences((prev) => ({
      ...prev,
      notifyPush: typeof value === "function" ? value(prev.notifyPush) : value,
    }));
  }

  function setTwoFactor(value: boolean | ((prev: boolean) => boolean)) {
    setPreferences((prev) => ({
      ...prev,
      twoFactor: typeof value === "function" ? value(prev.twoFactor) : value,
    }));
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsLoading(false), 600);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    setSearchParams((params) => {
      params.set("tab", activeTab);
      return params;
    }, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  function handleProfileSave(event: FormEvent) {
    event.preventDefault();
    showToast("Profile updated.", "success");
  }

  function handleSecuritySave(event: FormEvent) {
    event.preventDefault();
    showToast("Security settings saved.", "success");
  }

  function handleCreateKey() {
    const key: ApiKey = {
      id: crypto.randomUUID(),
      label: `Secret key ${apiKeys.length + 1}`,
      key: generateKey(),
      createdAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      revealed: true,
    };
    setApiKeys((keys) => [key, ...keys]);
    showToast("New API key created. Copy it now — you won't see it again.", "success");
  }

  function toggleReveal(id: string) {
    setApiKeys((keys) =>
      keys.map((k) => (k.id === id ? { ...k, revealed: !k.revealed } : k)),
    );
  }

  function copyKey(key: string) {
    navigator.clipboard?.writeText(key);
    showToast("API key copied to clipboard.", "info");
  }

  function deleteKey(id: string) {
    setApiKeys((keys) => keys.filter((k) => k.id !== id));
    showToast("API key revoked.", "success");
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="Settings"
        description="Manage your account, workspace, and preferences."
      />

      <div className={styles.layout}>
        <nav className={styles.tabList} aria-label="Settings sections">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={styles.tabButton}
              data-active={activeTab === tab.id || undefined}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className={styles.tabPanel}>
          {isLoading ? (
            <Card className={styles.section}>
              <Skeleton width="140px" height="20px" />
              <Skeleton height="38px" />
              <Skeleton height="38px" />
              <Skeleton width="120px" height="36px" />
            </Card>
          ) : (
            <>
              {activeTab === "profile" && (
                <Card className={styles.section}>
                  <h3 className={styles.sectionTitle}>Profile</h3>
                  <form onSubmit={handleProfileSave}>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="fullName">
                        Full name
                      </label>
                      <input
                        id="fullName"
                        className={styles.input}
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="email">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        className={styles.input}
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                      />
                    </div>
                    {user && (
                      <div className={styles.field}>
                        <span className={styles.label}>Role</span>
                        <div>
                          <Badge label={ROLE_LABELS[user.role]} variant="info" />
                        </div>
                      </div>
                    )}
                    <Button type="submit" className={styles.saveButton}>
                      Save changes
                    </Button>
                  </form>
                </Card>
              )}

              {activeTab === "preferences" && (
                <Card className={styles.section}>
                  <h3 className={styles.sectionTitle}>Preferences</h3>
                  <div className={styles.rowBetween}>
                    <div>
                      <p className={styles.optionTitle}>Email notifications</p>
                      <p className={styles.optionDescription}>
                        Receive updates about your account by email.
                      </p>
                    </div>
                    <button
                      className={styles.switch}
                      data-on={notifyEmail || undefined}
                      onClick={() => setNotifyEmail((prev) => !prev)}
                      aria-label="Toggle email notifications"
                    >
                      <span className={styles.switchThumb} />
                    </button>
                  </div>
                  <div className={styles.rowBetween}>
                    <div>
                      <p className={styles.optionTitle}>Push notifications</p>
                      <p className={styles.optionDescription}>
                        Get real-time alerts on your device.
                      </p>
                    </div>
                    <button
                      className={styles.switch}
                      data-on={notifyPush || undefined}
                      onClick={() => setNotifyPush((prev) => !prev)}
                      aria-label="Toggle push notifications"
                    >
                      <span className={styles.switchThumb} />
                    </button>
                  </div>
                </Card>
              )}

              {activeTab === "appearance" && (
                <Card className={styles.section}>
                  <h3 className={styles.sectionTitle}>Appearance</h3>
                  <div className={styles.rowBetween}>
                    <div>
                      <p className={styles.optionTitle}>Dark mode</p>
                      <p className={styles.optionDescription}>
                        Switch between light and dark themes.
                      </p>
                    </div>
                    <button
                      className={styles.switch}
                      data-on={mode === "dark" || undefined}
                      onClick={toggleTheme}
                      aria-label="Toggle dark mode"
                    >
                      <span className={styles.switchThumb} />
                    </button>
                  </div>
                </Card>
              )}

              {activeTab === "security" && (
                <Card className={styles.section}>
                  <h3 className={styles.sectionTitle}>Security</h3>
                  <form onSubmit={handleSecuritySave}>
                    <PasswordField id="currentPassword" label="Current password" />
                    <PasswordField id="newPassword" label="New password" />
                    <PasswordField id="confirmPassword" label="Confirm new password" />
                    <Button type="submit" className={styles.saveButton}>
                      Update password
                    </Button>
                  </form>

                  <div className={styles.rowBetween} style={{ marginTop: "var(--space-5)" }}>
                    <div>
                      <p className={styles.optionTitle}>Two-factor authentication</p>
                      <p className={styles.optionDescription}>
                        Add an extra layer of security to your account.
                      </p>
                    </div>
                    <button
                      className={styles.switch}
                      data-on={twoFactor || undefined}
                      onClick={() => {
                        setTwoFactor((prev) => !prev);
                        showToast(
                          twoFactor ? "Two-factor authentication disabled." : "Two-factor authentication enabled.",
                          "success",
                        );
                      }}
                      aria-label="Toggle two-factor authentication"
                    >
                      <span className={styles.switchThumb} />
                    </button>
                  </div>
                </Card>
              )}

              {activeTab === "billing" && (
                <Card className={styles.section}>
                  <h3 className={styles.sectionTitle}>Billing</h3>
                  <div className={styles.planCard}>
                    <div>
                      <div className={styles.planHeader}>
                        <span className={styles.planName}>Growth plan</span>
                        <Badge label="Active" variant="success" />
                      </div>
                      <p className={styles.optionDescription}>
                        $79/month · renews on the 1st
                      </p>
                    </div>
                    <Button variant="secondary">Manage plan</Button>
                  </div>
                  <div className={styles.usageBlock}>
                    <div className={styles.rowBetween} style={{ borderBottom: "none", padding: "0 0 8px" }}>
                      <span className={styles.optionTitle}>Seats used</span>
                      <span className={styles.optionDescription}>18 / 25</span>
                    </div>
                    <ProgressBar value={72} />
                  </div>
                </Card>
              )}

              {activeTab === "api-keys" && (
                <Card className={styles.section}>
                  <div className={styles.rowBetween} style={{ borderBottom: "none", padding: "0 0 var(--space-2)" }}>
                    <div>
                      <h3 className={styles.sectionTitle} style={{ marginBottom: 0 }}>
                        API Keys
                      </h3>
                      <p className={styles.optionDescription}>
                        Use these keys to authenticate requests to the ZKR Eclipse API.
                      </p>
                    </div>
                    <Button onClick={handleCreateKey}>
                      <Plus size={16} />
                      New key
                    </Button>
                  </div>

                  {apiKeys.length === 0 ? (
                    <EmptyState
                      icon={KeyRound}
                      title="No API keys yet"
                      description="Create a key to start integrating with the ZKR Eclipse API."
                      action={
                        <Button variant="secondary" onClick={handleCreateKey}>
                          <Plus size={16} />
                          Create your first key
                        </Button>
                      }
                    />
                  ) : (
                    <ul className={styles.keyList}>
                      {apiKeys.map((apiKey) => (
                        <li key={apiKey.id} className={styles.keyRow}>
                          <div>
                            <p className={styles.optionTitle}>{apiKey.label}</p>
                            <p className={styles.keyValue}>
                              {apiKey.revealed
                                ? apiKey.key
                                : `${apiKey.key.slice(0, 8)}${"•".repeat(20)}`}
                            </p>
                            <p className={styles.optionDescription}>
                              Created {apiKey.createdAt}
                            </p>
                          </div>
                          <div className={styles.keyActions}>
                            <button
                              className={styles.iconAction}
                              onClick={() => toggleReveal(apiKey.id)}
                              aria-label={apiKey.revealed ? "Hide key" : "Reveal key"}
                            >
                              {apiKey.revealed ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                            <button
                              className={styles.iconAction}
                              onClick={() => copyKey(apiKey.key)}
                              aria-label="Copy key"
                            >
                              <Copy size={15} />
                            </button>
                            <button
                              className={`${styles.iconAction} ${styles.iconActionDanger}`}
                              onClick={() => deleteKey(apiKey.id)}
                              aria-label="Revoke key"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function PasswordField({ id, label }: { id: string; label: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <div className={styles.passwordWrap}>
        <input id={id} type={visible ? "text" : "password"} className={styles.input} />
        <button
          type="button"
          className={styles.passwordToggle}
          onClick={() => setVisible((prev) => !prev)}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );
}

export default Settings;
