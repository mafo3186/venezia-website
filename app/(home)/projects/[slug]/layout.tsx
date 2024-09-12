import styles from "./styles.module.css";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.layout}>
      {children}
    </div>
  );
}
