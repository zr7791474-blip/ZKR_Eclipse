import Skeleton from "../ui/Skeleton";
import styles from "./PageLoader.module.css";

function PageLoader() {
  return (
    <div className={styles.wrap}>
      <Skeleton width="240px" height="28px" />
      <Skeleton height="120px" />
      <div className={styles.row}>
        <Skeleton height="90px" />
        <Skeleton height="90px" />
        <Skeleton height="90px" />
      </div>
      <Skeleton height="220px" />
    </div>
  );
}

export default PageLoader;
