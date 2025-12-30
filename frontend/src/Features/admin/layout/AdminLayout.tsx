import { Outlet } from "react-router-dom";
import Sidebar from "../mentorManagement/components/Sidebar";
import { AdminHeader } from "../components/AdminHeader";

export default function AdminLayout() {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
