import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const Layout = () => {
  return (
    <div className="min-h-screen bg-gradient-dark bg-grid-pattern bg-noise">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-950/50 via-transparent to-accent-cyan/5 pointer-events-none" />
      <Sidebar />
      <div className="ml-64 relative z-10">
        <Header />
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
