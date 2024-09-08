import Link from "next/link";
import { groq } from "next-sanity";

import PortableText from "./portable-text";

import type { ProjectsQueryResult, SettingsQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";

function Intro(props: { title: string | null | undefined; description: any }) {
  const title = props.title!;
  const description = props.description!;
  return (
    <section>
      <h1>
        {title!}
      </h1>
      <h2>
        <PortableText
          value={description}
        />
      </h2>
    </section>
  );
}

const projectsQuery = groq`*[_type == "project" && defined(slug.current)] | order(date desc, _updatedAt desc) {
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
    <>
      <Intro title={settings?.title} description={settings?.description} />
      <ul>
        {projects?.map((project) => (
          <li key={project._id}>
            <h3>
              <Link href={`/projects/${project.slug}`} >
                {project.title}
              </Link>
            </h3>
          </li>
        ))}
      </ul>
    </>
  );
}
