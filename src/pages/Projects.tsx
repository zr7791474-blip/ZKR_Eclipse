import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Sparkles,
  Search,
  MoreVertical,
  Pencil,
  Copy,
  Archive,
  ArchiveRestore,
  Trash2,
  Pin,
  Star,
  Inbox,
  ChevronLeft,
  ChevronRight,
  Check,
  MessageSquare,
  Paperclip,
  LayoutGrid,
  List,
  Rows3,
} from "lucide-react";
import PageHeader from "../components/layout/PageHeader";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import ProgressBar from "../components/ui/ProgressBar";
import Button from "../components/ui/Button";
import DropdownMenu from "../components/ui/DropdownMenu";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import DataTable, { type DataTableColumn } from "../components/tables/DataTable";
import ProjectModal from "../components/modals/ProjectModal";
import GenerateProjectModal from "../components/modals/GenerateProjectModal";
import { useProjects } from "../hooks/useProjects";
import { useToast } from "../hooks/useToast";
import type { Project } from "../types/entities";
import { getDaysRemaining, getRelativeTime } from "../utils/date";
import styles from "./Projects.module.css";

const statusVariant: Record<Project["status"], "success" | "warning" | "neutral"> = {
  active: "success",
  "on-hold": "warning",
  completed: "neutral",
};

const priorityVariant: Record<Project["priority"], "danger" | "warning" | "neutral"> = {
  high: "danger",
  medium: "warning",
  low: "neutral",
};

type SortKey = "name" | "progress" | "dueDate";
type StatusFilter = "all" | Project["status"];
type PriorityFilter = "all" | Project["priority"];
type ViewMode = "grid" | "list" | "compact";

const PAGE_SIZE = 6;

function Projects() {
  const {
    projects,
    deleteProject,
    archiveProject,
    restoreProject,
    duplicateProject,
    togglePin,
    toggleFavorite,
    bulkDeleteProjects,
    bulkArchiveProjects,
  } = useProjects();
  const { showToast } = useToast();

  const [view, setView] = useState<ViewMode>("grid");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [showArchived, setShowArchived] = useState(false);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isGenerateOpen, setGenerateOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<"delete" | "archive" | null>(null);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return projects
      .filter((project) => project.archived === showArchived)
      .filter((project) =>
        `${project.name} ${project.client}`.toLowerCase().includes(search.toLowerCase()),
      )
      .filter((project) => statusFilter === "all" || project.status === statusFilter)
      .filter((project) => priorityFilter === "all" || project.priority === priorityFilter)
      .sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        if (sortKey === "progress") return b.progress - a.progress;
        if (sortKey === "dueDate") return a.dueDate.localeCompare(b.dueDate);
        return a.name.localeCompare(b.name);
      });
  }, [projects, search, statusFilter, priorityFilter, sortKey, showArchived]);

  const pageSize = view === "grid" ? PAGE_SIZE : 10;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, priorityFilter, sortKey, showArchived, view]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  function toggleSelected(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((existing) => existing !== id) : [...prev, id],
    );
  }

  function clearSelection() {
    setSelectedIds([]);
  }

  function handleBulkConfirm() {
    if (bulkAction === "delete") {
      bulkDeleteProjects(selectedIds);
    } else if (bulkAction === "archive") {
      bulkArchiveProjects(selectedIds);
    }
    clearSelection();
    setBulkAction(null);
  }

  function projectMenuItems(project: Project) {
    return [
      { label: "Edit", icon: <Pencil size={14} />, onClick: () => setEditingProject(project) },
      { label: "Duplicate", icon: <Copy size={14} />, onClick: () => duplicateProject(project.id) },
      {
        label: project.pinned ? "Unpin" : "Pin",
        icon: <Pin size={14} />,
        onClick: () => togglePin(project.id),
      },
      project.archived
        ? { label: "Restore", icon: <ArchiveRestore size={14} />, onClick: () => restoreProject(project.id) }
        : { label: "Archive", icon: <Archive size={14} />, onClick: () => archiveProject(project.id) },
      {
        label: "Delete",
        icon: <Trash2 size={14} />,
        danger: true,
        onClick: () => setDeletingProject(project),
      },
    ];
  }

  const listColumns: DataTableColumn<Project>[] = [
    { key: "name", header: "Project", render: (row) => row.name },
    { key: "client", header: "Client", render: (row) => row.client },
    {
      key: "status",
      header: "Status",
      render: (row) => <Badge label={row.status} variant={statusVariant[row.status]} />,
    },
    {
      key: "priority",
      header: "Priority",
      render: (row) => <Badge label={row.priority} variant={priorityVariant[row.priority]} />,
    },
    { key: "progress", header: "Progress", align: "right", render: (row) => `${row.progress}%` },
    { key: "dueDate", header: "Due", render: (row) => row.dueDate },
    { key: "updatedAt", header: "Updated", render: (row) => getRelativeTime(row.updatedAt) },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (row) => <DropdownMenu trigger={<MoreVertical size={16} />} items={projectMenuItems(row)} />,
    },
  ];

  return (
    <div className={styles.page}>
      <PageHeader
        title="Projects"
        description="All active and past client projects."
        actions={
          <>
            <Button variant="secondary" onClick={() => setGenerateOpen(true)}>
              <Sparkles size={16} />
              Generate project
            </Button>
            <Button onClick={() => setCreateOpen(true)}>
              <Plus size={16} />
              New project
            </Button>
          </>
        }
      />

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Search projects or clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className={styles.select}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="on-hold">On hold</option>
          <option value="completed">Completed</option>
        </select>

        <select
          className={styles.select}
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as PriorityFilter)}
        >
          <option value="all">All priorities</option>
          <option value="high">High priority</option>
          <option value="medium">Medium priority</option>
          <option value="low">Low priority</option>
        </select>

        <select
          className={styles.select}
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
        >
          <option value="name">Sort by name</option>
          <option value="progress">Sort by progress</option>
          <option value="dueDate">Sort by due date</option>
        </select>

        <button
          className={styles.archiveToggle}
          data-active={showArchived || undefined}
          onClick={() => {
            setShowArchived((prev) => !prev);
            clearSelection();
          }}
        >
          <Archive size={15} />
          {showArchived ? "Viewing archived" : "View archived"}
        </button>

        <div className={styles.viewToggle}>
          <button
            className={styles.viewButton}
            data-active={view === "grid" || undefined}
            onClick={() => setView("grid")}
            aria-label="Grid view"
          >
            <LayoutGrid size={15} />
          </button>
          <button
            className={styles.viewButton}
            data-active={view === "list" || undefined}
            onClick={() => setView("list")}
            aria-label="List view"
          >
            <List size={15} />
          </button>
          <button
            className={styles.viewButton}
            data-active={view === "compact" || undefined}
            onClick={() => setView("compact")}
            aria-label="Compact view"
          >
            <Rows3 size={15} />
          </button>
        </div>
      </div>

      {selectedIds.length > 0 && (
        <div className={styles.bulkBar}>
          <span className={styles.bulkCount}>{selectedIds.length} selected</span>
          <div className={styles.bulkActions}>
            <Button variant="secondary" onClick={() => setBulkAction("archive")}>
              <Archive size={15} />
              Archive
            </Button>
            <Button variant="danger" onClick={() => setBulkAction("delete")}>
              <Trash2 size={15} />
              Delete
            </Button>
            <Button variant="ghost" onClick={clearSelection}>
              Clear
            </Button>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <Inbox size={32} className={styles.emptyIcon} />
          <p className={styles.emptyTitle}>No projects found</p>
          <p className={styles.emptyText}>
            {showArchived
              ? "You don't have any archived projects."
              : "Try adjusting your search or filters, or create a new project."}
          </p>
        </div>
      ) : (
        <>
          {view === "list" && (
            <Card padded={false}>
              <DataTable columns={listColumns} data={paginated} keyExtractor={(row) => row.id} />
            </Card>
          )}

          {view === "compact" && (
            <div className={styles.compactList}>
              {paginated.map((project, index) => {
                const remaining = getDaysRemaining(project.dueDate);
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02, duration: 0.2 }}
                    className={styles.compactRow}
                  >
                    {project.pinned && <Pin size={13} className={styles.pinIcon} />}
                    <span className={styles.compactName}>{project.name}</span>
                    <span className={styles.compactClient}>{project.client}</span>
                    <Badge label={project.status} variant={statusVariant[project.status]} />
                    <Badge label={project.priority} variant={priorityVariant[project.priority]} />
                    <div className={styles.compactProgress}>
                      <ProgressBar value={project.progress} />
                    </div>
                    <span className={styles.compactDue} data-overdue={remaining?.overdue || undefined}>
                      {remaining?.label ?? `Due ${project.dueDate}`}
                    </span>
                    <button
                      className={styles.iconToggle}
                      data-active={project.favorite || undefined}
                      onClick={() => toggleFavorite(project.id)}
                      aria-label="Toggle favorite"
                    >
                      <Star size={14} />
                    </button>
                    <DropdownMenu trigger={<MoreVertical size={16} />} items={projectMenuItems(project)} />
                  </motion.div>
                );
              })}
            </div>
          )}

          {view === "grid" && (
            <div className={styles.grid}>
              {paginated.map((project, index) => {
                const remaining = getDaysRemaining(project.dueDate);
                return (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03, duration: 0.25, ease: "easeOut" }}
                  >
                    <Card className={styles.projectCard} data-selected={selectedIds.includes(project.id) || undefined}>
                      <div className={styles.cardTop}>
                        <div className={styles.titleRow}>
                          <button
                            className={styles.selectCheckbox}
                            data-checked={selectedIds.includes(project.id) || undefined}
                            onClick={() => toggleSelected(project.id)}
                            aria-label={selectedIds.includes(project.id) ? "Deselect project" : "Select project"}
                          >
                            {selectedIds.includes(project.id) && <Check size={12} />}
                          </button>
                          {project.pinned && <Pin size={13} className={styles.pinIcon} />}
                          <h3 className={styles.projectName}>{project.name}</h3>
                        </div>
                        <div className={styles.cardTopActions}>
                          <button
                            className={styles.iconToggle}
                            data-active={project.favorite || undefined}
                            onClick={() => toggleFavorite(project.id)}
                            aria-label="Toggle favorite"
                          >
                            <Star size={15} />
                          </button>
                          <DropdownMenu trigger={<MoreVertical size={16} />} items={projectMenuItems(project)} />
                        </div>
                      </div>

                      <div className={styles.badgeRow}>
                        <Badge label={project.status} variant={statusVariant[project.status]} />
                        <Badge label={`${project.priority} priority`} variant={priorityVariant[project.priority]} />
                        {project.category && <Badge label={project.category} variant="neutral" />}
                      </div>

                      <p className={styles.client}>{project.client}</p>

                      {project.tags.length > 0 && (
                        <div className={styles.tagRow}>
                          {project.tags.map((tag) => (
                            <span key={tag} className={styles.tag}>
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <ProgressBar value={project.progress} label={`${project.progress}%`} />

                      <div className={styles.metaRow}>
                        <span className={styles.metaItem}>
                          <MessageSquare size={13} />
                          {project.commentsCount}
                        </span>
                        <span className={styles.metaItem}>
                          <Paperclip size={13} />
                          {project.attachmentsCount}
                        </span>
                        <span className={styles.metaItem}>Updated {getRelativeTime(project.updatedAt)}</span>
                      </div>

                      <div className={styles.cardFooter}>
                        <span className={styles.due} data-overdue={remaining?.overdue || undefined}>
                          {remaining?.label ?? `Due ${project.dueDate}`}
                        </span>
                        <div className={styles.footerRight}>
                          <div className={styles.avatars}>
                            {project.teamAvatars.map((avatar, i) => (
                              <img key={`${project.id}-${i}`} src={avatar} alt="" className={styles.avatar} />
                            ))}
                          </div>
                          <button
                            className={styles.openButton}
                            onClick={() => showToast(`Opening "${project.name}"`, "info")}
                          >
                            Open
                          </button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageButton}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>
              <span className={styles.pageInfo}>
                Page {page} of {totalPages}
              </span>
              <button
                className={styles.pageButton}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}

      <ProjectModal isOpen={isCreateOpen} onClose={() => setCreateOpen(false)} />
      <ProjectModal
        isOpen={Boolean(editingProject)}
        onClose={() => setEditingProject(null)}
        project={editingProject}
      />
      <GenerateProjectModal isOpen={isGenerateOpen} onClose={() => setGenerateOpen(false)} />

      <ConfirmDialog
        isOpen={Boolean(deletingProject)}
        onClose={() => setDeletingProject(null)}
        onConfirm={() => {
          if (deletingProject) deleteProject(deletingProject.id);
        }}
        title="Delete project"
        message={`Are you sure you want to delete "${deletingProject?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
      />

      <ConfirmDialog
        isOpen={bulkAction !== null}
        onClose={() => setBulkAction(null)}
        onConfirm={handleBulkConfirm}
        title={bulkAction === "delete" ? "Delete projects" : "Archive projects"}
        message={
          bulkAction === "delete"
            ? `Delete ${selectedIds.length} selected project${selectedIds.length === 1 ? "" : "s"}? This action cannot be undone.`
            : `Archive ${selectedIds.length} selected project${selectedIds.length === 1 ? "" : "s"}?`
        }
        confirmLabel={bulkAction === "delete" ? "Delete" : "Archive"}
        variant={bulkAction === "delete" ? "danger" : "primary"}
      />
    </div>
  );
}

export default Projects;
