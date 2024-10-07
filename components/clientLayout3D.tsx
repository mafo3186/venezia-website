"use client";

import { PropsWithChildren } from "react";
import { CanvasContainer } from "./world";
import { useProjects } from "@/components/contexts";

export function ClientLayout3D({ children }: PropsWithChildren) {
  const { projects, emptySpots } = useProjects();
  return (
    <CanvasContainer projects={projects} emptySpots={emptySpots}>
      {children}
    </CanvasContainer>
  );
}
