import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import AuthLayout from "../../components/layout/AuthLayout";
import FormField from "../../components/ui/FormField";
import Button from "../../components/ui/Button";
import styles from "./Auth.module.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setIsSubmitting(false);
    setIsSent(true);
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="We'll email you a link to get back into your account."
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

      {isSent ? (
        <p className={styles.success}>
          If an account exists for {email || "that email"}, a reset link is on
          its way. Check your inbox.
        </p>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <FormField label="Email" htmlFor="forgot-email">
            <div className={styles.inputIconWrap}>
              <Mail size={16} className={styles.inputIcon} />
              <input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@company.com"
                autoComplete="email"
                required
              />
            </div>
          </FormField>

          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            className={styles.submitButton}
          >
            Send reset link
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}

export default ForgotPassword;
