import Link from "next/link";
import { groq } from "next-sanity";
import { Suspense } from "react";

import Avatar from "./avatar";
import CoverImage from "./cover-image";
import DateComponent from "./date";
import MoreStories from "./more-stories";
import Onboarding from "./onboarding";
import PortableText from "./portable-text";

import type { HeroQueryResult, ProjectsQueryResult, SettingsQueryResult } from "@/sanity.types";
import * as demo from "@/sanity/lib/demo";
import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";

function Intro(props: { title: string | null | undefined; description: any }) {
  const title = props.title || demo.title;
  const description = props.description?.length
    ? props.description
    : demo.description;
  return (
    <section className="mt-16 mb-16 flex flex-col items-center lg:mb-12 lg:flex-row lg:justify-between">
      <h1 className="text-balance text-6xl font-bold leading-tight tracking-tighter lg:pr-8 lg:text-8xl">
        {title || demo.title}
      </h1>
      <h2 className="text-pretty mt-5 text-center text-lg lg:pl-8 lg:text-left">
        <PortableText
          className="prose-lg"
          value={description?.length ? description : demo.description}
        />
      </h2>
    </section>
  );
}

export const projectsQuery = groq`*[_type == "project" && defined(slug.current)] | order(date desc, _updatedAt desc) {
  content,
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  author,
}`;

export default async function Page() {
  const [settings, projects] = await Promise.all([
    sanityFetch<SettingsQueryResult>({
      query: settingsQuery,
    }),
    sanityFetch<ProjectsQueryResult>({ query: projectsQuery }),
  ]);

  return (
    <div className="container mx-auto px-5">
      <Intro title={settings?.title} description={settings?.description} />
      {projects?.map((project) => (<>
        <div className="mb-4">
          <div>
            <h3 className="text-pretty text-lg leading-tight">
              <Link href={`/projects/${project.slug}`} className="hover:underline">
                {project.title}
              </Link>
            </h3>
          </div>
        </div>
      </>))}
    </div>
  );
}
