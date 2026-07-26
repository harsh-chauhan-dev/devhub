import { useEffect, useState } from "react";
import { Award, CheckCircle2, Clock } from "lucide-react";
import Card from "../common/Card";
import { analyticsService } from "../../services/analyticsService";

const StatsWidget = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    setStats(analyticsService.getAnalyticsData().overallStats);
  }, []);

  if (!stats) return null;

  return (
    <Card title="Productivity Overview">
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-[#111827] p-3 rounded-[12px] border border-[#334155]">
          <div className="flex items-center gap-2.5">
            <Award className="text-[#38BDF8]" size={20} />
            <div>
              <p className="text-[11px] text-[#94A3B8] font-medium">Performance Score</p>
              <h4 className="font-extrabold text-sm text-[#F8FAFC]">
                {stats.productivityScore} High Velocity
              </h4>
            </div>
          </div>
          <span className="text-[11px] font-bold text-[#22C55E] bg-[#22C55E]/15 border border-[#22C55E]/30 px-2 py-0.5 rounded-full">
            +12%
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-[#CBD5E1] flex items-center gap-1">
                <CheckCircle2 size={13} className="text-[#22C55E]" /> Completed Tasks
              </span>
              <span className="font-bold text-[#38BDF8]">
                {stats.completedTasks} / {stats.totalTasks} ({Math.round((stats.completedTasks / stats.totalTasks) * 100)}%)
              </span>
            </div>
            <div className="w-full h-2 bg-[#111827] rounded-full overflow-hidden border border-[#334155]">
              <div
                className="h-full bg-[#4F7CFF] rounded-full transition-all duration-500"
                style={{ width: `${(stats.completedTasks / stats.totalTasks) * 100}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-[#CBD5E1] flex items-center gap-1">
                <Clock size={13} className="text-[#38BDF8]" /> Weekly Coding Target
              </span>
              <span className="font-bold text-[#22C55E]">
                {stats.codingHours} / 50 hrs
              </span>
            </div>
            <div className="w-full h-2 bg-[#111827] rounded-full overflow-hidden border border-[#334155]">
              <div
                className="h-full bg-[#22C55E] rounded-full transition-all duration-500"
                style={{ width: `${(stats.codingHours / 50) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center pt-2 border-t border-[#334155]">
          <div className="p-2 rounded-[10px] bg-[#111827] border border-[#334155]/50">
            <p className="text-[11px] text-[#94A3B8]">Commits This Month</p>
            <h4 className="font-bold text-sm text-[#F8FAFC]">{stats.commitCount}</h4>
          </div>
          <div className="p-2 rounded-[10px] bg-[#111827] border border-[#334155]/50">
            <p className="text-[11px] text-[#94A3B8]">Saved Notes</p>
            <h4 className="font-bold text-sm text-[#F8FAFC]">{stats.totalNotes}</h4>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StatsWidget;