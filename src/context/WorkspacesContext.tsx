import { useCallback, useMemo, useState, type ReactNode } from "react";
import { workspaces as initialWorkspaces } from "../data/mockData";
import type { Workspace } from "../types/entities";
import { useToast } from "../hooks/useToast";
import { WorkspacesContext, type NewWorkspaceInput } from "./workspaces-context";

function generateWorkspaceId(existing: Workspace[]): string {
  const numericIds = existing
    .map((w) => parseInt(w.id.replace("w", ""), 10))
    .filter((n) => !Number.isNaN(n));
  const next = (numericIds.length > 0 ? Math.max(...numericIds) : 0) + 1;
  return `w${next}`;
}

export function WorkspacesProvider({ children }: { children: ReactNode }) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(initialWorkspaces);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState(
    initialWorkspaces[0]?.id ?? "",
  );
  const { showToast } = useToast();

  const addWorkspace = useCallback(
    (input: NewWorkspaceInput) => {
      const workspace: Workspace = {
        ...input,
        id: generateWorkspaceId(workspaces),
        members: 1,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setWorkspaces((prev) => [...prev, workspace]);
      setActiveWorkspaceId(workspace.id);
      showToast(`Workspace "${workspace.name}" created`, "success");
      return workspace;
    },
    [workspaces, showToast],
  );

  const value = useMemo(
    () => ({ workspaces, activeWorkspaceId, setActiveWorkspaceId, addWorkspace }),
    [workspaces, activeWorkspaceId, addWorkspace],
  );

  return (
    <WorkspacesContext.Provider value={value}>{children}</WorkspacesContext.Provider>
  );
}
