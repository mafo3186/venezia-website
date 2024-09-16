import React from 'react';
import styles from './kompass.module.css';

interface CompassProps {
  width?: string;
  height?: string;
}

export default function Kompass({ width = '50%', height = '50%' }: CompassProps) {
  return (
    <div className={styles.kompass}>
      <img
        src="/icons/kompass-160863.svg"
        alt="Kompass"
        style={{ width: width, height: height }}
      />
    </div>
  );
}
