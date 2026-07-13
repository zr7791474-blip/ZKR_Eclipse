import styles from "./ActivityFeed.module.css";
import type { ActivityItem } from "../../types/entities";

interface ActivityFeedProps {
  items: ActivityItem[];
}

const DOT_PALETTE = ["#168aad", "#76c893", "#1e6091", "#52b69a", "#d9ed92"];

function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <ul className={styles.feed}>
      {items.map((item, index) => (
        <li key={item.id} className={styles.item}>
          <span
            className={styles.dot}
            style={{ ["--dot-color" as string]: DOT_PALETTE[index % DOT_PALETTE.length] }}
          />
          <div className={styles.body}>
            <p className={styles.text}>
              <strong>{item.actor}</strong> {item.action}{" "}
              <strong>{item.target}</strong>
            </p>
            <span className={styles.timestamp}>{item.timestamp}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default ActivityFeed;