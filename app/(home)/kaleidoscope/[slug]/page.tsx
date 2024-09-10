// kaleidoscope/page.tsx
import styles from './kaleidoscopeStyles.module.css';
import Link from "next/link";
import Kaleidoscope from "@/app/components/Kaleidoscope";
import type { ProjectBySlugQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { projectBySlugQuery } from "@/sanity/lib/queries";

type Props = {
    params: { slug: string };
};

export default async function ProjectKaleidoscopePage({ params }: Props) {
    const [project] = await Promise.all([
        sanityFetch<ProjectBySlugQueryResult>({
            query: projectBySlugQuery,
            params,
        })
    ]);

    //add switch case for different projects
    const projectSlug = params.slug;
    let shapes = ['circle', 'square', 'triangle'];
    let colors = ['#f133ff', '#a792f8', '#3357FF'];
    let quantity = 14;
    let speed = 0.7;
    let edge = 10;
    let minSize = 20;
    let maxSize = 60;
    switch (projectSlug) {
        case "nacktschnecken":
            shapes = ['moon', 'pentagon', 'butterfly'];
            colors = ['darkgreen', 'lightgreen', 'brown'];
            quantity = 20;
            speed = 0.3;
            edge = 8;
            minSize = 30;
            maxSize = 120;
            break;
        case "mareikes-spielwiese":
            shapes = ['circle', 'square', 'triangle'];
            colors = ['#f133ff', '#a792f8', '#3357FF'];
            quantity = 30;
            speed = 0.7;
            edge = 10;
            minSize = 20;
            maxSize = 80;
            break;
        case "der-stoer-eine-oral-history":
            shapes = ['drop', 'amoeba', 'pentagon']; // kein , ,  // gut: drop, amoeba, pentagon, moon, butterfly
            colors = ['blue', 'lightblue', 'darkblue'];
            quantity = 70;
            speed = 0.5;
            edge = 10;
            minSize = 10;
            maxSize = 100;
            break;
        case "demoprojekt":
            shapes = ['heart', 'star', 'moon'];
            colors = ['red', 'yellow', 'lightgray'];
            quantity = 50;
            speed = 0.7;
            edge = 16;
            minSize = 20;
            maxSize = 60;
            break;
        default: break;
    }

    return (
        <>
            <div className={styles.container}>
                <div style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
                    <Kaleidoscope
                        edge={edge}
                        shapes={shapes}
                        minSize={minSize}
                        maxSize={maxSize}
                        colors={colors}
                        quantity={quantity}
                        speed={speed}
                    />
                </div>
                <div className={styles.menu}>
                    <button className={styles.menuButton}>
                        <Link href={`/projects/${project?.slug}`}>
                            {project?.title}
                        </Link>
                    </button>
                </div>
            </div>
            <nav className={styles.navLinks}>
                <ul>
                    <li>
                        <Link href="/" className="hover:underline">
                            {"Zurück nach Venedig"}
                        </Link>
                    </li>
                    <li>
                        <Link href="/kaleidoscope" className="hover:underline">
                            {"Projekt-Kaleidoskop Auswahl"}
                        </Link>
                    </li>
                </ul>
            </nav>
        </>
    );
}


