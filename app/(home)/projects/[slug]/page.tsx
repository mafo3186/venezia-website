import type { Metadata, ResolvingMetadata } from "next";
import { type PortableTextBlock } from "next-sanity";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projectBySlugQuery, projectSlugs } from "@/sanity/lib/queries";

import CoverImage from "../../cover-image";
import PortableText from "../../portable-text";

import type {
  ProjectBySlugQueryResult,
  ProjectSlugsResult,
  SettingsQueryResult,
} from "@/sanity.types";
import * as demo from "@/sanity/lib/demo";
import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";
import styles from "./styles.module.css";

type Props = {
  params: { slug: string };
};


export async function generateStaticParams() {
  const params = await sanityFetch<ProjectSlugsResult>({
    query: projectSlugs,
    perspective: "published",
    stega: false,
  });
  return params.map(({ slug }) => ({ slug: slug?.current }));
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const project = await sanityFetch<ProjectBySlugQueryResult>({
    query: projectBySlugQuery,
    params,
    stega: false,
  });
  const previousImages = (await parent).openGraph?.images || [];
  const ogImage = undefined; // resolveOpenGraphImage(post?.coverImage);

  return {
    authors: project?.author ? [{ name: project?.author }] : [],
    title: project?.title,
    description: project?.description,
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  } satisfies Metadata;
}

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

  if (!project?._id) {
    return notFound();
  }

  const showcaseVideo = project.showcaseVideo?.asset;
  const showcaseAudio = project.showcaseAudio?.asset;

  return (
    <>
      <nav>
        <h2>
          <Link href="/" className="hover:underline">
            {settings?.title || demo.title}
          </Link>
        </h2>
      </nav>
      <article className={styles.article}>
        <hgroup className={styles.projectTitle}>
          <h1>
            {project.title}
          </h1>
          <p>
            von {project.author}
          </p>
        </hgroup>
        <figure>
          {project.type === "image" && <CoverImage image={project.showcaseImage} priority />}
          {project.type === "video" && showcaseVideo?.url && <video controls autoPlay muted loop>
            <source
              src={showcaseVideo.url}
              type={showcaseVideo.mimeType}
            />
          </video>}
          {project.type === "audio" && showcaseAudio?.url && <audio controls>
            <source
              src={showcaseAudio.url}
              type={showcaseAudio.mimeType}
            />
          </audio>}
          {project.type === "text" && <pre>{project.showcaseText}</pre>}
          {project.type === "website" && project.showcaseWebsite && <a href={project.showcaseWebsite} target="_blank"><iframe className={styles.website} src={project.showcaseWebsite}></iframe></a>}
          <figcaption>{project.author}</figcaption>
        </figure>
        <aside>
          {project.documentation?.length && (
            <PortableText
              className={styles.documentation}
              value={project.documentation as PortableTextBlock[]}
            />
          )}
        </aside>
      </article>
    </>
  );
}
