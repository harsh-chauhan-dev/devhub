import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  CheckSquare,
  FileText,
  BarChart3,
  Calendar,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const menu = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Upcoming Schedule", icon: Calendar, path: "/schedules" },
  { name: "Todos", icon: CheckSquare, path: "/todo" },
  { name: "Notes", icon: FileText, path: "/notes" },
  { name: "Analytics", icon: BarChart3, path: "/analytics" },
  { name: "Profile", icon: User, path: "/profile" },
  { name: "Settings", icon: Settings, path: "/settings" },
];

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-[var(--bg-sidebar)] border-r border-[var(--border)] min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 transition-colors duration-300">
      <nav className="space-y-1.5">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
          Workspace
        </div>

        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-[12px] text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-[#4F7CFF] text-white shadow-md shadow-[#4F7CFF]/30"
                  : "text-[var(--text-muted)] hover:bg-[#4F7CFF]/15 hover:text-[var(--text-primary)]"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={18} className={isActive ? "text-white" : "text-[var(--text-muted)]"} />
                <span>{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-4">
        {/* Pro Student Badge */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[16px] p-3.5 text-xs text-[var(--text-secondary)]">
          <div className="flex items-center gap-1.5 text-[#4F7CFF] font-bold mb-1">
            <Sparkles size={14} /> DevHub Pro
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">CS Student & Developer Suite</p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-[12px] border border-[var(--border)] text-[#EF4444] hover:bg-[#EF4444]/15 hover:border-[#EF4444] text-sm font-semibold transition duration-200"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
