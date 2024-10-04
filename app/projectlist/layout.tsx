"use client";
import '@/app/global.css';

import { PropsWithChildren } from "react";

export default function ProjectListLayout({ children }: PropsWithChildren<{}>) {
  return (
    <main>
      {children}
    </main>
  );
}
