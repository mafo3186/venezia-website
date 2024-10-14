"use client";
import '@/app/global.css';

import { PropsWithChildren } from "react";
import listStyles from "@/components/list/projectList.module.css"; 


export default function ProjectListLayout({ children }: PropsWithChildren<{}>) {
  return (
    <main>
      <div className={listStyles.pageContainer}>
        <div className={listStyles.backgroundImage}>
          <div className={listStyles.title}>Fremde überall - Exkursion zur Kunst-Biennale Venedig 2024</div>
        </div>
        <div className={listStyles.backgroundImage}></div>
        {children}
      </div>
    </main>
);
}
