"use client";

import { ProjectsQueryResult } from "@/sanity.types";
import { PropsWithChildren, useState } from "react";
import Menu from "./menu";
import { PreDefinedView } from "./types";
import { CanvasContainer } from "./world";

type Props = PropsWithChildren<{
  projects: ProjectsQueryResult;
}>;

export function ClientLayout({ children, projects }: Props) {
  const [hotspot, setHotspot] = useState<PreDefinedView | undefined>();
  return (
    <>
      <Menu projects={projects} onHotspotClick={setHotspot} />
      <CanvasContainer
        projects={projects}
        view={hotspot}
        onViewReached={() => setHotspot(undefined)}
      >
        {children}
      </CanvasContainer>
    </>
  );
}
