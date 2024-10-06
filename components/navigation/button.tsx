"use client";

import Link from 'next/link';
import styles from './button.module.css';
import React from "react";
import {CiGlobe, CiViewList} from "react-icons/ci";
import {IoArrowBackOutline} from "react-icons/io5";

export function HomeButton3D() {
  return (
    <Link
      href="/"
      className={styles.button}
      aria-label="Zurück zur 3D-Weltansicht"
      title="Zurück zur 3D-Weltansicht"
    >
      <CiGlobe aria-hidden="true" />
    </Link>
  );
};

export function HomeButtonList() {
  return (
    <Link
      href="/projectlist"
      className={styles.button}
      aria-label="Zurück zur Listenansicht"
      title="Zurück zur Listenansicht"
    >
      <CiViewList aria-hidden="true" />
    </Link>
  );
};

export function BackButton() {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <button
      onClick={handleBack}
      className={styles.button}
      aria-label="Eine Seite zurück"
      title="Eine Seite zurück"
    >
      <IoArrowBackOutline aria-hidden="true" />
    </button>
  );
};
