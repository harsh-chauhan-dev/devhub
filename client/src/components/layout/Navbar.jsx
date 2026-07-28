import { useState, useEffect } from "react";
import { Bell, Moon, Search, Sun, X, Sparkles, CheckSquare, FileText } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { notificationService } from "../../services/notificationService";
import devhubLogo from "../../assets/devhub-icon.png";

// Helper utility to parse clean GitHub handle from full URL or string
const parseGithubHandle = (input) => {
  if (!input || typeof input !== "string") return "harsh-chauhan-dev";
  let str = input.trim().replace(/\/+$/, "");
  if (str.includes("github.com/")) {
    const parts = str.split("github.com/");
    str = parts[parts.length - 1].split("/")[0];
  }
  return str.replace(/^@/, "").trim() || "harsh-chauhan-dev";
};

const Navbar = () => {
  const { darkMode, toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const cleanHandle = parseGithubHandle(user?.githubUsername);
  const navAvatar = user?.githubUsername ? `https://github.com/${cleanHandle}.png` : (user?.avatar || "https://avatars.githubusercontent.com/u/199341266?v=4");

  const fetchLiveNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.warn("Error fetching live notifications:", err);
    }
  };

  useEffect(() => {
    fetchLiveNotifications();
    const interval = setInterval(fetchLiveNotifications, 10000);
    return () => clearInterval(interval);
  }, [user?.id]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (!searchText.trim()) return;
    const query = searchText.toLowerCase().trim();
    if (query.includes("todo") || query.includes("task")) navigate("/tasks");
    else if (query.includes("note")) navigate("/notebook");
    else if (query.includes("analytic") || query.includes("chart")) navigate("/insights");
    else if (query.includes("profile")) navigate("/profile");
    else if (query.includes("setting")) navigate("/settings");
    else navigate("/workspace");
  };

  const handleDismissNotification = async (id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
    await notificationService.deleteNotification(id);
  };

  const handleClearAllNotifications = async () => {
    setNotifications([]);
    await notificationService.clearAllNotifications();
  };

  const handleToggleNotifications = async () => {
    const nextOpen = !isNotificationsOpen;
    setIsNotificationsOpen(nextOpen);
    if (nextOpen && unreadCount > 0) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      await notificationService.markAllAsRead();
    }
  };

  const handleItemClick = async (item) => {
    if (!item.read) {
      setNotifications((prev) => prev.map((n) => (n.id === item.id ? { ...n, read: true } : n)));
      await notificationService.markAsRead(item.id);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-50 bg-[var(--bg-main)]/90 backdrop-blur-md border-b border-[var(--border)] transition-colors duration-300">
      <div className="flex items-center justify-between h-16 px-6 max-w-7xl mx-auto">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <img
              src={devhubLogo}
              alt="DevHub Logo"
              className="w-12 h-12 object-contain rounded-[8px] transition duration-200 group-hover:scale-105"
            />
            <span className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">
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
        <div className="flex items-center gap-4">
          {/* Action shortcut pills */}
          <div className="hidden sm:flex items-center gap-2">
            <Link
              to="/tasks"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] bg-[var(--bg-card)] hover:bg-[var(--bg-sec)] border border-[var(--border)] rounded-[10px] transition duration-200"
            >
              <CheckSquare size={13} className="text-[#38BDF8]" />
              Tasks
            </Link>
            <Link
              to="/notebook"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] bg-[var(--bg-card)] hover:bg-[var(--bg-sec)] border border-[var(--border)] rounded-[10px] transition duration-200"
            >
              <FileText size={13} className="text-[#818CF8]" />
              Notes
            </Link>
          </div>

          {/* Theme Toggle Button */}
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
              onClick={handleToggleNotifications}
              className="relative p-2.5 rounded-[12px] border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-primary)] hover:border-[#4F7CFF] transition duration-200"
              title="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#EF4444] text-[9px] font-bold text-white ring-2 ring-[var(--bg-main)] animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-3 w-84 rounded-[16px] bg-[var(--bg-card)] border border-[var(--border)] shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden z-50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-sec)]">
                  <span className="font-bold text-xs text-[var(--text-primary)] flex items-center gap-1.5">
                    <Sparkles size={14} className="text-[#38BDF8]" /> Live Database Notifications ({notifications.length})
                  </span>
                  <div className="flex items-center gap-2">
                    {notifications.length > 0 && (
                      <button
                        onClick={handleClearAllNotifications}
                        className="text-[10px] text-[#38BDF8] hover:underline font-semibold"
                        title="Clear all notifications"
                      >
                        Clear All
                      </button>
                    )}
                    <button
                      onClick={() => setIsNotificationsOpen(false)}
                      className="text-[var(--text-muted)] hover:text-[var(--text-primary)] ml-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                {notifications.length === 0 ? (
                  <p className="p-6 text-xs text-center text-[var(--text-muted)]">No new notifications</p>
                ) : (
                  <ul className="divide-y divide-[var(--border)] max-h-64 overflow-y-auto">
                    {notifications.map((item) => (
                      <li
                        key={item.id}
                        onClick={() => handleItemClick(item)}
                        className={`p-3.5 hover:bg-[var(--bg-sec)] transition flex justify-between gap-2 cursor-pointer ${!item.read ? 'bg-[#4F7CFF]/5 border-l-2 border-[#4F7CFF]' : ''}`}
                      >
                        <div>
                          <p className="text-xs text-[var(--text-secondary)] font-medium leading-snug">{item.message}</p>
                          <span className="text-[10px] text-[var(--text-muted)] mt-1 block font-mono">{item.time}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDismissNotification(item.id);
                          }}
                          className="text-[var(--text-muted)] hover:text-[#EF4444] self-start"
                          title="Dismiss"
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
              src={navAvatar}
              alt={user?.name || "User"}
              className="h-9 w-9 rounded-[10px] object-cover ring-2 ring-[#4F7CFF]/40"
            />
            <div className="hidden sm:block text-left pr-2">
              <p className="font-bold text-xs text-[var(--text-primary)] leading-tight">
                {user?.name || "User Profile"}
              </p>
              <p className="text-[11px] text-[var(--text-muted)] leading-tight">
                @{cleanHandle}
              </p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
