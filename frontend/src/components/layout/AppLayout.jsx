import { useState } from "react";
import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import styles from "./AppLayout.module.css";

function AppLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div
      className={`${styles.appLayout} ${
        isSidebarCollapsed ? styles.sidebarCollapsed : ""
      }`}
    >
      <Sidebar isCollapsed={isSidebarCollapsed} />
      <div className={styles.mainArea}>
        <Navbar onToggleSidebar={toggleSidebar} />
        <main className={styles.pageContent}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
