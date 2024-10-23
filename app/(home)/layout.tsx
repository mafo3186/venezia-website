import '@/app/global.css';
import { settingsQuery, projectsQuery } from "@/sanity/lib/queries";
import type { ProjectsQueryResult, SettingsQueryResult } from "@/sanity.types";

import {
  HotspotProvider,
  ProjectsProvider,
  SettingsProvider,
  VisitedProvider,
} from "@/components/contexts";
import Menu from "@/components/navigation/menu";
import { Hotspot, Spot } from "@/components/types";
import spotsGltf from "@/data/spots.gltf";
import hotspotsRaw from "@/data/hotspots.json";
import { GlobalAudioProvider } from '@/components/global-audio';
import { kotta, notoMono } from '../fonts';

export const dynamic = 'error'

// async function getStuff() {
//   const hotspots: Hotspot[] = hotspotsRaw as any;
//   const hotspotOrder = hotspots
//     .map((hotspot, index) => ({ id: hotspot.id, index }))
//     .reduce(
//       (acc, b) => {
//         acc[b.id] = b.index;
//         return acc;
//       },
//       {} as Record<string, number>,
//     );

//   const spotsRaw: Spot[] = spotsGltf.nodes;
//   const spots = spotsRaw
//     .map((node) => {
//       const [hotspotId, numeric] = node.name.split(".");
//       return {
//         ...node,
//         hotspotId,
//         index: parseInt(numeric) - 1,
//       };
//     })
//     .sort((a, b) => {
//       if (a.index !== b.index) {
//         return a.index - b.index;
//       } else {
//         return hotspotOrder[a.hotspotId] - hotspotOrder[b.hotspotId];
//       }
//     });

//   function groupBy<T>(elements: T[], key: (value: T) => string) {
//     return elements.reduce(
//       (accumulator, value) => {
//         (accumulator[key(value)] = accumulator[key(value)] || []).push(value);
//         return accumulator;
//       },
//       {} as Record<string, T[]>,
//     );
//   }

//   const [settings, projects] = await Promise.all([
//     sanityFetch<SettingsQueryResult>({ query: settingsQuery }),
//     sanityFetch<ProjectsQueryResult>({ query: projectsQuery }),
//   ]);

//   const projectsAtSpots = projects.map((project, index) => ({
//     project,
//     spot: spots[index],
//   }));
//   const projectsByHotspot = groupBy(
//     projectsAtSpots,
//     (projectAtSpot) => projectAtSpot.spot.hotspotId,
//   );
//   const projectsAtHotspots = Object.entries(projectsByHotspot).map(
//     ([id, projects]) => ({
//       hotspotId: id,
//       hotspot: hotspots.find((hotspot) => hotspot.id === id)!,
//       projects: projects ?? [],
//     }),
//   );
//   const emptySpots = spots.slice(projects.length);

//   return {
//     settings,
//     emptySpots,
//     projects: projectsAtHotspots,
//   }
// }

export default function RootLayout({ children, params: { settings, emptySpots, projects } }: { children: React.ReactNode, params: any }) {
  return (
    <html lang="de" className={`${kotta.variable} ${notoMono.variable}`}>
      <body>
        <SettingsProvider settings={settings}>
          <ProjectsProvider
            projects={projects}
            emptySpots={emptySpots}
          >
            <HotspotProvider>
              <VisitedProvider>
                <GlobalAudioProvider>
                  <Menu projects={projects} />
                  <section>{children}</section>
                </GlobalAudioProvider>
              </VisitedProvider>
            </HotspotProvider>
          </ProjectsProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
