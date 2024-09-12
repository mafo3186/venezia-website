"use client";

import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";
import { ProjectsQueryResult } from "@/sanity.types";
import { SceneCanvas } from "./scene";
import styles from "../home.module.css";

function Content({ onChildPage, children }: PropsWithChildren<{ onChildPage: boolean }>) {
  return <main className={onChildPage ? styles.mainVisible : styles.mainHidden}>
    {children}
  </main>;
}

export function CanvasContainer({ projects, children }: PropsWithChildren<{ projects: ProjectsQueryResult }>) {
  const pathname = usePathname();
  const onChildPage = pathname !== "/";

  return (<>
    <div className={styles.home}>
      <SceneCanvas projects={projects} inBackground={onChildPage} />
    </div>
    <Content onChildPage={onChildPage}>{children}</Content>
  </>);
}
