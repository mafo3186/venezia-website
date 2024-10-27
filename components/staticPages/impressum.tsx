import styles from "./staticPages.module.css";
import Link from "next/link";
import {sanityFetch} from "@/sanity/lib/fetch";
import type {ProjectsListQueryResult} from "@/sanity.types";
import {projectsListQuery} from "@/sanity/lib/queries";

export default async function Impressum() {
  
  const projects = await sanityFetch<ProjectsListQueryResult>({query: projectsListQuery, params: {orderBy: "author"}});
  
  const uniqueAuthors = Array.from(
    new Set(
      projects
        .filter((project) => project.title !== "Venezia Website")
        .map((project) => project.author)
    )
  );
  
  return (<>
    <h1>Impressum</h1>
    <div className={styles.bold}>
      <p>
        Hochschule Düsseldorf<br/>
        University of Applied Sciences
      </p>
    </div>
    <p>
      Münsterstraße 156, Gebäude 2<br/>
      40476 Düsseldorf<br/>
      Tel.: +49 211 4351-0<br/>
      Fax: +49 211 4351-19000
    </p>
    <h3>Verantwortlich für den Inhalt</h3>
    <p>
      Studentisches Projektteam unter der Leitung von <Link href="https://medien.hs-duesseldorf.de/schwab-trapp">Prof.
      Gabriele Schwab-Trapp</Link><br/>
      <ul>
        <li><strong>Individuelle Projekte:</strong> {uniqueAuthors.join(", ")}</li>
        <li><strong>Venezia Website: </strong><Link href="https://github.com/benthillerkus">Bent Hillerkus</Link>, <Link
          href="https://github.com/exploids">Luca Selinski</Link>, <Link href="https://github.com/mafo3186">Mareike
          Focken</Link></li>
      </ul>
      Fachbereich Medien<br/>
      Hochschule Düsseldorf
    </p>
    <p>
      Die Hochschule Düsseldorf ist eine Körperschaft des Öffentlichen Rechtes. Sie wird durch die Präsidentin,
      Prof. Dr. Edeltraud Vomberg, gesetzlich vertreten.
    </p>
  </>);
}
