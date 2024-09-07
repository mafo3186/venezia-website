// kaleidoscope/page.tsx
import styles from './kaleidoscopeStyles.module.css';

import { NextPage } from "next";
import Kaleidoscope from '@/app/components/Kaleidoscope';


export default function KaleidoscopePage() {
    return (
        <div>
            <h1 className={styles.title}>Kaleidoskop ohne Projekte</h1>
            <p>test</p>
        </div>
    );
}