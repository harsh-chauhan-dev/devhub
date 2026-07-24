import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">

      <Navbar />

      <div className="flex flex-1">

        <Sidebar />

        <main className="flex-1 bg-gray-100 p-6">
          <Outlet />
        </main>

      </div>

      <Footer />

    </div>
  );
};

export default DashboardLayout;