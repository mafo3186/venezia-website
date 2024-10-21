import '@/app/global.css';
import { draftMode } from "next/headers";
import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery, projectsQuery } from "@/sanity/lib/queries";
import AlertBanner from "@/components/alert-banner";
import type { Metadata } from "next";
import { toPlainText, VisualEditing } from "next-sanity";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { ProjectsQueryResult, SettingsQueryResult } from "@/sanity.types";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";

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

export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityFetch<SettingsQueryResult>({
    query: settingsQuery,
    // Metadata should never contain stega
    stega: false,
  });
  const title = settings?.title;
  const description = settings?.description;

  const ogImage = resolveOpenGraphImage(settings?.ogImage);
  let metadataBase: URL | undefined = undefined;
  try {
    metadataBase = settings?.ogImage?.metadataBase
      ? new URL(settings.ogImage.metadataBase)
      : undefined;
  } catch {
    // ignore
  }
  return {
    metadataBase,
    title: {
      template: `%s | ${title}`,
      default: title!,
    },
    description: toPlainText(description!),
    openGraph: {
      images: ogImage ? [ogImage] : [],
    },
  };
}

const hotspots: Hotspot[] = hotspotsRaw as any;
const hotspotOrder = hotspots
  .map((hotspot, index) => ({ id: hotspot.id, index }))
  .reduce(
    (acc, b) => {
      acc[b.id] = b.index;
      return acc;
    },
    {} as Record<string, number>,
  );

const spotsRaw: Spot[] = spotsGltf.nodes;
const spots = spotsRaw
  .map((node) => {
    const [hotspotId, numeric] = node.name.split(".");
    return {
      ...node,
      hotspotId,
      index: parseInt(numeric) - 1,
    };
  })
  .sort((a, b) => {
    if (a.index !== b.index) {
      return a.index - b.index;
    } else {
      return hotspotOrder[a.hotspotId] - hotspotOrder[b.hotspotId];
    }
  });

function groupBy<T>(elements: T[], key: (value: T) => string) {
  return elements.reduce(
    (accumulator, value) => {
      (accumulator[key(value)] = accumulator[key(value)] || []).push(value);
      return accumulator;
    },
    {} as Record<string, T[]>,
  );
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, projects] = await Promise.all([
    sanityFetch<SettingsQueryResult>({ query: settingsQuery }),
    sanityFetch<ProjectsQueryResult>({ query: projectsQuery }),
  ]);
  const projectsAtSpots = projects.map((project, index) => ({
    project,
    spot: spots[index],
  }));
  const projectsByHotspot = groupBy(
    projectsAtSpots,
    (projectAtSpot) => projectAtSpot.spot.hotspotId,
  );
  const projectsAtHotspots = Object.entries(projectsByHotspot).map(
    ([id, projects]) => ({
      hotspotId: id,
      hotspot: hotspots.find((hotspot) => hotspot.id === id)!,
      projects: projects ?? [],
    }),
  );
  const emptySpots = spots.slice(projects.length);
  return (
    <html lang="de">
    <body>
    {draftMode().isEnabled && <AlertBanner />}
    <SettingsProvider settings={settings}>
      <ProjectsProvider
        projects={projectsAtHotspots}
        emptySpots={emptySpots}
      >
        <HotspotProvider>
          <VisitedProvider>
            <GlobalAudioProvider>
              <Menu projects={projectsAtHotspots} />
              <section>{children}</section>
            </GlobalAudioProvider>
          </VisitedProvider>
        </HotspotProvider>
      </ProjectsProvider>
    </SettingsProvider>
    {draftMode().isEnabled && <VisualEditing />}
    <SpeedInsights />
    </body>
    </html>
  );
}
