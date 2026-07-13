import { createContext } from "react";
import type { Workspace } from "../types/entities";

export type NewWorkspaceInput = Pick<Workspace, "name" | "description">;

export interface WorkspacesContextValue {
  workspaces: Workspace[];
  activeWorkspaceId: string;
  setActiveWorkspaceId: (id: string) => void;
  addWorkspace: (input: NewWorkspaceInput) => Workspace;
}

export const WorkspacesContext = createContext<WorkspacesContextValue | undefined>(
  undefined,
);
