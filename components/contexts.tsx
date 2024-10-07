// contexts.tsx
"use client";
import React, { createContext, useContext, useMemo, useState } from "react";
import { SettingsQueryResult } from "@/sanity.types";
import {
  AllSpotsWithProjects,
  HotspotsWithProjects,
  PreDefinedView,
  Spot,
} from "./types";

// Typ für Hotspot-Kontext
interface HotspotContextType {
  hotspot: PreDefinedView | undefined;
  setHotspot: React.Dispatch<React.SetStateAction<PreDefinedView | undefined>>;
}

// Erstelle die Kontexte
const ProjectsContext = createContext<AllSpotsWithProjects>({
  projects: [],
  emptySpots: [],
});
const SettingsContext = createContext<SettingsQueryResult | null>(null);
const HotspotContext = createContext<HotspotContextType | undefined>(undefined);


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

// Provider für Projekte
export const ProjectsProvider = ({
  children,
  projects,
  emptySpots,
}: {
  children: React.ReactNode;
  projects: HotspotsWithProjects;
  emptySpots: Spot[];
}) => (
  <ProjectsContext.Provider
    value={useMemo(() => ({ projects, emptySpots }), [projects, emptySpots])}
  >
    {children}
  </ProjectsContext.Provider>
);

// Provider für Einstellungen
export const SettingsProvider = ({ children, settings }: { children: React.ReactNode; settings: SettingsQueryResult }) => (
  <SettingsContext.Provider value={settings}>
    {children}
  </SettingsContext.Provider>
);

// Provider für Hotspots
export const HotspotProvider = ({ children }: { children: React.ReactNode }) => {
  const [hotspot, setHotspot] = useState<PreDefinedView | undefined>(undefined);
  return (
    <HotspotContext.Provider value={{ hotspot, setHotspot }}>
      {children}
    </HotspotContext.Provider>
  );
};
