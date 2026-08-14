import { Outlet } from "react-router";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

import "./AppLayout.css";

function AppLayout() {
  return (
    <div className="app-layout">

      <Sidebar />

      <div className="main-area">

        <Navbar />

        <main className="page-content">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default AppLayout;