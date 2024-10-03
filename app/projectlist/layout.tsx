"use client";
import '@/app/global.css';

import type { ProjectsQueryResult } from "@/sanity.types";

interface LayoutProps {
  children: React.ReactNode;
  projects: ProjectsQueryResult;
}

export default function ProjectListLayout({ children, projects }: LayoutProps) {
  return (
    <main>
      {children}
    </main>
  );
}
