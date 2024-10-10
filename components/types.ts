import { ProjectsQueryResult } from "@/sanity.types";
import { QuaternionTuple, Vector3Tuple } from "three";

export type PreDefinedView = {
  position: Vector3Tuple;
  rotation: QuaternionTuple;
};

export type Hotspot = {
  id: string;
  title: string;
  location: PreDefinedView;
};

export type Spot = {
  name: string;
  translation: [number, number, number];
  rotation: [number, number, number, number];
};

export type Project = ProjectsQueryResult[number];

export type HotspotWithProjects = {
  hotspotId: string;
  hotspot: Hotspot;
  projects: {
    project: Project;
    spot: Spot;
  }[];
};

export type HotspotsWithProjects = HotspotWithProjects[];

export type AllSpotsWithProjects = {
  projects: HotspotsWithProjects;
  emptySpots: Spot[];
};
