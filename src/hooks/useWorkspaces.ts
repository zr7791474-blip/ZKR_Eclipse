import { useContext } from "react";
import { WorkspacesContext } from "../context/workspaces-context";

export function useWorkspaces() {
  const context = useContext(WorkspacesContext);
  if (!context) throw new Error("useWorkspaces must be used within a WorkspacesProvider");
  return context;
}
