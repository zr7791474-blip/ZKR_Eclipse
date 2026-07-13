import { useState } from "react";
import type React from "react";
import {
  FolderKanban,
  Building2,
  CheckSquare,
  FileBarChart,
  UserPlus,
  Users as UsersIcon,
  Folder,
  StickyNote,
  ArrowLeft,
} from "lucide-react";
import Modal from "../ui/Modal";
import FormField from "../ui/FormField";
import Button from "../ui/Button";
import { useProjects } from "../../hooks/useProjects";
import { useUsers } from "../../hooks/useUsers";
import { useWorkspaces } from "../../hooks/useWorkspaces";
import { useQuickItems } from "../../hooks/useQuickItems";
import type { QuickItemType } from "../../context/quick-items-context";
import type { AppUser, Project } from "../../types/entities";
import styles from "./QuickCreateModal.module.css";

type CreateType = "project" | "workspace" | QuickItemType | "user";

interface TypeOption {
  type: CreateType;
  label: string;
  icon: typeof FolderKanban;
}

const TYPE_OPTIONS: TypeOption[] = [
  { type: "project", label: "Project", icon: FolderKanban },
  { type: "workspace", label: "Workspace", icon: Building2 },
  { type: "task", label: "Task", icon: CheckSquare },
  { type: "report", label: "Report", icon: FileBarChart },
  { type: "user", label: "User", icon: UserPlus },
  { type: "team", label: "Team", icon: UsersIcon },
  { type: "folder", label: "Folder", icon: Folder },
  { type: "note", label: "Note", icon: StickyNote },
];

const QUICK_ITEM_TYPES: QuickItemType[] = ["task", "report", "team", "folder", "note"];

interface QuickCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function QuickCreateModal({ isOpen, onClose }: QuickCreateModalProps) {
  const [selectedType, setSelectedType] = useState<CreateType | null>(null);
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [role, setRole] = useState<AppUser["role"]>("viewer");
  const [priority, setPriority] = useState<Project["priority"]>("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { addProject } = useProjects();
  const { addUser } = useUsers();
  const { addWorkspace } = useWorkspaces();
  const { addItem } = useQuickItems();

  function reset() {
    setSelectedType(null);
    setTitle("");
    setDetail("");
    setRole("viewer");
    setPriority("medium");
    setError(null);
    setIsSubmitting(false);
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (selectedType === "user") {
      if (!title.trim() || !detail.trim()) {
        setError("Name and email are required.");
        return;
      }
      if (!/^\S+@\S+\.\S+$/.test(detail.trim())) {
        setError("Enter a valid email address.");
        return;
      }
    } else if (!title.trim()) {
      setError("A title is required.");
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (selectedType === "project") {
      addProject({
        name: title.trim(),
        client: detail.trim() || "Unassigned",
        status: "active",
        priority,
        dueDate: "TBD",
      });
    } else if (selectedType === "workspace") {
      addWorkspace({ name: title.trim(), description: detail.trim() });
    } else if (selectedType === "user") {
      addUser({ name: title.trim(), email: detail.trim(), role });
    } else if (selectedType && QUICK_ITEM_TYPES.includes(selectedType as QuickItemType)) {
      addItem({ type: selectedType as QuickItemType, title: title.trim(), detail: detail.trim() });
    }

    handleClose();
  }

  const activeOption = TYPE_OPTIONS.find((option) => option.type === selectedType);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={activeOption ? `New ${activeOption.label}` : "Quick create"}
    >
      {!selectedType ? (
        <div className={styles.typeGrid}>
          {TYPE_OPTIONS.map((option) => (
            <button
              key={option.type}
              className={styles.typeButton}
              onClick={() => setSelectedType(option.type)}
            >
              <option.icon size={20} />
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <button
            type="button"
            className={styles.backButton}
            onClick={() => {
              setSelectedType(null);
              setError(null);
            }}
          >
            <ArrowLeft size={14} />
            Back
          </button>

          <FormField
            label={selectedType === "user" ? "Full name" : "Title"}
            htmlFor="qc-title"
          >
            <input
              id="qc-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                selectedType === "project"
                  ? "e.g. Aurora Rebrand"
                  : selectedType === "workspace"
                    ? "e.g. Marketing Team"
                    : selectedType === "user"
                      ? "e.g. Sara Ahmed"
                      : "e.g. Untitled"
              }
              autoFocus
              required
            />
          </FormField>

          {selectedType === "project" && (
            <FormField label="Client" htmlFor="qc-detail">
              <input
                id="qc-detail"
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                placeholder="e.g. Aurora Studio"
              />
            </FormField>
          )}

          {selectedType === "project" && (
            <FormField label="Priority" htmlFor="qc-priority">
              <select
                id="qc-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Project["priority"])}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </FormField>
          )}

          {selectedType === "workspace" && (
            <FormField label="Description" htmlFor="qc-detail">
              <textarea
                id="qc-detail"
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                placeholder="What is this workspace for?"
              />
            </FormField>
          )}

          {selectedType === "user" && (
            <FormField label="Email" htmlFor="qc-detail">
              <input
                id="qc-detail"
                type="email"
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                placeholder="e.g. sara@company.com"
                required
              />
            </FormField>
          )}

          {selectedType === "user" && (
            <FormField label="Role" htmlFor="qc-role">
              <select
                id="qc-role"
                value={role}
                onChange={(e) => setRole(e.target.value as AppUser["role"])}
              >
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
            </FormField>
          )}

          {QUICK_ITEM_TYPES.includes(selectedType as QuickItemType) && (
            <FormField label="Details" htmlFor="qc-detail">
              <textarea
                id="qc-detail"
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                placeholder="Optional description..."
              />
            </FormField>
          )}

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.actions}>
            <Button type="button" variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Create {activeOption?.label}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}

export default QuickCreateModal;
