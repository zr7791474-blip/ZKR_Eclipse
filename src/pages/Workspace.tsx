import { useState } from "react";
import { Plus, Building2, Check } from "lucide-react";
import PageHeader from "../components/layout/PageHeader";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { teamMembers } from "../data/mockData";
import type { TeamMember } from "../types/entities";
import { useWorkspaces } from "../hooks/useWorkspaces";
import QuickCreateModal from "../components/modals/QuickCreateModal";
import styles from "./Workspace.module.css";

const statusVariant: Record<TeamMember["status"], "success" | "neutral" | "warning"> = {
  online: "success",
  away: "warning",
  offline: "neutral",
};

function Workspace() {
  const { workspaces, activeWorkspaceId, setActiveWorkspaceId } = useWorkspaces();
  const [isCreateOpen, setCreateOpen] = useState(false);

  return (
    <div className={styles.page}>
      <PageHeader
        title="Workspace"
        description="Team members and workspace-level details."
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus size={16} />
            New workspace
          </Button>
        }
      />

      <div className={styles.workspaceGrid}>
        {workspaces.map((workspace) => (
          <button
            key={workspace.id}
            className={styles.workspaceCard}
            data-active={workspace.id === activeWorkspaceId || undefined}
            onClick={() => setActiveWorkspaceId(workspace.id)}
          >
            <span className={styles.workspaceIcon}>
              <Building2 size={16} />
            </span>
            <span className={styles.workspaceInfo}>
              <span className={styles.workspaceName}>{workspace.name}</span>
              <span className={styles.workspaceMeta}>
                {workspace.members} member{workspace.members === 1 ? "" : "s"}
              </span>
            </span>
            {workspace.id === activeWorkspaceId && (
              <Check size={16} className={styles.activeCheck} />
            )}
          </button>
        ))}
      </div>

      <h2 className={styles.sectionHeading}>Team members</h2>

      <div className={styles.grid}>
        {teamMembers.map((member) => (
          <Card key={member.id} className={styles.memberCard}>
            <img src={member.avatar} alt="" className={styles.avatar} />
            <div className={styles.info}>
              <h3 className={styles.name}>{member.name}</h3>
              <p className={styles.role}>{member.role}</p>
            </div>
            <Badge label={member.status} variant={statusVariant[member.status]} />
          </Card>
        ))}
      </div>

      <QuickCreateModal isOpen={isCreateOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}

export default Workspace;
