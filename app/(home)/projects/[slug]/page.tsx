
import type { Metadata, ResolvingMetadata } from "next";

import { notFound } from "next/navigation";
import { projectBySlugQuery, projectSlugs } from "@/sanity/lib/queries";

import type {
  ProjectBySlugQueryResult,
  ProjectSlugsResult,
  SettingsQueryResult,
} from "@/sanity.types";

import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";

import ProjectDetailPage from "./components/projectDetails";

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
      <ProjectDetailPage project={project} />
    </>
  );
}
