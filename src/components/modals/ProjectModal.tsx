import { useEffect, useState } from "react";
import type React from "react";
import Modal from "../ui/Modal";
import FormField from "../ui/FormField";
import Button from "../ui/Button";
import { useProjects } from "../../hooks/useProjects";
import { useToast } from "../../hooks/useToast";
import type { Project } from "../../types/entities";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project | null;
}

const EMPTY_FORM = {
  name: "",
  client: "",
  description: "",
  status: "active" as Project["status"],
  priority: "medium" as Project["priority"],
  dueDate: "",
};

function ProjectModal({ isOpen, onClose, project }: ProjectModalProps) {
  const { addProject, updateProject } = useProjects();
  const { showToast } = useToast();
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const isEditing = Boolean(project);

  useEffect(() => {
    if (project) {
      setForm({
        name: project.name,
        client: project.client,
        description: project.description ?? "",
        status: project.status,
        priority: project.priority,
        dueDate: project.dueDate,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setError(null);
  }, [project, isOpen]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Project name is required.");
      return;
    }

    if (isEditing && project) {
      updateProject(project.id, form);
      showToast(`"${form.name}" was updated`, "success");
    } else {
      addProject(form);
      showToast(`"${form.name}" was created`, "success");
    }
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit project" : "New project"}
    >
      <form onSubmit={handleSubmit} noValidate>
        <FormField label="Project name" htmlFor="project-name">
          <input
            id="project-name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Aurora Rebrand"
            required
          />
        </FormField>

        <FormField label="Client" htmlFor="project-client">
          <input
            id="project-client"
            value={form.client}
            onChange={(e) => setForm({ ...form, client: e.target.value })}
            placeholder="e.g. Aurora Studio"
          />
        </FormField>

        <FormField label="Description" htmlFor="project-description">
          <textarea
            id="project-description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="What is this project about?"
          />
        </FormField>

        <FormField label="Status" htmlFor="project-status">
          <select
            id="project-status"
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value as Project["status"] })
            }
          >
            <option value="active">Active</option>
            <option value="on-hold">On hold</option>
            <option value="completed">Completed</option>
          </select>
        </FormField>

        <FormField label="Priority" htmlFor="project-priority">
          <select
            id="project-priority"
            value={form.priority}
            onChange={(e) =>
              setForm({ ...form, priority: e.target.value as Project["priority"] })
            }
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </FormField>

        <FormField label="Due date" htmlFor="project-due">
          <input
            id="project-due"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            placeholder="e.g. Aug 14"
          />
        </FormField>

        {error && (
          <p style={{ color: "var(--color-danger)", fontSize: "var(--fs-sm)", marginBottom: "var(--space-4)" }}>
            {error}
          </p>
        )}

        <Button type="submit" style={{ width: "100%", justifyContent: "center" }}>
          {isEditing ? "Save changes" : "Create project"}
        </Button>
      </form>
    </Modal>
  );
}

export default ProjectModal;
