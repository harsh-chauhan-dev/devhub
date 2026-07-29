import { useState } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
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
  X,
  Search,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";

const menu = [
  { name: "Workspace", icon: LayoutDashboard, path: "/workspace" },
  { name: "Planner", icon: Calendar, path: "/planner" },
  { name: "Tasks", icon: CheckSquare, path: "/tasks" },
  { name: "NoteBook", icon: FileText, path: "/notebook" },
  { name: "Insights", icon: BarChart3, path: "/insights" },
  { name: "Profile", icon: User, path: "/profile" },
  { name: "Settings", icon: Settings, path: "/settings" },
];

const parseGithubHandle = (input) => {
  if (!input || typeof input !== "string") return "harsh-chauhan-dev";
  let str = input.trim().replace(/\/+$/, "");
  if (str.includes("github.com/")) {
    const parts = str.split("github.com/");
    str = parts[parts.length - 1].split("/")[0];
  }
  return str.replace(/^@/, "").trim() || "harsh-chauhan-dev";
};

const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileSearch, setMobileSearch] = useState("");

  const cleanHandle = parseGithubHandle(user?.githubUsername);
  const avatarUrl = user?.githubUsername
    ? `https://github.com/${cleanHandle}.png`
    : (user?.avatar || "https://avatars.githubusercontent.com/u/199341266?v=4");

  const handleLogout = async () => {
    await logout();
    if (onCloseMobile) onCloseMobile();
    navigate("/login");
  };

  const handleMobileSearch = (e) => {
    e.preventDefault();
    if (!mobileSearch.trim()) return;
    const query = mobileSearch.toLowerCase().trim();
    if (onCloseMobile) onCloseMobile();
    if (query.includes("todo") || query.includes("task")) navigate("/tasks");
    else if (query.includes("note")) navigate("/notebook");
    else if (query.includes("analytic") || query.includes("chart")) navigate("/insights");
    else if (query.includes("profile")) navigate("/profile");
    else if (query.includes("setting")) navigate("/settings");
    else navigate("/workspace");
    setMobileSearch("");
  };

  const navContent = (
    <div className="flex flex-col justify-between h-full p-4">
      <div className="space-y-4">
        {/* Mobile Search Input */}
        <form onSubmit={handleMobileSearch} className="md:hidden relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={mobileSearch}
            onChange={(e) => setMobileSearch(e.target.value)}
            placeholder="Search Workspace..."
            className="w-full devhub-input text-xs py-2 pl-9 pr-3 rounded-[10px]"
          />
        </form>

        {/* Navigation Menu Links */}
        <nav className="space-y-1.5">
          {menu.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => {
                if (onCloseMobile) onCloseMobile();
              }}
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
      </div>

      <div className="space-y-3.5 pt-4 border-t border-[var(--border)]">
        {/* Theme Switcher on Mobile Drawer */}
        <div className="md:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-[12px] bg-[var(--bg-card)] border border-[var(--border)] text-xs font-semibold text-[var(--text-primary)] hover:border-[#4F7CFF] transition duration-200"
          >
            <div className="flex items-center gap-2">
              {darkMode ? <Sun size={16} className="text-[#F59E0B]" /> : <Moon size={16} className="text-[#4F7CFF]" />}
              <span>{darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}</span>
            </div>
          </button>
        </div>

        {/* Pro Student Badge */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[16px] p-3 text-xs text-[var(--text-secondary)]">
          <div className="flex items-center gap-1.5 text-[#4F7CFF] font-bold mb-0.5">
            <Sparkles size={14} /> DevHub v1.0.0 (Beta)
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">CS Student & Developer Suite</p>
        </div>

        {/* Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-[12px] border border-[var(--border)] text-[#EF4444] hover:bg-[#EF4444]/15 hover:border-[#EF4444] text-sm font-semibold transition duration-200"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 bg-[var(--bg-sidebar)] border-r border-[var(--border)] min-h-[calc(100vh-4rem)] flex-col justify-between transition-colors duration-300">
        {navContent}
      </aside>

      {/* Mobile Off-Canvas Navigation Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Dark Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />

          {/* Drawer Container */}
          <div className="relative z-10 w-72 max-w-[84vw] bg-[var(--bg-sidebar)] border-r border-[var(--border)] h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
            {/* Mobile Header with Profile & Close Button */}
            <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
              <Link
                to="/profile"
                onClick={() => {
                  if (onCloseMobile) onCloseMobile();
                }}
                className="flex items-center gap-3 group"
              >
                <img
                  src={avatarUrl}
                  alt={user?.name || "User"}
                  className="w-10 h-10 rounded-[10px] object-cover ring-2 ring-[#4F7CFF]/40"
                />
                <div className="text-left">
                  <p className="font-bold text-xs text-[var(--text-primary)] leading-tight group-hover:text-[#4F7CFF] transition">
                    {user?.name || "User Profile"}
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] leading-tight">
                    @{cleanHandle}
                  </p>
                </div>
              </Link>
              <button
                type="button"
                onClick={onCloseMobile}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {navContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
