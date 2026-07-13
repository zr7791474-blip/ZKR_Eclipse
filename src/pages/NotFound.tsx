import { Link, useNavigate } from "react-router-dom";
import { Compass, ArrowLeft } from "lucide-react";
import Button from "../components/ui/Button";
import styles from "./NotFound.module.css";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <span className={styles.iconWrap}>
        <Compass size={28} />
      </span>
      <h1 className={styles.code}>404</h1>
      <p className={styles.title}>This page doesn't exist.</p>
      <p className={styles.description}>
        The page you're looking for may have been moved, renamed, or never
        existed.
      </p>
      <div className={styles.actions}>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
          Go back
        </Button>
        <Link to="/">
          <Button variant="primary">Back to home</Button>
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
