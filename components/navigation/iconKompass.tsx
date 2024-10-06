import React from 'react';
import styles from './icon.module.css';

interface IconProps {
  width?: string;
  height?: string;
}

export default function IconKompass({ width = '50%', height = '50%' }: IconProps) {
  return (
    <div className={styles.icon}>
      <img
        src="/icons/kompass-160863.svg"
        alt="IconKompass"
        style={{ width: width, height: height }}
      />
    </div>
  );
}
