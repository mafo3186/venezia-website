// contexts.tsx
"use client";
import React, { createContext, useContext, useState } from "react";
import { ProjectsQueryResult, SettingsQueryResult } from "@/sanity.types";
import { PreDefinedView } from "./types";

// Typ für Hotspot-Kontext
interface HotspotContextType {
  hotspot: PreDefinedView | undefined;
  setHotspot: React.Dispatch<React.SetStateAction<PreDefinedView | undefined>>;
}

// Erstelle die Kontexte
const ProjectsContext = createContext<ProjectsQueryResult | null>(null);
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
export const ProjectsProvider = ({ children, projects }: { children: React.ReactNode; projects: ProjectsQueryResult }) => (
  <ProjectsContext.Provider value={projects}>
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