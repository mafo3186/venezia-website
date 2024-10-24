import { ProjectsQueryResult } from "@/sanity.types";
import { QuaternionTuple, Vector3Tuple } from "three";

export type PreDefinedView = {
  position: Vector3Tuple;
  rotation: QuaternionTuple;
};

export type Spot = string;

export type Hotspot = {
  id: string;
  title: string;
  spots: Spot[];
  location: PreDefinedView;
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
