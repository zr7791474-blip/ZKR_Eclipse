import { useCallback, useMemo, useState, type ReactNode } from "react";
import { initialProjects } from "../data/mockData";
import type { Project } from "../types/entities";
import { useToast } from "../hooks/useToast";
import { ProjectsContext, type NewProjectInput } from "./projects-context";

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const { showToast } = useToast();

  const addProject = useCallback(
    (input: NewProjectInput) => {
      const project: Project = {
        ...input,
        id: crypto.randomUUID(),
        progress: input.progress ?? 0,
        tags: input.tags ?? [],
        commentsCount: 0,
        attachmentsCount: 0,
        updatedAt: new Date().toISOString(),
        teamAvatars: ["/zkr.jpg"],
        pinned: false,
        favorite: false,
        archived: false,
        createdAt: new Date().toISOString(),
      };
      setProjects((prev) => [project, ...prev]);
      showToast(`"${project.name}" was created`, "success");
      return project;
    },
    [showToast],
  );

  const updateProject = useCallback(
    (id: string, updates: Partial<Project>) => {
      setProjects((prev) =>
        prev.map((project) =>
          project.id === id
            ? { ...project, ...updates, updatedAt: new Date().toISOString() }
            : project,
        ),
      );
      showToast("Project updated", "success");
    },
    [showToast],
  );

  const deleteProject = useCallback(
    (id: string) => {
      setProjects((prev) => prev.filter((project) => project.id !== id));
      showToast("Project deleted", "error");
    },
    [showToast],
  );

  const archiveProject = useCallback(
    (id: string) => {
      setProjects((prev) =>
        prev.map((project) => (project.id === id ? { ...project, archived: true } : project)),
      );
      showToast("Project archived", "info");
    },
    [showToast],
  );

  const restoreProject = useCallback(
    (id: string) => {
      setProjects((prev) =>
        prev.map((project) => (project.id === id ? { ...project, archived: false } : project)),
      );
      showToast("Project restored", "success");
    },
    [showToast],
  );

  const duplicateProject = useCallback(
    (id: string) => {
      setProjects((prev) => {
        const source = prev.find((project) => project.id === id);
        if (!source) return prev;
        const copy: Project = {
          ...source,
          id: crypto.randomUUID(),
          name: `${source.name} (Copy)`,
          pinned: false,
          favorite: false,
          createdAt: new Date().toISOString(),
        };
        return [copy, ...prev];
      });
      showToast("Project duplicated", "success");
    },
    [showToast],
  );

  const togglePin = useCallback((id: string) => {
    setProjects((prev) =>
      prev.map((project) => (project.id === id ? { ...project, pinned: !project.pinned } : project)),
    );
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === id ? { ...project, favorite: !project.favorite } : project,
      ),
    );
  }, []);

  const bulkDeleteProjects = useCallback(
    (ids: string[]) => {
      setProjects((prev) => prev.filter((project) => !ids.includes(project.id)));
      showToast(`${ids.length} project${ids.length === 1 ? "" : "s"} deleted`, "error");
    },
    [showToast],
  );

  const bulkArchiveProjects = useCallback(
    (ids: string[]) => {
      setProjects((prev) =>
        prev.map((project) =>
          ids.includes(project.id) ? { ...project, archived: true } : project,
        ),
      );
      showToast(`${ids.length} project${ids.length === 1 ? "" : "s"} archived`, "info");
    },
    [showToast],
  );

  const value = useMemo(
    () => ({
      projects,
      addProject,
      updateProject,
      deleteProject,
      archiveProject,
      restoreProject,
      duplicateProject,
      togglePin,
      toggleFavorite,
      bulkDeleteProjects,
      bulkArchiveProjects,
    }),
    [
      projects,
      addProject,
      updateProject,
      deleteProject,
      archiveProject,
      restoreProject,
      duplicateProject,
      togglePin,
      toggleFavorite,
      bulkDeleteProjects,
      bulkArchiveProjects,
    ],
  );

  return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>;
}