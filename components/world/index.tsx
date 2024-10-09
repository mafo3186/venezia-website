"use client";

import { usePathname } from "next/navigation";
import { PropsWithChildren, useEffect, useMemo } from "react";
import { SceneCanvas } from "./scene";
import styles from "./world.module.css";
import { HotspotsWithProjects, PreDefinedView, Spot } from "@/components/types";
import { useHotspot, useVisited } from "@/components/contexts";

function Content({
  onChildPage,
  children,
}: PropsWithChildren<{ onChildPage: boolean }>) {
  return (
    <main className={onChildPage ? styles.mainVisible : styles.mainHidden}>
      {children}
    </main>
  );
}

export function CanvasContainer({
  projects,
  emptySpots,
  children,
}: PropsWithChildren<{
  projects: HotspotsWithProjects;
  emptySpots: Spot[];
}>) {
  const pathname = usePathname();
  const onChildPage = pathname !== "/";
  const { hotspot, setHotspot } = useHotspot();
  const [visited] = useVisited();
  const allSlugs = useMemo(
    () =>
      projects.flatMap((hotspot) =>
        hotspot.projects.map((spot) => spot.project.slug),
      ),
    [projects],
  );
  const foreignness = useMemo(
    () =>
      1 -
      visited.filter(
        (value, index, array) =>
          array.indexOf(value) === index && allSlugs.includes(value),
      ).length /
        allSlugs.length,
    [allSlugs, visited],
  );
  return (
    <>
      <div className={styles.home}>
        <SceneCanvas
          projects={projects}
          emptySpots={emptySpots}
          inBackground={onChildPage}
          view={hotspot}
          onViewReached={() => setHotspot(undefined)}
          foreignness={foreignness}
        />
      </div>
      <Content onChildPage={onChildPage}>{children}</Content>
    </>
  );
}
