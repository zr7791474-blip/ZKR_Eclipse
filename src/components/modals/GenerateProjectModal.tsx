import { useState } from "react";
import { Sparkles, Loader2, CheckCircle2 } from "lucide-react";
import Modal from "../ui/Modal";
import FormField from "../ui/FormField";
import Button from "../ui/Button";
import { useProjects } from "../../hooks/useProjects";
import styles from "./GenerateProjectModal.module.css";

interface GenerateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EMPTY_FORM = {
  name: "",
  description: "",
  framework: "React",
  category: "Web App",
  difficulty: "Intermediate",
  template: "SaaS Dashboard",
};

type Phase = "form" | "generating" | "success";

function GenerateProjectModal({ isOpen, onClose }: GenerateProjectModalProps) {
  const { addProject } = useProjects();
  const [form, setForm] = useState(EMPTY_FORM);
  const [phase, setPhase] = useState<Phase>("form");
  const [progress, setProgress] = useState(0);

  function resetAndClose() {
    setPhase("form");
    setProgress(0);
    setForm(EMPTY_FORM);
    onClose();
  }

  function handleGenerate() {
    if (!form.name.trim()) return;
    setPhase("generating");
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 22 + 8;
        if (next >= 100) {
          clearInterval(interval);
          setPhase("success");
          addProject({
            name: form.name,
            client: form.template,
            description: form.description,
            framework: form.framework,
            category: form.category,
            difficulty: form.difficulty,
            status: "active",
            priority: "medium",
            dueDate: "TBD",
            progress: 5,
          });
          return 100;
        }
        return next;
      });
    }, 260);
  }

  return (
    <Modal isOpen={isOpen} onClose={resetAndClose} title="Generate project">
      {phase === "form" && (
        <>
          <FormField label="Project name" htmlFor="gen-name">
            <input
              id="gen-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Pulse Analytics Suite"
              required
            />
          </FormField>

          <FormField label="Description" htmlFor="gen-description">
            <textarea
              id="gen-description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Briefly describe what this project should do"
            />
          </FormField>

          <div className={styles.row}>
            <FormField label="Framework" htmlFor="gen-framework">
              <select
                id="gen-framework"
                value={form.framework}
                onChange={(e) => setForm({ ...form, framework: e.target.value })}
              >
                <option>React</option>
                <option>Vue</option>
                <option>Svelte</option>
                <option>Next.js</option>
              </select>
            </FormField>

            <FormField label="Category" htmlFor="gen-category">
              <select
                id="gen-category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option>Web App</option>
                <option>Mobile App</option>
                <option>Landing Page</option>
                <option>API Service</option>
              </select>
            </FormField>
          </div>

          <div className={styles.row}>
            <FormField label="Difficulty" htmlFor="gen-difficulty">
              <select
                id="gen-difficulty"
                value={form.difficulty}
                onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </FormField>

            <FormField label="Template" htmlFor="gen-template">
              <select
                id="gen-template"
                value={form.template}
                onChange={(e) => setForm({ ...form, template: e.target.value })}
              >
                <option>SaaS Dashboard</option>
                <option>E-commerce</option>
                <option>Admin Panel</option>
                <option>Portfolio</option>
              </select>
            </FormField>
          </div>

          <Button
            onClick={handleGenerate}
            style={{ width: "100%", justifyContent: "center" }}
          >
            <Sparkles size={16} />
            Generate with AI
          </Button>
        </>
      )}

      {phase === "generating" && (
        <div className={styles.progressWrap}>
          <Loader2 size={28} className={styles.spinner} />
          <p className={styles.progressLabel}>Generating "{form.name}"...</p>
          <div className={styles.track}>
            <div className={styles.fill} style={{ width: `${Math.min(progress, 100)}%` }} />
          </div>
          <span className={styles.percent}>{Math.min(Math.round(progress), 100)}%</span>
        </div>
      )}

      {phase === "success" && (
        <div className={styles.successWrap}>
          <CheckCircle2 size={40} className={styles.successIcon} />
          <p className={styles.successTitle}>Project generated</p>
          <p className={styles.successText}>
            "{form.name}" was created and added to your projects.
          </p>
          <Button onClick={resetAndClose} style={{ width: "100%", justifyContent: "center" }}>
            Done
          </Button>
        </div>
      )}
    </Modal>
  );
}

export default GenerateProjectModal;