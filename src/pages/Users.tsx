import { useState } from "react";
import { UserPlus, MoreVertical, Trash2, ShieldCheck } from "lucide-react";
import PageHeader from "../components/layout/PageHeader";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import DropdownMenu from "../components/ui/DropdownMenu";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import DataTable, { type DataTableColumn } from "../components/tables/DataTable";
import InviteUserModal from "../components/modals/InviteUserModal";
import { useUsers } from "../hooks/useUsers";
import type { AppUser } from "../types/entities";

const statusVariant: Record<AppUser["status"], "success" | "info" | "danger"> = {
  active: "success",
  invited: "info",
  suspended: "danger",
};

function Users() {
  const { users, deleteUser, updateUserStatus } = useUsers();
  const [isInviteOpen, setInviteOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<AppUser | null>(null);

  const columns: DataTableColumn<AppUser>[] = [
    { key: "name", header: "Name", render: (row) => row.name },
    { key: "email", header: "Email", render: (row) => row.email },
    {
      key: "role",
      header: "Role",
      render: (row) => <Badge label={row.role} variant="neutral" />,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge label={row.status} variant={statusVariant[row.status]} />
      ),
    },
    { key: "joinedAt", header: "Joined", render: (row) => row.joinedAt },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (row) => (
        <DropdownMenu
          trigger={<MoreVertical size={16} />}
          items={[
            row.status !== "active"
              ? {
                  label: "Mark active",
                  icon: <ShieldCheck size={14} />,
                  onClick: () => updateUserStatus(row.id, "active"),
                }
              : {
                  label: "Suspend",
                  icon: <ShieldCheck size={14} />,
                  onClick: () => updateUserStatus(row.id, "suspended"),
                },
            {
              label: "Remove",
              icon: <Trash2 size={14} />,
              danger: true,
              onClick: () => setDeletingUser(row),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Users"
        description="Everyone with access to this workspace."
        actions={
          <Button onClick={() => setInviteOpen(true)}>
            <UserPlus size={16} />
            Invite user
          </Button>
        }
      />
      <Card padded={false}>
        <DataTable
          columns={columns}
          data={users}
          keyExtractor={(row) => row.id}
        />
      </Card>

      <InviteUserModal isOpen={isInviteOpen} onClose={() => setInviteOpen(false)} />

      <ConfirmDialog
        isOpen={Boolean(deletingUser)}
        onClose={() => setDeletingUser(null)}
        onConfirm={() => {
          if (deletingUser) deleteUser(deletingUser.id);
        }}
        title="Remove user"
        message={`Remove ${deletingUser?.name} from this workspace? They will lose access immediately.`}
        confirmLabel="Remove"
      />
    </div>
  );
}

export default Users;
