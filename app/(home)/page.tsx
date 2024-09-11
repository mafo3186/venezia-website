
import { sanityFetch } from '@/sanity/lib/fetch';
import { projectsQuery } from '@/sanity/lib/queries';
import type { ProjectsQueryResult } from '@/sanity.types';
import Layout from './components/layout';

export default async function page() {
    // Fetch the project data
    const projects = await sanityFetch<ProjectsQueryResult>({ query: projectsQuery });

    return (
        <Layout projects={projects}>
            {/* Hier könnte der Hauptinhalt der Startseite rein */}
            <div>
                <h1>Willkommen auf der Startseite</h1>
                <p>Entdecke unsere Projekte!</p>
            </div>
        </Layout>
    );
}