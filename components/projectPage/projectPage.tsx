import type { Metadata, ResolvingMetadata } from "next";
import { type PortableTextBlock } from "next-sanity";
import { notFound } from "next/navigation";
import { FaInfoCircle } from "react-icons/fa";
import type { ProjectBySlugQueryResult, ProjectSlugsResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { projectBySlugQuery, projectSlugs } from "@/sanity/lib/queries";
import { Suspense } from "react";
import styles from "@/components/projectPage/projectPage.module.css";
import { EmblaCarousel } from "@/components/projectPage/carousel";
import ShowcasePiece from "@/components/projectPage/showcasePiece";
import PortableText from "@/components/projectPage/documentation";
import Loading from "@/components/loading";
import VisitedProjectWrapper from "@/components/projectPage/visitedProjectWrapper";
import HomeButtonSwitcher from "@/components/hooks/buttonSwitcher";

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
  const project = await sanityFetch<ProjectBySlugQueryResult>({
    query: projectBySlugQuery,
    params,
  });

  if (!project?._id) {
    return notFound();
  }

  return (
    <>
      <VisitedProjectWrapper slug={params.slug} />
      <div className={styles.pageContainer}>
        <div className={styles.navigationButtons}>
          {<HomeButtonSwitcher />}
        </div>
        <article className={styles.article}>
          <Suspense fallback={<Loading />}>
            <div className={styles.content}>
              <div className={styles.showcaseAndTitle}>
                <hgroup className={styles.projectTitle}>
                  <div className={styles.titleWithInfo}>
                    <h1>{project.title}</h1>
                    <div className={styles.infoIconWrapper}>
                      <FaInfoCircle
                        className={styles.infoIcon}
                        aria-describedby="projectDescription"
                      />
                      <span id="projectDescription" className={styles.tooltip}>
                        {project.description}
                      </span>
                    </div>
                  </div>
                  <div>von {project.author}</div>
                </hgroup>
                <main className={styles.showcase}>
                  <EmblaCarousel>
                    {project.showcases && project.showcases.map((showcase, index) => {
                      return (
                        <Suspense key={index} fallback={<Loading />}>
                          <ShowcasePiece showcase={showcase as any} author={project.author} />
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
          </Suspense>
        </article>
      </div>
    </>
  );
}
