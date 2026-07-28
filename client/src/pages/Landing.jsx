import { Link } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  GitBranch,
  CheckCircle2,
  BookOpen,
  BarChart3,
  Database,
  Cloud,
  Terminal,
  Code2,
  ShieldCheck,
  Zap,
  Moon,
  Sun,
} from "lucide-react";
import GithubIcon from "../components/common/GithubIcon";
import { useTheme } from "../hooks/useTheme";

const Landing = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-300">
      {/* Header / Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[var(--bg-main)]/90 backdrop-blur-md border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">
              Dev<span className="text-[#38BDF8]">Hub</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-[var(--text-secondary)]">
            <a href="#features" className="hover:text-[#4F7CFF] transition">Features</a>
            <a href="#preview" className="hover:text-[#4F7CFF] transition">Live Dashboard</a>
            <a href="#stack" className="hover:text-[#4F7CFF] transition">Tech Stack</a>
            <a href="#express-backend" className="hover:text-[#4F7CFF] transition">Node+Express Backend</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-[12px] border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-primary)] hover:border-[#4F7CFF] transition duration-200"
              title="Toggle Light / Dark Mode"
            >
              {darkMode ? <Sun size={18} className="text-[#F59E0B]" /> : <Moon size={18} className="text-[#4F7CFF]" />}
            </button>

            <Link
              to="/login"
              className="devhub-btn-secondary px-4 py-2 text-xs"
            >
              Log In
            </Link>

            <Link
              to="/register"
              className="devhub-btn-primary px-4 py-2 text-xs"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-28 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Copy */}
          <div className="space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#4F7CFF]/15 border border-[#4F7CFF]/30 text-[#38BDF8]">
              <Sparkles size={14} /> DevHub v1.0 • For Engineers & CS Students
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-[var(--text-primary)]">
              Organize Your <br />
              <span className="bg-gradient-to-r from-[#4F7CFF] via-[#38BDF8] to-[#8B5CF6] bg-clip-text text-transparent">
                Developer Life
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[var(--text-muted)] font-medium leading-relaxed max-w-lg">
              Combine GitHub live profile statistics, system architecture notes, sprint task tracking, live weather, and productivity analytics into one high-performance SaaS workspace.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/dashboard"
                className="devhub-btn-primary px-6 py-3.5 text-sm flex items-center gap-2 shadow-lg shadow-[#4F7CFF]/30"
              >
                Open Dashboard <ArrowRight size={18} />
              </Link>

              <Link
                to="/login"
                className="devhub-btn-secondary px-6 py-3.5 text-sm flex items-center gap-2"
              >
                Login 
              </Link>
            </div>

            {/* Quick Badges */}
            <div className="flex items-center gap-6 pt-4 text-xs font-semibold text-[var(--text-muted)] border-t border-[var(--border)]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-[#22C55E]" /> Express JWT Auth
              </span>
              <span className="flex items-center gap-1.5">
                <GithubIcon size={16} className="text-[#38BDF8]" /> Live GitHub API Sync
              </span>
            </div>
          </div>

          {/* Right Column - Visual Terminal & Interactive SaaS Mockup */}
          <div className="relative" id="preview">
            <div className="devhub-card p-4 rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-[var(--border)] bg-[var(--bg-card)]">
              {/* Window Controls Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#EF4444]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#F59E0B]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#22C55E]"></div>
                </div>
                <span className="text-[11px] font-mono text-[var(--text-muted)] flex items-center gap-1">
                  <Terminal size={12} /> devhub-shell --live
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30">
                  Online
                </span>
              </div>

              {/* Code Snippet & Live Stats */}
              <div className="space-y-3">
                <div className="p-3.5 bg-[var(--bg-sec)] rounded-[12px] font-mono text-xs text-[var(--text-secondary)] border border-[var(--border)] space-y-1">
                  <p className="text-[#38BDF8]">
                    <span className="text-[#8B5CF6]">const</span> dev = <span className="text-[#22C55E]">await</span> fetchUser(<span className="text-[#F59E0B]">"harsh-chauhan-dev"</span>);
                  </p>
                  <p className="text-[var(--text-muted)]">
                    // Status: 200 OK • 18 Repositories • Express REST API Active
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-[var(--bg-sec)] rounded-[12px] border border-[var(--border)]">
                    <p className="text-[11px] text-[var(--text-muted)] font-semibold">GitHub Synced</p>
                    <h4 className="font-bold text-sm text-[#4F7CFF] mt-0.5">harsh-chauhan-dev</h4>
                  </div>
                  <div className="p-3 bg-[var(--bg-sec)] rounded-[12px] border border-[var(--border)]">
                    <p className="text-[11px] text-[var(--text-muted)] font-semibold">Node+Express Backend</p>
                    <h4 className="font-bold text-sm text-[#22C55E] mt-0.5">REST Service</h4>
                  </div>
                </div>

                <div className="p-3 bg-[var(--bg-sec)] rounded-[12px] border border-[var(--border)] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-primary)]">
                    <CheckCircle2 size={16} className="text-[#22C55E]" />
                    <span>32 Tasks Completed This Week</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#38BDF8] bg-[#38BDF8]/15 px-2 py-0.5 rounded-md">
                    +94% Velocity
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-16 max-w-7xl mx-auto px-6" id="features">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-[var(--text-primary)]">
            Built for Developer Productivity
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-2 font-medium">
            Everything software engineers, CS students, and tech leads need in a single workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="devhub-card p-6">
            <div className="p-3 rounded-[12px] bg-[#4F7CFF]/15 text-[#4F7CFF] w-fit mb-4">
              <GithubIcon size={22} />
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
              GitHub Live Profile & Repos
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Fetch real-time commit activity, repository counts, follower metrics, and project links directly from the GitHub REST API.
            </p>
          </div>

          <div className="devhub-card p-6">
            <div className="p-3 rounded-[12px] bg-[#22C55E]/15 text-[#22C55E] w-fit mb-4">
              <CheckCircle2 size={22} />
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
              Sprint Task Manager
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Prioritize tasks with High, Medium, and Low pills, filter by domain tags (Frontend, Backend, DB), and sync to Express REST API.
            </p>
          </div>

          <div className="devhub-card p-6">
            <div className="p-3 rounded-[12px] bg-[#8B5CF6]/15 text-[#8B5CF6] w-fit mb-4">
              <BookOpen size={22} />
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
              System Architecture Notes
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Save code snippets, architectural decisions, and sprint notes with category tags and modal editing tools.
            </p>
          </div>

          <div className="devhub-card p-6">
            <div className="p-3 rounded-[12px] bg-[#38BDF8]/15 text-[#38BDF8] w-fit mb-4">
              <BarChart3 size={22} />
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
              Coding Productivity Charts
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Visualize daily development hours, task completion velocity, and domain category distributions using Recharts.
            </p>
          </div>

          <div className="devhub-card p-6" id="express-backend">
            <div className="p-3 rounded-[12px] bg-[#10B981]/15 text-[#10B981] w-fit mb-4">
              <Database size={22} />
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
              Node.js + Express REST API
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Secure JWT authentication, CORS enabled RESTful endpoints, and database models for full data isolation.
            </p>
          </div>

          <div className="devhub-card p-6">
            <div className="p-3 rounded-[12px] bg-[#F59E0B]/15 text-[#F59E0B] w-fit mb-4">
              <Cloud size={22} />
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
              Live Weather & Geo Info
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Get real-time temperature, humidity, wind speeds, and weather conditions for your active city location.
            </p>
          </div>
        </div>
      </section>

      {/* Tech Stack Banner */}
      <section className="py-12 border-t border-[var(--border)] max-w-7xl mx-auto px-6" id="stack">
        <p className="text-center text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-8">
          Powered by Modern Web Technologies
        </p>

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-80 text-xs font-bold text-[var(--text-secondary)]">
          <span className="flex items-center gap-2"><Code2 size={18} className="text-[#38BDF8]" /> React 19</span>
          <span className="flex items-center gap-2"><Zap size={18} className="text-[#F59E0B]" /> Vite</span>
          <span className="flex items-center gap-2"><Sparkles size={18} className="text-[#4F7CFF]" /> Tailwind CSS v4</span>
          <span className="flex items-center gap-2"><Database size={18} className="text-[#22C55E]" /> Node.js & Express</span>
          <span className="flex items-center gap-2"><GithubIcon size={18} className="text-[#CBD5E1]" /> GitHub API</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-6 text-center text-xs text-[var(--text-muted)]">
        <p>© 2026 DevHub • Modern Developer Productivity Workspace</p>
      </footer>
    </div>
  );
};

export default Landing;