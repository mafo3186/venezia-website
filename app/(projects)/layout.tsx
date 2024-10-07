"use client";
import '@/app/global.css'

import type { ProjectsQueryResult } from "@/sanity.types";

import { ClientLayout3D } from '@/components/clientLayout3D';

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <ClientLayout3D>{children}</ClientLayout3D>
  );
}
