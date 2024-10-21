import styles from "./staticPages.module.css";
import { PropsWithChildren } from "react";
import { NavigationButtons } from "../page/navigation-buttons";

export function StaticPageLayout({ children }: PropsWithChildren) {
  return (
    <div className={styles.pageContainer}>
      <NavigationButtons />
      <div className={styles.textContainer}>{children}</div>
    </div>
  );
}
