import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  DollarSign,
  ShoppingCart,
  FolderKanban,
  Plus,
  ArrowUpRight,
  CheckSquare,
  FileBarChart,
  Folder,
  StickyNote,
  Sparkles,
} from "lucide-react";
import StatCard from "../components/ui/StatCard";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import ProjectModal from "../components/modals/ProjectModal";
import { useProjects } from "../hooks/useProjects";
import { useQuickItems } from "../hooks/useQuickItems";
import { teamMembers, recentActivity } from "../data/mockData";
import ActivityFeed from "../components/activity/ActivityFeed";
import type { QuickItemType } from "../context/quick-items-context";
import styles from "./DashboardHome.module.css";

const QUICK_ITEM_ICONS: Record<QuickItemType, typeof CheckSquare> = {
  task: CheckSquare,
  report: FileBarChart,
  team: Users,
  folder: Folder,
  note: StickyNote,
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function getFormattedDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function DashboardHome() {
  const navigate = useNavigate();
  const { projects } = useProjects();
  const { items: quickItems } = useQuickItems();
  const [isCreateOpen, setCreateOpen] = useState(false);

  const activeProjectCount = useMemo(
    () => projects.filter((project) => !project.archived && project.status === "active").length,
    [projects],
  );

  const recentProjects = useMemo(
    () => [...projects].filter((p) => !p.archived).slice(0, 3),
    [projects],
  );

  const recentQuickItems = useMemo(() => quickItems.slice(0, 4), [quickItems]);

  const stats = useMemo(
    () => [
      { label: "Revenue", value: "$48,290", change: "+12.4%", icon: DollarSign, trend: [30, 34, 32, 40, 38, 46, 48], accentColor: "#168aad" },
      { label: "Active Users", value: "9,821", change: "+4.1%", icon: Users, trend: [80, 82, 79, 85, 88, 90, 92], accentColor: "#76c893" },
      { label: "Orders", value: "1,204", change: "-2.3%", icon: ShoppingCart, trend: [60, 58, 62, 55, 53, 50, 48], accentColor: "#1e6091" },
      {
        label: "Active Projects",
        value: String(activeProjectCount),
        change: activeProjectCount >= 3 ? "+2" : "-1",
        icon: FolderKanban,
        trend: [2, 3, 3, 4, activeProjectCount, activeProjectCount, activeProjectCount],
        accentColor: "#52b69a",
      },
    ],
    [activeProjectCount],
  );

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.heroBlob} data-blob="1" aria-hidden="true" />
        <span className={styles.heroBlob} data-blob="2" aria-hidden="true" />
        <span className={styles.heroBlob} data-blob="3" aria-hidden="true" />

        <div className={styles.heroContent}>
          <div className={styles.heroMeta}>
            <span className={styles.heroEyebrow}>{getGreeting()}, welcome back</span>
            <span className={styles.heroDate}>{getFormattedDate()}</span>
          </div>
          <h1 className={styles.heroTitle}>Your workspace, at a glance.</h1>
          <p className={styles.heroSubtitle}>
            Revenue is up 12.4% and orders are steady — here's your control
            deck for today.
          </p>
          <div className={styles.heroActions}>
            <Button variant="primary" onClick={() => setCreateOpen(true)}>
              <Plus size={16} />
              New Project
            </Button>
            <Button variant="secondary" onClick={() => navigate("/reports")}>
              View Reports
              <ArrowUpRight size={16} />
            </Button>
          </div>
        </div>

        <div className={styles.heroVisual} aria-hidden="true">
          <div className={styles.heroVisualInner}>
            <img src="/zkr.jpg" alt="" className={styles.heroVisualImage} />
          </div>
        </div>
      </section>

      <section className={styles.statsGrid}>
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className={styles.widgetGrid}>
        <Card className={styles.widgetCard}>
          <div className={styles.widgetHeader}>
            <h3 className={styles.widgetTitle}>Recent projects</h3>
            <button className={styles.widgetLink} onClick={() => navigate("/projects")}>
              View all
            </button>
          </div>
          {recentProjects.length === 0 ? (
            <EmptyState
              icon={FolderKanban}
              title="No projects yet"
              description="Create your first project to see it here."
            />
          ) : (
            <ul className={styles.widgetList}>
              {recentProjects.map((project) => (
                <li key={project.id} className={styles.widgetRow}>
                  <span className={styles.widgetRowIcon}>
                    <FolderKanban size={15} />
                  </span>
                  <span className={styles.widgetRowText}>
                    <span className={styles.widgetRowTitle}>{project.name}</span>
                    <span className={styles.widgetRowMeta}>{project.client}</span>
                  </span>
                  <span className={styles.widgetRowValue}>{project.progress}%</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className={styles.widgetCard}>
          <div className={styles.widgetHeader}>
            <h3 className={styles.widgetTitle}>Recently created</h3>
          </div>
          {recentQuickItems.length === 0 ? (
            <EmptyState
              icon={Sparkles}
              title="Nothing here yet"
              description="Use Quick Create in the top bar to add a task, note, report, and more."
            />
          ) : (
            <ul className={styles.widgetList}>
              {recentQuickItems.map((item) => {
                const Icon = QUICK_ITEM_ICONS[item.type];
                return (
                  <li key={item.id} className={styles.widgetRow}>
                    <span className={styles.widgetRowIcon}>
                      <Icon size={15} />
                    </span>
                    <span className={styles.widgetRowText}>
                      <span className={styles.widgetRowTitle}>{item.title}</span>
                      <span className={styles.widgetRowMeta}>
                        {item.type} · {new Date(item.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <Card className={styles.widgetCard}>
          <div className={styles.widgetHeader}>
            <h3 className={styles.widgetTitle}>Team activity</h3>
            <button className={styles.widgetLink} onClick={() => navigate("/workspace")}>
              View all
            </button>
          </div>
          <ul className={styles.widgetList}>
            {teamMembers.slice(0, 4).map((member) => (
              <li key={member.id} className={styles.widgetRow}>
                <span className={styles.teamAvatarWrap}>
                  <img src={member.avatar} alt="" className={styles.teamAvatar} />
                  <span className={styles.teamStatusDot} data-status={member.status} />
                </span>
                <span className={styles.widgetRowText}>
                  <span className={styles.widgetRowTitle}>{member.name}</span>
                  <span className={styles.widgetRowMeta}>{member.role}</span>
                </span>
                <span className={styles.teamStatusLabel} data-status={member.status}>
                  {member.status}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <Card className={styles.activityCard}>
        <div className={styles.widgetHeader}>
          <h3 className={styles.widgetTitle}>Recent activity</h3>
          <span className={styles.widgetLink}>Live</span>
        </div>
        <ActivityFeed items={recentActivity} />
      </Card>

      <ProjectModal isOpen={isCreateOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}

export default DashboardHome;
