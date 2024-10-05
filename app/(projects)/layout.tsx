"use client";
import '@/app/global.css'

import type { ProjectsQueryResult } from "@/sanity.types";

import { ClientLayout3D } from '@/components/clientLayout3D';

export default function ProjectLayout({
  children,
  projects,
}: {
  children: React.ReactNode;
  projects: ProjectsQueryResult;
}) {

  return (
    <ClientLayout3D projects={projects}>{children}</ClientLayout3D>
  );
}
