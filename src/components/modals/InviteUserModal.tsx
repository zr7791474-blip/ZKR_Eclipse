import { useState } from "react";
import type React from "react";
import Modal from "../ui/Modal";
import FormField from "../ui/FormField";
import Button from "../ui/Button";
import { useUsers } from "../../hooks/useUsers";
import type { AppUser } from "../../types/entities";

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function InviteUserModal({ isOpen, onClose }: InviteUserModalProps) {
  const { addUser } = useUsers();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AppUser["role"]>("viewer");
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setName("");
    setEmail("");
    setRole("viewer");
    setError(null);
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }

    addUser({ name: name.trim(), email: email.trim(), role });
    handleClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Invite user">
      <form onSubmit={handleSubmit} noValidate>
        <FormField label="Full name" htmlFor="invite-name">
          <input
            id="invite-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Sara Ahmed"
            required
          />
        </FormField>

        <FormField label="Email" htmlFor="invite-email">
          <input
            id="invite-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. sara@company.com"
            required
          />
        </FormField>

        <FormField label="Role" htmlFor="invite-role">
          <select
            id="invite-role"
            value={role}
            onChange={(e) => setRole(e.target.value as AppUser["role"])}
          >
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
        </FormField>

        {error && (
          <p style={{ color: "var(--color-danger)", fontSize: "var(--fs-sm)", marginBottom: "var(--space-4)" }}>
            {error}
          </p>
        )}

        <Button type="submit" style={{ width: "100%", justifyContent: "center" }}>
          Send invitation
        </Button>
      </form>
    </Modal>
  );
}

export default InviteUserModal;
