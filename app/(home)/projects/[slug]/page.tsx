import type { Metadata, ResolvingMetadata } from "next";
import { groq, type PortableTextBlock } from "next-sanity";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

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
import { resolveOpenGraphImage } from "@/sanity/lib/utils";

type Props = {
  params: { slug: string };
};

const projectSlugs = groq`*[_type == "project"]{slug}`;

const projectBySlugQuery = groq`*[_type == "project" && slug.current == $slug] [0] {
  documentation,
  description,
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  author,
  type,
  showcaseImage,
  showcaseVideo {
    asset-> {
      ...
    },
  },
  showcaseAudio {
    asset-> {
      ...
    },
  },
  showcaseText,
  showcaseWebsite,
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
    <div className="container mx-auto px-5">
      <h2 className="mb-16 mt-10 text-2xl font-bold leading-tight tracking-tight md:text-4xl md:tracking-tighter">
        <Link href="/" className="hover:underline">
          {settings?.title || demo.title}
        </Link>
      </h2>
      <article>
        <h1 className="text-balance mb-12 text-6xl font-bold leading-tight tracking-tighter md:text-7xl md:leading-none lg:text-8xl">
          {project.title}
        </h1>
        <div className="mb-8 sm:mx-0 md:mb-16">
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
          {project.type === "text" && <pre className="text-2xl">{project.showcaseText}</pre>}
          {project.type === "website" && project.showcaseWebsite && <a href={project.showcaseWebsite} target="_blank"><iframe className="shadow-md transition-shadow duration-200 group-hover:shadow-lg sm:mx-0" style={{ width: "100%", aspectRatio: "16/9", pointerEvents: "none" }} src={project.showcaseWebsite}></iframe></a>}
        </div>
        <div className="hidden md:mb-12 md:block">
          {project.author}
        </div>
        {project.documentation?.length && (
          <PortableText
            className="mx-auto max-w-2xl"
            value={project.documentation as PortableTextBlock[]}
          />
        )}
      </article>
    </div>
  );
}
