import GithubWidget from "../components/widgets/GithubWidget";
import TodoWidget from "../components/widgets/TodoWidget";
import NotesWidget from "../components/widgets/NotesWidget";
import WeatherWidget from "../components/widgets/WeatherWidget";
import CalendarWidget from "../components/widgets/CalendarWidget";
import StatsWidget from "../components/widgets/StatsWidget";
import Card from "../components/common/Card";
import { useAuth } from "../hooks/useAuth";
import { Sparkles, Calendar as CalendarIcon, GitCommit, CheckCircle2, FileCode } from "lucide-react";

const recentActivities = [
  { id: 1, icon: GitCommit, title: "Pushed 3 commits to harsh-chauhan-dev/devhub", time: "15 mins ago", color: "text-[#38BDF8]" },
  { id: 2, icon: CheckCircle2, title: "Completed task: Setup PostgreSQL database schema in Supabase", time: "42 mins ago", color: "text-[#22C55E]" },
  { id: 3, icon: FileCode, title: "Created new note: System Architecture Notes", time: "2 hrs ago", color: "text-[#8B5CF6]" },
];

const Dashboard = () => {
  const { user } = useAuth();
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Hero Banner */}
      <div className="devhub-gradient-hero text-white rounded-[24px] p-6 md:p-8 shadow-[0_12px_40px_rgba(79,124,255,0.25)] flex flex-col md:flex-row md:items-center justify-between gap-6 border border-white/10">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/15 backdrop-blur-md mb-3 text-white">
            <Sparkles size={14} className="text-[#38BDF8]" /> Developer & Computer Science Workspace
          </span>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
            Welcome back, {user?.name?.split(" ")[0] || "Harsh"}! 👋
          </h1>
          <p className="text-white/80 text-sm mt-1.5 max-w-xl font-medium leading-relaxed">
            Your high-performance workspace for repository stats, system notes, active tasks, and coding productivity.
          </p>
        </div>
        <div className="bg-black/20 backdrop-blur-md px-4 py-3 rounded-[16px] border border-white/15 text-xs font-semibold flex items-center gap-2 self-start md:self-auto">
          <CalendarIcon size={16} className="text-[#38BDF8]" />
          <span>{today}</span>
        </div>
      </div>

      {/* Widgets Grid */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        <GithubWidget />
        <TodoWidget />
        <NotesWidget />
        <WeatherWidget />
        <CalendarWidget />
        <StatsWidget />
      </div>

      {/* Recent Activity Timeline */}
      <Card title="Recent Activity">
        <div className="space-y-3.5">
          {recentActivities.map((act) => (
            <div
              key={act.id}
              className="flex items-center justify-between p-3.5 rounded-[12px] bg-[#111827] border border-[#334155] hover:border-[#4F7CFF]/50 transition duration-200"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-[10px] bg-[#1E293B] ${act.color}`}>
                  <act.icon size={16} />
                </div>
                <span className="text-xs font-semibold text-[#F8FAFC]">
                  {act.title}
                </span>
              </div>
              <span className="text-[11px] text-[#94A3B8] font-medium">
                {act.time}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;