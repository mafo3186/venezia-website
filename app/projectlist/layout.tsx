"use client";
import '@/app/global.css';

import { PropsWithChildren } from "react";
import listStyles from "@/components/list/projectList.module.css"; 


export default function ProjectListLayout({ children }: PropsWithChildren<{}>) {
  return (
    <main>
      <div className={listStyles.backgroundImage}></div>
      {children}
    </main>
  );
}
