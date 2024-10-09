// contexts.tsx
"use client";
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from "react";
import { SettingsQueryResult } from "@/sanity.types";
import {
  AllSpotsWithProjects,
  HotspotsWithProjects,
  PreDefinedView,
  Spot,
} from "./types";
import { useLocalStorage } from "./hooks/local-storage";

// Typ für Hotspot-Kontext
interface HotspotContextType {
  hotspot: PreDefinedView | undefined;
  setHotspot: Dispatch<SetStateAction<PreDefinedView | undefined>>;
}

type VisitedContextType = Readonly<
  [string[], setVisited: Dispatch<SetStateAction<string[]>>]
>;

// Erstelle die Kontexte
const ProjectsContext = createContext<AllSpotsWithProjects>({
  projects: [],
  emptySpots: [],
});
const SettingsContext = createContext<SettingsQueryResult | null>(null);
const HotspotContext = createContext<HotspotContextType | undefined>(undefined);
const VisitedContext = createContext<VisitedContextType>([[], () => {}]);

// Hook zum Abrufen von Projekten
export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectsProvider");
  }
  return context;
};

// Hook zum Abrufen von Einstellungen
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

// Hook zum Abrufen von Hotspots
export const useHotspot = () => {
  const context = useContext(HotspotContext);
  if (context === undefined) {
    throw new Error("useHotspot must be used within a HotspotProvider");
  }
  return context;
};

export const useVisited = () => {
  const context = useContext(VisitedContext);
  if (context === undefined) {
    throw new Error("useVisited must be used within a VisitedProvider");
  }
  return context;
};

// Provider für Projekte
export const ProjectsProvider = ({
  children,
  projects,
  emptySpots,
}: PropsWithChildren<{
  projects: HotspotsWithProjects;
  emptySpots: Spot[];
}>) => (
  <ProjectsContext.Provider
    value={useMemo(() => ({ projects, emptySpots }), [projects, emptySpots])}
  >
    {children}
  </ProjectsContext.Provider>
);

// Provider für Einstellungen
export const SettingsProvider = ({
  children,
  settings,
}: PropsWithChildren<{ settings: SettingsQueryResult }>) => (
  <SettingsContext.Provider value={settings}>
    {children}
  </SettingsContext.Provider>
);

// Provider für Hotspots
export const HotspotProvider = ({ children }: PropsWithChildren) => {
  const [hotspot, setHotspot] = useState<PreDefinedView | undefined>(undefined);
  return (
    <HotspotContext.Provider value={{ hotspot, setHotspot }}>
      {children}
    </HotspotContext.Provider>
  );
};

const fallback: string[] = [];

export const VisitedProvider = ({ children }: PropsWithChildren) => {
  const visited = useLocalStorage<string[]>("visitedProjects", fallback);
  return (
    <VisitedContext.Provider value={visited}>
      {children}
    </VisitedContext.Provider>
  );
};
