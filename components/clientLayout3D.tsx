"use client";

import { ProjectsQueryResult } from "@/sanity.types";
import { PropsWithChildren } from "react";
import { CanvasContainer } from "./world";
import { useProjects } from "@/components/contexts";

type Props = PropsWithChildren<{
  projects: ProjectsQueryResult;
}>;

export function ClientLayout3D({ children }: Props) {
  const projects = useProjects() || [];

  return (
    <CanvasContainer projects={projects}>
      {children}
    </CanvasContainer>
  );
}