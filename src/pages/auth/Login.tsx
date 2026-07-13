import { useState, type FormEvent } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import AuthLayout from "../../components/layout/AuthLayout";
import FormField from "../../components/ui/FormField";
import Button from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";
import { ROLE_REDIRECTS, type UserRole } from "../../types/auth";
import styles from "./Auth.module.css";

const DEMO_LOGINS: Array<{ role: UserRole; label: string; email: string; password: string }> = [
  { role: "admin", label: "Admin", email: "admin@zkreclipse.com", password: "Admin123" },
  { role: "manager", label: "Manager", email: "manager@zkreclipse.com", password: "Manager123" },
  { role: "analyst", label: "Analyst", email: "analyst@zkreclipse.com", password: "Analyst123" },
  { role: "viewer", label: "Viewer", email: "viewer@zkreclipse.com", password: "Viewer123" },
];

function Login() {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as { from?: string } | null)?.from;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    try {
      const user = await login(email, password, rememberMe);
      navigate(from ?? ROLE_REDIRECTS[user.role], { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  function fillDemo(demo: (typeof DEMO_LOGINS)[number]) {
    setEmail(demo.email);
    setPassword(demo.password);
    setError(null);
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your ZKR Eclipse workspace."
      footer={
        <span>
          Don't have an account? <Link to="/register" className={styles.link}>Create one</Link>
        </span>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        <FormField label="Email" htmlFor="email">
          <div className={styles.inputIconWrap}>
            <Mail size={16} className={styles.inputIcon} />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
              autoComplete="email"
              required
            />
          </div>
        </FormField>

        <FormField label="Password" htmlFor="password">
          <div className={styles.inputIconWrap}>
            <Lock size={16} className={styles.inputIcon} />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </FormField>

        <div className={styles.row}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
            />
            Remember me
          </label>
          <Link to="/forgot-password" className={styles.link}>
            Forgot password?
          </Link>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <Button
          type="submit"
          variant="primary"
          loading={isLoading}
          className={styles.submitButton}
        >
          Sign in
        </Button>

        <div className={styles.divider}>
          <span>or try a demo account</span>
        </div>

        <div className={styles.demoRow}>
          {DEMO_LOGINS.map((demo) => (
            <button
              key={demo.role}
              type="button"
              className={styles.demoButton}
              onClick={() => fillDemo(demo)}
            >
              {demo.label} demo
            </button>
          ))}
        </div>
      </form>
    </AuthLayout>
  );
}

export default Login;
