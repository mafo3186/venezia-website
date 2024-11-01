"use client";
import "@/app/global.css";
import { useProjects } from "@/components/contexts";
import { CanvasContainer } from "@/components/world";
import { PropsWithChildren } from "react";

export default function ProjectLayout({ children }: PropsWithChildren) {
  const { projects } = useProjects();
  return (
    <CanvasContainer projects={projects}>
      {children}
    </CanvasContainer>
  );
}
