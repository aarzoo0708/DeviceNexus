import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function AppLayout({ children }) {
  return (
    <div className="app-layout">

      <Sidebar />

      <div className="main-area">

        <Navbar />

        <main className="page-content">
          {children}
        </main>

      </div>

    </div>
  );
}

export default AppLayout;