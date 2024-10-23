import { EmblaCarousel } from "@/components/projectPage/carousel";
import PortableText from "@/components/projectPage/documentation";
import ShowcasePiece from "@/components/projectPage/showcasePiece";
import type { ProjectBySlugQueryResult, ProjectSlugsResult } from "@/sanity.types";
import { projectBySlugQuery, projectSlugs } from "@/sanity/lib/queries";
import { type PortableTextBlock } from "next-sanity";
import { FaInfoCircle } from "react-icons/fa";
import styles from "./page.module.css";
import { client } from "@/sanity/lib/client";

export const dynamic = 'error'

export async function generateStaticParams() {
  return [{ slug: 'jeff', project: { documentation: [], description: "hi", title: "error", author: "ur mom", status: "published", _id: "-1", showcases: [] } }]

  // const params = await client.fetch<ProjectSlugsResult>(projectSlugs)

  // const res: { project: ProjectBySlugQueryResult, slug: string }[] = [];

  // for (const { slug } of params) {
  //   const project = await client.fetch<ProjectBySlugQueryResult>(projectBySlugQuery,
  //     { slug: slug?.current as string },
  //   )
  //   res.push({ slug: slug?.current as string, project });
  // }
  // return res;
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string, project: ProjectBySlugQueryResult }> }) {
  return <></>

  // const { slug, project } = await params;

  // if (!project) return <></>

  // return (
  //   <>
  //     {/* <VisitedProjectWrapper slug={slug} /> */}
  //     <div className={styles.pageContainer}>
  //       {/* <NavigationButtons /> */}
  //       <article className={styles.article}>
  //         {/* <Suspense fallback={<Loading />}> */}
  //         <div className={styles.content}>
  //           <div className={styles.showcaseAndTitle}>
  //             <hgroup className={styles.projectTitle}>
  //               <div className={styles.titleWithInfo}>
  //                 <h1>{project.title}</h1>
  //                 <div className={styles.infoIconWrapper}>
  //                   <FaInfoCircle
  //                     className={styles.infoIcon}
  //                     aria-describedby="projectDescription"
  //                   />
  //                   <span id="projectDescription" className={styles.tooltip}>
  //                     {project.description}
  //                   </span>
  //                 </div>
  //               </div>
  //               <div>von {project.author}</div>
  //             </hgroup>
  //             <main className={styles.showcase}>
  //               <EmblaCarousel>
  //                 {project.showcases && project.showcases.map((showcase, index) => {
  //                   return (
  //                     // <Suspense key={index} fallback={<Loading />}>
  //                     <ShowcasePiece key={index} showcase={showcase as any} author={project.author} />
  //                     // </Suspense>
  //                   );
  //                 })}
  //               </EmblaCarousel>
  //             </main>
  //           </div>
  //           <aside className={styles.documentation}>
  //             {project.documentation?.length && (
  //               <PortableText
  //                 value={project.documentation as PortableTextBlock[]}
  //               />
  //             )}
  //           </aside>
  //         </div>
  //         {/* </Suspense> */}
  //       </article>
  //     </div>
  //   </>
  // );
}
