import styles from "./navigation-buttons.module.css";
import HomeButtonSwitcher from "../hooks/buttonSwitcher";

export function NavigationButtons() {
  return (
    <div className={styles.navigationButtons}>
      <HomeButtonSwitcher />
    </div>
  );
}
