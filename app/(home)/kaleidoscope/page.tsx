// kaleidoscope/page.tsx
import styles from './kaleidoscopeStyles.module.css';

import Kaleidoscope from "@/app/components/Kaleidoscope";


export default function KaleidoscopePage() {
    return (
        <div>
            <h1 className={styles.title}>Kaleidoskop ohne Projekte</h1>
            <div className={styles.container}>
                <Kaleidoscope />
                <div className={styles.menu}>
                    <button className={styles.menuButton}>Alle Projekte anzeigen</button>
                </div>
            </div>
        </div >
    );
}
