/* eslint-disable @next/next/no-img-element */

import { sanityFetch } from "@/sanity/lib/fetch";
import { groq } from "next-sanity";
import type { ProjectsListQueryResult } from "@/sanity.types";
import Head from "next/head";
import Link from "next/link";

const projectsListQuery = groq`*[_type == "project"] | order(select($orderBy == "title" => title, $orderBy == "_updatedAt" => _updatedAt)) {_id, title, _updatedAt, description, "slug": slug.current}`

/// Reference: https://www.apache.org/icons/
export default async function ListProjectsPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const projects = await sanityFetch<ProjectsListQueryResult>({ query: projectsListQuery, params: { orderBy: searchParams["q"] ?? "title" } })

  return (
    <>
      <h1>Index of /~venice/projects</h1>

      <table>
        <thead>
          <tr>
            <th></th>
            <th><Link href="?q=title">Name</Link></th>
            <th><Link href="?q=_updatedAt">Last modified</Link></th>
            <th>Size</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr><td valign="top">
            <img src="https://www.apache.org/icons/back.png" alt="" />
          </td>
            <td>
              <Link href="/">Parent Directory</Link>
            </td></tr>{projects.map((project) => {
              return (<tr key={project._id}>
                <td valign="top">
                  <img src="https://www.apache.org/icons/image2.gif" alt="" />
                </td>
                <td><Link href={'/projects/' + project.slug}>{project.title}</Link></td>
                <td align="right">{project._updatedAt.replace(/T|Z/g, " ")}</td>
                <td align="right">N/A</td>
                <td>{project.description}</td>
              </tr>)
            })}
        </tbody>
      </table>
    </>
  )
}
