"use client";
import { PropsWithChildren } from "react";
import styles from "./home.module.css";
export default function Content({ onChildPage, children }: PropsWithChildren<{ onChildPage: boolean }>) {
    return (
        <main className={onChildPage ? styles.mainVisible : styles.mainHidden}>
            <div className={styles.outerWrapper}>
                <div className={styles.innerWrapper}>
                    {children}
                </div>
            </div>
        </main>
    );
}
