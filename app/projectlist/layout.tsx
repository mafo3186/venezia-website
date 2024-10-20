"use client";
import '@/app/global.css';

import { PropsWithChildren } from "react";
import listStyles from "@/components/list/projectList.module.css";
import Link from "next/link"; 


export default function ProjectListLayout({ children }: PropsWithChildren<{}>) {
  return (
    <main>
      <div className={listStyles.pageContainer}>
        <div className={listStyles.backgroundImage}></div>
        {children}
        <div className={listStyles.title}>
          <Link 
            href={"/projectlist/fremde"}
            aria-label={"Fremde überall - Exkursion zur Kunst-Biennale Venedig 2024"}
          >
            Fremde überall - Exkursion zur Kunst-Biennale Venedig 2024
          </Link>
        </div>
      </div>
    </main>
  );
}
