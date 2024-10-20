// components/ListProjects.tsx

/* eslint-disable @next/next/no-img-element */

import { sanityFetch } from "@/sanity/lib/fetch";
import type { ProjectsListQueryResult } from "@/sanity.types";

import listStyles from "@/components/list/projectList.module.css";
import { projectsListQuery } from "@/sanity/lib/queries";
import Link from "next/link";

export default async function ProjectList() {
  const projects = await sanityFetch<ProjectsListQueryResult>({ query: projectsListQuery, params: { orderBy: "title" } });

  const projectPositions = projects.map((project, index) => ({
    title: project.title,
    slug: project.slug,
    author: project.author || "unbekannt",
    description: project.description,
  }));

  return (
    <>
      <div className={listStyles.projectContainer}>
        {projectPositions.map((project) => (
          <div key={project.slug}>
            <Link href={`/projectlist/${project.slug}`} className={listStyles.projectPointContainer}>
              <div className={listStyles.projectPoint}></div>
              <h3 className={listStyles.projectTitle}>{project.title}</h3>
              <h4 className={listStyles.projectAuthor}>{project.author}</h4>
            </Link>
          </div>
        ))}
      </div>
      <div className={listStyles.waveContainer}>
        <div className={listStyles.wave}></div>
      </div>
    </>
  );
}
