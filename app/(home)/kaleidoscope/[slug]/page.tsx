// kaleidoscope/page.tsx
import styles from './kaleidoscopeStyles.module.css';
import Link from "next/link";
import Kaleidoscope from "@/app/components/Kaleidoscope";
import type {
    ProjectBySlugQueryResult,
    ProjectSlugsResult,
    SettingsQueryResult,
} from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";

import { projectBySlugQuery, settingsQuery } from "@/sanity/lib/queries";

type Props = {
    params: { slug: string };
};

export default async function PostPage({ params }: Props) {
    const [project, settings] = await Promise.all([
        sanityFetch<ProjectBySlugQueryResult>({
            query: projectBySlugQuery,
            params,
        }),
        sanityFetch<SettingsQueryResult>({
            query: settingsQuery,
        }),
    ]);


    return (
        <>
            <nav>
                <h2>
                    <Link href="/" className="hover:underline">
                        {settings?.title || "Home"}
                    </Link>
                </h2>
            </nav>

            <div className={styles.container}>
                <div style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
                    <Kaleidoscope
                        edge={10}
                        shapes={['circle', 'square', 'triangle']}
                        minSize={20}
                        maxSize={60}
                        colors={['#f133ff', '#a792f8', '#3357FF']}
                        quantity={14}
                        speed={0.7}
                    />
                </div>
                <div className={styles.menu}>
                    <button className={styles.menuButton}>
                        <Link href={`/projects/${project?.slug}`} >
                            {project?.title}
                        </Link>
                    </button>
                </div>
            </div>
        </>
    );
}


