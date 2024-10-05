"use client";

import { usePathname } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";
import { ProjectsQueryResult } from "@/sanity.types";
import { SceneCanvas } from "./scene";
import styles from "./world.module.css";
import { PreDefinedView } from "../types";
import { useHotspot } from "@/components/contexts";

function Content({ onChildPage, children }: PropsWithChildren<{ onChildPage: boolean }>) {
  return <main className={onChildPage ? styles.mainVisible : styles.mainHidden}>
    {children}
  </main>;
}

export function CanvasContainer({
  projects,
  view,
  onViewReached,
  children,
}: PropsWithChildren<{
  projects: ProjectsQueryResult,
  view?: PreDefinedView,
  onViewReached?: () => void,
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
          inBackground={onChildPage}
          view={hotspot}
          onViewReached={() => setHotspot(undefined)}
        />
      </div>
      <Content onChildPage={onChildPage}>{children}</Content>
    </>
  );
}