"use client";

import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";
import { ProjectsQueryResult } from "@/sanity.types";
import { SceneCanvas } from "./scene";
import styles from "./world.module.css";
import { PreDefinedView } from "../types";

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

  return (<>
    <div className={styles.home}>
      <SceneCanvas
        projects={projects}
        inBackground={onChildPage}
        view={view}
        onViewReached={onViewReached}
      />
    </div>
    <Content onChildPage={onChildPage}>{children}</Content>
  </>);
}
