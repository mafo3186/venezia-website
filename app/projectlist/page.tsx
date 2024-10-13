/* eslint-disable @next/next/no-img-element */

import { sanityFetch } from "@/sanity/lib/fetch";
import type { ProjectsListQueryResult } from "@/sanity.types";
import Link from "next/link";
import styles from "@/components/staticPages/staticPages.module.css"
import listStyles from "@/components/projectPage/projectPageList.module.css"
import {projectsListQuery} from "@/sanity/lib/queries";
import {HomeButton3D} from "@/components/navigation/button";

export default async function ListProjectsPage() {
  const projects = await sanityFetch<ProjectsListQueryResult>({ query: projectsListQuery, params: { orderBy: "title" } });

  return (
    <div className={listStyles.background}>
      <div className={styles.boxContainer}>
        <div className={styles.navigation}>
          <HomeButton3D/>
        </div>
        <div className={styles.textContainer}>
          <h1>Index of /~venice/projects</h1>
          <table className={listStyles.projectTable}>
            <thead>
            <tr>
              <th></th>
              <th><Link href="?q=title">Name</Link></th>
              <th><Link href="?q=author">Autor*in</Link></th>
              <th><Link href="?q=_updatedAt">Last modified</Link></th>
              <th>Beschreibung</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td valign="top">
                <img src="https://www.apache.org/icons/back.png" alt=""/>
              </td>
              <td>
                <Link href="/">Parent Directory</Link>
              </td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            {projects.map((project) => (
              <tr key={project._id}>
                <td valign="top">
                  <img src="https://www.apache.org/icons/image2.gif" alt=""/>
                </td>
                <td><Link href={'/projectlist/' + project.slug}>{project.title}</Link></td>
                <td align="left">{project.author || "unbekannt"}</td>
                <td align="right">{project._updatedAt.replace(/T|Z/g, " ")}</td>
                <td>{project.description}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
