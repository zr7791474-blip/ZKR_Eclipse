import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import AuthLayout from "../../components/layout/AuthLayout";
import FormField from "../../components/ui/FormField";
import Button from "../../components/ui/Button";
import { useToast } from "../../hooks/useToast";
import styles from "./Auth.module.css";

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}

function Register() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const strength = getPasswordStrength(password);
  const strengthLabel = ["Too weak", "Weak", "Okay", "Good", "Strong"][strength];

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }
    if (strength < 2) {
      setError("Choose a stronger password (8+ characters, a number, and a symbol).");
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setIsSubmitting(false);

    showToast(
      "This is a demo build without a live backend — sign in with a demo account instead.",
      "info",
    );
    navigate("/login");
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start your ZKR Eclipse workspace in seconds."
      footer={
        <span>
          Already have an account? <Link to="/login" className={styles.link}>Sign in</Link>
        </span>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        <FormField label="Full name" htmlFor="name">
          <div className={styles.inputIconWrap}>
            <User size={16} className={styles.inputIcon} />
            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Jordan Lee"
              autoComplete="name"
              required
            />
          </div>
        </FormField>

        <FormField label="Email" htmlFor="reg-email">
          <div className={styles.inputIconWrap}>
            <Mail size={16} className={styles.inputIcon} />
            <input
              id="reg-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
              autoComplete="email"
              required
            />
          </div>
        </FormField>

        <FormField label="Password" htmlFor="reg-password">
          <div className={styles.inputIconWrap}>
            <Lock size={16} className={styles.inputIcon} />
            <input
              id="reg-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Create a password"
              autoComplete="new-password"
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

        {password.length > 0 && (
          <p className={styles.row} style={{ marginBottom: "var(--space-4)" }}>
            <span>Password strength</span>
            <span>{strengthLabel}</span>
          </p>
        )}

        {error && <p className={styles.error}>{error}</p>}

        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          className={styles.submitButton}
        >
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
}

export default Register;
