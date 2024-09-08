import Link from "next/link";
import { groq } from "next-sanity";

import PortableText from "./portable-text";

import type { ProjectsQueryResult, SettingsQueryResult } from "@/sanity.types";
import * as demo from "@/sanity/lib/demo";
import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";

function Intro(props: { title: string | null | undefined; description: any }) {
  const title = props.title || demo.title;
  const description = props.description?.length
    ? props.description
    : demo.description;
  return (
    <section>
      <h1>
        {title || demo.title}
      </h1>
      <h2>
        <PortableText
          value={description?.length ? description : demo.description}
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
      <h3>
        <Link href={"/kaleidoscope"} >Kaleidoskop</Link>
      </h3>
      <h3>Kaleidoskop-Startseiten für Projekte</h3>
      <Intro title={settings?.title} description={settings?.description} />
      <ul>
        {projects?.map((project) => (
          <li key={project._id}>
            <h3>
              <Link href={`/kaleidoscope/${project.slug}`} >
                {project.title}
              </Link>
            </h3>
          </li>
        ))}
      </ul>
    </>
  );
}
