"use client";
import "@/app/global.css";
import { useProjects } from "@/components/contexts";
import { CanvasContainer } from "@/components/world";
import { PropsWithChildren } from "react";

export const dynamic = 'error'

export default function ProjectLayout({ children }: PropsWithChildren) {
  const { projects, emptySpots } = useProjects();
  return (
    <CanvasContainer projects={projects} emptySpots={emptySpots}>
      {children}
    </CanvasContainer>
  );
}
