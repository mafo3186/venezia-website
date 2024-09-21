import type { Metadata } from "next";
import {groq, PortableTextBlock} from "next-sanity";
import { notFound } from "next/navigation";

import type {
  ProjectBySlugQueryResult,
  SettingsQueryResult,
} from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";
import styles from "@/app/(home)/projects/[slug]/styles.module.css";
import {BackButton, HomeButton} from "@/components/button";
import {EmblaCarousel} from "@/components/carousel";
import {Suspense} from "react";
import ShowcasePiece from "@/components/showcasePiece";
import PortableText from "@/components/documentation";

// Statischer Slug für das Testprojekt
const TEST_SLUG = "der-stoer-eine-oral-history";

const projectBySlugQuery = groq`*[_type == "project" && slug.current == $slug] [0] {
  description,
  _id,
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  author,
  type
}`;

export async function generateMetadata(): Promise<Metadata> {
  const project = await sanityFetch<ProjectBySlugQueryResult>({
    query: projectBySlugQuery,
    params: { slug: TEST_SLUG }, // Verwende den statischen Slug
    stega: false,
  });

  return {
    title: project?.title || "Untitled Project",
    description: project?.description || "No description available.",
  };
}

export default async function TestPage() {
  const [project, settings] = await Promise.all([
    sanityFetch<ProjectBySlugQueryResult>({
      query: projectBySlugQuery,
      params: { slug: TEST_SLUG }, // Verwende den statischen Slug
    }),
    sanityFetch<SettingsQueryResult>({
      query: settingsQuery,
    }),
  ]);

  if (!project?._id) {
    return notFound();
  }

  return (
    <div>
      <div className={styles.navigationButtons}>
        <HomeButton/>
        <BackButton/>
      </div>
      <h1>Hallo</h1>
      <p>{project.title}</p>
      <p>{project.description}</p>
      <article className={styles.article}>
        <div className={styles.content}>
          <div className={styles.showcaseAndTitle}>
            <hgroup className={styles.projectTitle}>
              <h1>{project.title}</h1>
              <p>von {project.author}</p>
            </hgroup>
            <main className={styles.showcase}>
              
                {project.showcases &&
                  project.showcases.map((showcase, index) => {
                    return (
                      <Suspense key={index}>
                        <ShowcasePiece showcase={showcase as any}/>
                      </Suspense>
                    );
                  })}

            </main>
          </div>
          <aside className={styles.documentation}>
            {project.documentation?.length && (
              <PortableText value={project.documentation as PortableTextBlock[]}/>
            )}
          </aside>
        </div>
      </article>
    </div>
  );
}
