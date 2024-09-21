import React from 'react';
import styles from './icon.module.css';

interface IconProps {
  width?: string;
  height?: string;
}

export default function IconReturn({ width = '50%', height = '50%' }: IconProps) {
  return (
    <div className={styles.icon}>
      <img
        src="/icons/return_icon_154912.svg"
        alt="Zurück"
        style={{ width: width, height: height }}
      />
    </div>
  );
}
