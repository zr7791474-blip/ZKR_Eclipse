import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Footer from "./Footer";
import ToastContainer from "../ui/ToastContainer";
import styles from "./DashboardLayout.module.css";

function DashboardLayout() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className={styles.shell}>
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />

      <div
        className={styles.main}
        data-collapsed={isSidebarCollapsed || undefined}
      >
        <Topbar onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main className={styles.content}>
          <Outlet />
        </main>

        <Footer />
      </div>

      <ToastContainer />
    </div>
  );
}

export default DashboardLayout;