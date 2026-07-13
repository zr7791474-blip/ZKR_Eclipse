import { createContext } from "react";
import type { Project } from "../types/entities";

export type NewProjectInput = Omit<
  Project,
  | "id"
  | "pinned"
  | "favorite"
  | "archived"
  | "createdAt"
  | "teamAvatars"
  | "progress"
  | "updatedAt"
  | "tags"
  | "commentsCount"
  | "attachmentsCount"
> & { progress?: number; tags?: string[] };

export interface ProjectsContextValue {
  projects: Project[];
  addProject: (input: NewProjectInput) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  archiveProject: (id: string) => void;
  restoreProject: (id: string) => void;
  duplicateProject: (id: string) => void;
  togglePin: (id: string) => void;
  toggleFavorite: (id: string) => void;
  bulkDeleteProjects: (ids: string[]) => void;
  bulkArchiveProjects: (ids: string[]) => void;
}

export const ProjectsContext = createContext<ProjectsContextValue | undefined>(
  undefined,
);
