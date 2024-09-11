'use client';
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";
import styles from "./home.module.css";
import Content from "./content";
import Scene from "../scene/scene";
import { ProjectsQueryResult } from "@/sanity.types";

export default function Layout({ projects, children }: PropsWithChildren<{ projects: ProjectsQueryResult }>) {
    const pathname = usePathname();
    const onChildPage = pathname !== "/";

    return (
        <>
            {/* 3D-Szene */}
            <div className={styles.home}>
                <Scene projects={projects} inBackground={onChildPage} />
            </div>

            {/* Inhalt der Seite */}
            <Content onChildPage={onChildPage}>{children}</Content>
        </>
    );
}
