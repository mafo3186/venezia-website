// components/ListProjects.tsx

/* eslint-disable @next/next/no-img-element */

import { sanityFetch } from "@/sanity/lib/fetch";
import type { ProjectsListQueryResult } from "@/sanity.types";

import listStyles from "@/components/staticPages/projectList.module.css";
import { projectsListQuery } from "@/sanity/lib/queries";
import { HomeButton3D } from "@/components/navigation/button";
import Link from "next/link";

export default async function ProjectList() {
  const projects = await sanityFetch<ProjectsListQueryResult>({ query: projectsListQuery, params: { orderBy: "title" } });

  // Hier definieren wir die Positionen der Projekte, um sie im Raster anzuzeigen
  const projectPositions = projects.map((project, index) => ({
    title: project.title,
    slug: project.slug,
    author: project.author || "unbekannt",
    updatedAt: project._updatedAt.replace(/T|Z/g, " "),
    description: project.description,
    position: {
      x: (index % 5) * 150 + 50, // Beispielposition
      y: Math.floor(index / 5) * 150 + 100, // Angepasste Y-Position für mehr Platz
    },
  }));

  return (
    <div className={listStyles.pageContainer}>
      <div className={listStyles.navigationButtons}>
        <HomeButton3D />
      </div>
      <div className={listStyles.projectContainer}>
        {projectPositions.map((project) => (
          <div key={project.slug} className={listStyles.projectPointContainer}>
            <Link href={`/projectlist/${project.slug}`} className={listStyles.projectTitle}>
              <div className={listStyles.projectPoint}></div>
              {project.title} – {project.author}
            </Link>
          </div>
        ))}
      </div>
      <div className={listStyles.wave}></div>
    </div>
  );
}
