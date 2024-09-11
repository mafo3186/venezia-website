
import type { Metadata, ResolvingMetadata } from "next";
import { groq, type PortableTextBlock } from "next-sanity";
import Link from "next/link";
import { notFound } from "next/navigation";

import PortableText from "@/app/(home)/portable-text";

import type {
  ProjectBySlugQueryResult,
  ProjectSlugsResult,
  SettingsQueryResult,
} from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";
import styles from "./styles.module.css";
import { title } from "process";
import { EmblaCarousel } from "./carousel";
import ShowcasePiece from "./showcase-piece";
import { Suspense } from "react";
import { assert } from "console";

type Props = {
  params: { slug: string };
};

const projectSlugs = groq`*[_type == "project"]{slug}`;

const projectBySlugQuery = groq`*[_type == "project" && slug.current == $slug] [0] {
  "documentation": documentation[] {
    ...,
    _type == "file" => {
      asset->
    }
  },
  description,
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  author,
  type,
  "showcases": showcase[] {
    type,
    type == 'image' => showcaseImage.asset->{"content": url, "blurHash": metadata.blurHash, mimeType},
    type == 'audio' => showcaseAudio.asset->{"content": url, mimeType},
    type == 'video' => showcaseVideo.asset->{"content": url, mimeType},
    type == 'text' => @{"content": showcaseText},
    type == 'website' => @{"content": showcaseWebsite},
    description
  }
}`;

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
    <>
      <nav>
        <h2>
          <Link href="/" className="hover:underline">
            {settings?.title}
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
        <section className={styles.showcase}>
          <EmblaCarousel>
            {project.showcases && project.showcases.map((showcase, index) => {
              return (
                <Suspense key={index} fallback={<div>Loading...</div>}>
                  <ShowcasePiece showcase={showcase as any} />
                </Suspense>
              );
            })}
          </EmblaCarousel>
        </section>
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
