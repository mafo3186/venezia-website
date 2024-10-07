"use client";

import { usePathname } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";
import { SceneCanvas } from "./scene";
import styles from "./world.module.css";
import { HotspotsWithProjects, PreDefinedView, Spot } from "@/components/types";
import { useHotspot } from "@/components/contexts";

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
  view,
  onViewReached,
  children,
}: PropsWithChildren<{
  projects: HotspotsWithProjects;
  emptySpots: Spot[];
  view?: PreDefinedView;
  onViewReached?: () => void;
}>) {
  const pathname = usePathname();
  const onChildPage = pathname !== "/";
  const { hotspot, setHotspot } = useHotspot();

  useEffect(() => {
    if (view) {
      setHotspot(view);
    }
  }, [view, setHotspot]);

  return (
    <>
      <div className={styles.home}>
        <SceneCanvas
          projects={projects}
          emptySpots={emptySpots}
          inBackground={onChildPage}
          view={hotspot}
          onViewReached={() => setHotspot(undefined)}
        />
      </div>
      <Content onChildPage={onChildPage}>{children}</Content>
    </>
  );
}
