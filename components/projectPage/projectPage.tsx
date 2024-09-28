import type { Metadata, ResolvingMetadata } from "next";
import { type PortableTextBlock } from "next-sanity";
import { notFound } from "next/navigation";

import type {
  Project,
  ProjectBySlugQueryResult,
  ProjectSlugsResult,
  SettingsQueryResult, Showcase,
} from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { projectBySlugQuery, projectSlugs, settingsQuery } from "@/sanity/lib/queries";
import { Suspense } from "react";
import styles from "@/components/projectPage/projectPage.module.css";
import { EmblaCarousel } from "@/components/projectPage/carousel";
import ShowcasePiece from "@/components/projectPage/showcasePiece";
import PortableText from "@/components/projectPage/documentation";
import { BackButton, HomeButton } from "@/components/button";

export type Props = {
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

export default async function ProjectPage({ params }: Props) {
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
    
  return (
    <div className={styles.pageContainer}>
      <div className={styles.navigationButtons}>
        <HomeButton />
        <BackButton />
      </div>
      <article className={styles.article}>
        <div className={styles.content}>
          <div className={styles.showcaseAndTitle}>
            <hgroup className={styles.projectTitle}>
              <h1>
                {project.title}
              </h1>
              <p>
                von {project.author}
              </p>
            </hgroup>
            <main className={styles.showcase}>
              <EmblaCarousel>
                {project.showcases && project.showcases.map((showcase, index) => {
                  return (
                    <Suspense key={index}>
                      <ShowcasePiece showcase={showcase as any} />
                    </Suspense>
                  );
                })}
              </EmblaCarousel>
            </main>
          </div>
          <aside className={styles.documentation}>
            {project.documentation?.length && (
              <PortableText
                value={project.documentation as PortableTextBlock[]}
              />
            )}
          </aside>
        </div>
      </article>
    </div>
  );
}
