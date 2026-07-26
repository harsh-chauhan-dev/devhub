import { useState } from "react";
import { Bell, Moon, Search, Sun, X, Sparkles } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

const initialNotifications = [
  { id: 1, message: "Welcome to DevHub! Theme switcher active.", time: "Just now" },
  { id: 2, message: "GitHub profile harsh-chauhan-dev synced.", time: "10 mins ago" },
  { id: 3, message: "Supabase cloud database connected.", time: "1 hr ago" },
];

const Navbar = () => {
  const { darkMode, toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (!searchText.trim()) return;
    const query = searchText.toLowerCase().trim();
    if (query.includes("todo") || query.includes("task")) navigate("/todo");
    else if (query.includes("note")) navigate("/notes");
    else if (query.includes("analytic") || query.includes("chart")) navigate("/analytics");
    else if (query.includes("profile")) navigate("/profile");
    else if (query.includes("setting")) navigate("/settings");
    else navigate("/dashboard");
  };

  const handleDismissNotification = (id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <header className="sticky top-0 z-50 bg-[var(--bg-main)]/90 backdrop-blur-md border-b border-[var(--border)] transition-colors duration-300">
      <div className="flex items-center justify-between h-16 px-6 max-w-7xl mx-auto">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-[12px] bg-gradient-to-tr from-[#4F7CFF] to-[#38BDF8] flex items-center justify-center text-white shadow-md shadow-[#4F7CFF]/20 font-black text-xl group-hover:scale-105 transition duration-200">
              D
            </div>
            <span className="text-xl font-extrabold tracking-tight text-[var(--text-primary)]">
              Dev<span className="text-[#38BDF8]">Hub</span>
            </span>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
            <Search
              size={16}
              className="absolute text-[var(--text-muted)] -translate-y-1/2 left-3.5 top-1/2"
            />
            <input
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search (Cmd + K)..."
              className="w-72 md:w-80 devhub-input text-xs font-medium py-2.5 pl-10 pr-4"
            />
          </form>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3 relative">
          {/* Theme Toggle Button (Sun/Moon) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2.5 rounded-[12px] border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-primary)] hover:border-[#4F7CFF] transition duration-200"
            title="Toggle Light / Dark Mode"
          >
            {darkMode ? (
              <Sun size={18} className="text-[#F59E0B]" />
            ) : (
              <Moon size={18} className="text-[#4F7CFF]" />
            )}
          </button>

          {/* Notifications dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2.5 rounded-[12px] border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-primary)] hover:border-[#4F7CFF] transition duration-200"
              title="Notifications"
            >
              <Bell size={18} />
              {notifications.length > 0 && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#38BDF8] ring-2 ring-[var(--bg-main)] animate-pulse"></span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-3 w-80 rounded-[16px] bg-[var(--bg-card)] border border-[var(--border)] shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden z-50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
                  <span className="font-bold text-xs text-[var(--text-primary)] flex items-center gap-1.5">
                    <Sparkles size={14} className="text-[#38BDF8]" /> Notifications ({notifications.length})
                  </span>
                  <button
                    onClick={() => setIsNotificationsOpen(false)}
                    className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    <X size={16} />
                  </button>
                </div>
                {notifications.length === 0 ? (
                  <p className="p-4 text-xs text-center text-[var(--text-muted)]">No new notifications</p>
                ) : (
                  <ul className="divide-y divide-[var(--border)] max-h-64 overflow-y-auto">
                    {notifications.map((item) => (
                      <li key={item.id} className="p-3 hover:bg-[var(--bg-sec)] transition flex justify-between gap-2">
                        <div>
                          <p className="text-xs text-[var(--text-secondary)] font-medium">{item.message}</p>
                          <span className="text-[10px] text-[var(--text-muted)] mt-1 block">{item.time}</span>
                        </div>
                        <button
                          onClick={() => handleDismissNotification(item.id)}
                          className="text-[var(--text-muted)] hover:text-[#EF4444] self-start"
                        >
                          <X size={12} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* User profile trigger */}
          <Link
            to="/profile"
            className="flex items-center gap-3 p-1 rounded-[12px] hover:bg-[var(--bg-card)] border border-transparent hover:border-[var(--border)] transition duration-200"
          >
            <img
              src={user?.avatar || "https://avatars.githubusercontent.com/u/199341266?v=4"}
              alt={user?.name || "Harsh Chauhan"}
              className="h-9 w-9 rounded-[10px] object-cover ring-2 ring-[#4F7CFF]/40"
            />
            <div className="hidden sm:block text-left pr-2">
              <p className="font-bold text-xs text-[var(--text-primary)] leading-tight">
                {user?.name || "Harsh Chauhan"}
              </p>
              <p className="text-[11px] text-[var(--text-muted)] leading-tight">
                {user?.role || "Developer"}
              </p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
