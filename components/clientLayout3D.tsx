"use client";

import { PropsWithChildren } from "react";
import { CanvasContainer } from "./world";
import { useProjects } from "@/components/contexts";

export function ClientLayout3D({ children }: PropsWithChildren) {
  const projects = useProjects() || [];

  return (
    <CanvasContainer projects={projects}>
      {children}
    </CanvasContainer>
  );
}
