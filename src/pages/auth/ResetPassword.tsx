import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import AuthLayout from "../../components/layout/AuthLayout";
import FormField from "../../components/ui/FormField";
import Button from "../../components/ui/Button";
import { useToast } from "../../hooks/useToast";
import styles from "./Auth.module.css";

function ResetPassword() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setIsSubmitting(false);

    showToast("Password reset. Sign in with your demo account to continue.", "success");
    navigate("/login");
  }

  return (
    <AuthLayout
      title="Set a new password"
      subtitle={
        email
          ? `Choose a new password for ${email}.`
          : "Choose a new password for your account."
      }
      footer={
        <span>
          Remembered it? <Link to="/login" className={styles.link}>Sign in</Link>
        </span>
      }
    >
      <Link to="/login" className={styles.backLink}>
        <ArrowLeft size={14} />
        Back to sign in
      </Link>

      <form onSubmit={handleSubmit} noValidate>
        <FormField label="New password" htmlFor="new-password">
          <div className={styles.inputIconWrap}>
            <Lock size={16} className={styles.inputIcon} />
            <input
              id="new-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
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

        <FormField label="Confirm password" htmlFor="confirm-password">
          <div className={styles.inputIconWrap}>
            <Lock size={16} className={styles.inputIcon} />
            <input
              id="confirm-password"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              required
            />
          </div>
        </FormField>

        {error && <p className={styles.error}>{error}</p>}

        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          className={styles.submitButton}
        >
          Reset password
        </Button>
      </form>
    </AuthLayout>
  );
}

export default ResetPassword;
