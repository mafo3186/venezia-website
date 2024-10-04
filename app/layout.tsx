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
import { HotspotProvider, ProjectsProvider, SettingsProvider } from "@/components/contexts";
import Menu from "@/components/menu";

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


export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, projects] = await Promise.all([
    sanityFetch<SettingsQueryResult>({ query: settingsQuery }),
    sanityFetch<ProjectsQueryResult>({ query: projectsQuery }),
  ]);

  return (
    <html lang="de">
    <body>
    {draftMode().isEnabled && <AlertBanner />}
    <SettingsProvider settings={settings}>
      <ProjectsProvider projects={projects}>
        <HotspotProvider>
          <Menu projects={projects} />
          <section>{children}</section>
        </HotspotProvider>
      </ProjectsProvider>
    </SettingsProvider>
    {draftMode().isEnabled && <VisualEditing />}
    <SpeedInsights />
    </body>
    </html>
  );
}
