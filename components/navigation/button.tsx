"use client";

import Link from 'next/link';
import styles from './button.module.css';
import React from "react"; 

export function HomeButton () {
  return (
    <Link href="/public" className={styles.button}>
      Home
    </Link>
  );
};


export function BackButton() {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <button onClick={handleBack} className={styles.button}>
      Zurück
    </button>
  );
};

