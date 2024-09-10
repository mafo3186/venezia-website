import type { PortableTextBlock } from 'next-sanity';
import { notFound } from "next/navigation";
import styles from "./projectDetails.module.css" //toDo: define Types
import CoverImage from '@/app/(home)/cover-image';
import PortableText from '@/app/(home)/portable-text';
import { ProjectBySlugQueryResult } from '@/sanity.types';
import Link from 'next/link';

type ProjectDetailPageProps = {
    project: ProjectBySlugQueryResult;
};

export default function ProjectDetailPage({ project }: ProjectDetailPageProps) {
    if (!project?._id) {
        return notFound();
    }
    const showcaseVideo = project.showcaseVideo?.asset;
    const showcaseAudio = project.showcaseAudio?.asset;

    return (
        <>
            <nav>
                <h2>
                    <Link href="/">X</Link>
                </h2>
            </nav>
            <div className={styles.detailPageContainer}>
                <article className={styles.article}>
                    <hgroup className={styles.projectTitle}>
                        <h1>{project.title}</h1>
                        <p>von {project.author}</p>
                    </hgroup>
                    <figure>
                        {project.type === 'image' && <CoverImage image={project.showcaseImage} priority />}
                        {project.type === 'video' && showcaseVideo?.url && (
                            <video controls autoPlay muted loop>
                                <source src={showcaseVideo.url} type={showcaseVideo.mimeType} />
                            </video>
                        )}
                        {project.type === 'audio' && showcaseAudio?.url && (
                            <audio controls>
                                <source src={showcaseAudio.url} type={showcaseAudio.mimeType} />
                            </audio>
                        )}
                        {project.type === 'text' && <pre>{project.showcaseText}</pre>}
                        {project.type === 'website' && project.showcaseWebsite && (
                            <a href={project.showcaseWebsite} target="_blank">
                                <iframe className={styles.website} src={project.showcaseWebsite}></iframe>
                            </a>
                        )}
                        <figcaption>{project.author}</figcaption>
                    </figure>
                    <aside>
                        {project.documentation?.length && (
                            <PortableText className={styles.documentation} value={project.documentation as PortableTextBlock[]} />
                        )}
                    </aside>
                </article>
            </div>
        </>
    );
}
