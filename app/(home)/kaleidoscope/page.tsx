// kaleidoscope/page.tsx
import styles from './kaleidoscopeStyles.module.css';

import Kaleidoscope from "@/app/components/Kaleidoscope";


export default function KaleidoscopePage() {
    return (
        <div>
            <h1 className={styles.title}>Kaleidoskop ohne Projekte</h1>
            <div className={styles.container}>
                <div style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
                    <Kaleidoscope
                        edge={16}
                        shapes={['circle', 'square', 'triangle']}
                        minSize={20}
                        maxSize={60}
                        colors={['#f133ff', '#a792f8', '#3357FF']}
                        //colors={['#FF5733', '#33FF57', '#3357FF']}
                        quantity={5}
                        speed={0.1}
                    />
                </div>
                <div className={styles.menu}>
                    <button className={styles.menuButton}>Projekt XY anzeigen</button>
                </div>
            </div>
        </div >
    );
}


