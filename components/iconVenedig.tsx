import React from 'react';
import styles from './icon.module.css';

interface IconProps {
  width?: string;
  height?: string;
}

export default function IconVenedig({ width = '50%', height = '50%' }: IconProps) {
  return (
    <div className={styles.icon}>
      <img
        src="/icons/venice-svgrepo-com.svg"
        alt="Venedig"
        style={{ width: width, height: height }}
      />
    </div>
  );
}
