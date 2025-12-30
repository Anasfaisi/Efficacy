import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="h-screen w-60 bg-[#0c2d48] text-white flex flex-col">
      <div className="p-4 text-xl font-bold border-b border-white/20">
        Admin
      </div>

      <nav className="flex flex-col mt-4 gap-1">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `px-4 py-3 text-sm rounded hover:bg-[#145DA0] ${
              isActive ? "bg-[#145DA0]" : ""
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/mentorManagement"
          className="px-4 py-3 text-sm rounded hover:bg-red-600 bg-red-500"
        >
          Mentor Management
        </NavLink>
        
        <NavLink
          to="/admin/logout"
          className="px-4 py-3 text-sm rounded hover:bg-red-600 bg-red-500"
        >
          Logout
        </NavLink>
   
      </nav>
    </aside>
  );
}
