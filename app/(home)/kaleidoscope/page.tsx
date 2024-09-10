// kaleidoscope/page.tsx
import styles from './[slug]/kaleidoscopeStyles.module.css';

import { ProjectsQueryResult } from '@/sanity.types';
import { projectsQuery } from '@/sanity/lib/queries';
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/fetch";

const [projects] = await Promise.all([
    sanityFetch<ProjectsQueryResult>({ query: projectsQuery }),
]);

export default function KaleidoscopePage() {
    return (
        <div>
            <h1 className={styles.title}>Projekt-Kaleidoskop Auswahl</h1>
            <div className={styles.container}>
                <nav className={styles.navLinks}>
                    <ul>
                        {projects?.map((project) => (
                            <li key={project._id}>
                                <h3>
                                    <Link href={`/kaleidoscope/${project.slug}`}>
                                        {project.title}
                                    </Link>
                                </h3>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    );
}


