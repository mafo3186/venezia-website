// components/loading.tsx

import styles from "./loading.module.css"; // Style für die Lade-Animation

export default function Loading() {
  return (
    <div className={styles.loader}>
      <div className={styles.spinner}></div>
      <p>Loading...</p>
    </div>
  );
}
