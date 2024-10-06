/* eslint-disable @next/next/no-img-element */

import { sanityFetch } from "@/sanity/lib/fetch";
import { groq } from "next-sanity";
import type { ProjectsListQueryResult } from "@/sanity.types";
import Link from "next/link";
import styles from "./projectPageList.module.css";


const projectsListQuery = groq`*[_type == "project"] | order(select($orderBy == "title" => title, $orderBy == "_updatedAt" => _updatedAt)) {_id, title, _updatedAt, description, "slug": slug.current}`;

export default async function ListProjectsPage() {
  const projects = await sanityFetch<ProjectsListQueryResult>({ query: projectsListQuery, params: { orderBy: "title" } });

  return (
    <div className={styles.pageContainer}>
      <h1>Index of /~venice/projects</h1>

      <table className={styles.projectTable}>
        <thead>
        <tr>
          <th></th>
          <th><Link href="?q=title">Name</Link></th>
          <th>Autor*in</th>
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
        </tr>
        {projects.map((project) => (
          <tr key={project._id}>
            <td valign="top">
              <img src="https://www.apache.org/icons/image2.gif" alt=""/>
            </td>
            <td><Link href={'/projectlist/' + project.slug}>{project.title}</Link></td>
            <td align="left">toDo</td>
            <td align="right">{project._updatedAt.replace(/T|Z/g, " ")}</td>
            <td>{project.description}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}
