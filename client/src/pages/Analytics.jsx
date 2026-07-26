import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { analyticsService } from "../services/analyticsService";
import { CheckCircle, Clock, Zap, Target } from "lucide-react";
import Loader from "../components/common/Loader";

const CHART_COLORS = ["#4F7CFF", "#22C55E", "#F59E0B", "#8B5CF6", "#38BDF8", "#EC4899"];

const Analytics = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(analyticsService.getAnalyticsData());
  }, []);

  if (!data) {
    return (
      <div className="py-12">
        <Loader />
      </div>
    );
  }

  const { weeklyTasks, overallStats, categoryBreakdown } = data;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-[#F8FAFC]">Productivity & Analytics</h1>
        <p className="text-xs text-[#94A3B8] mt-1 font-medium">
          Track your coding velocity, task completion metrics, and weekly development trends
        </p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1E293B] rounded-[16px] p-5 border border-[#334155] shadow-[0_8px_30px_rgba(0,0,0,0.25)] flex items-center gap-4">
          <div className="p-3 bg-[#4F7CFF]/15 rounded-[12px] text-[#4F7CFF]">
            <Target size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#94A3B8]">Total Tasks</p>
            <h3 className="text-2xl font-black text-[#F8FAFC]">{overallStats.totalTasks}</h3>
          </div>
        </div>

        <div className="bg-[#1E293B] rounded-[16px] p-5 border border-[#334155] shadow-[0_8px_30px_rgba(0,0,0,0.25)] flex items-center gap-4">
          <div className="p-3 bg-[#22C55E]/15 rounded-[12px] text-[#22C55E]">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#94A3B8]">Completed</p>
            <h3 className="text-2xl font-black text-[#F8FAFC]">{overallStats.completedTasks}</h3>
          </div>
        </div>

        <div className="bg-[#1E293B] rounded-[16px] p-5 border border-[#334155] shadow-[0_8px_30px_rgba(0,0,0,0.25)] flex items-center gap-4">
          <div className="p-3 bg-[#F59E0B]/15 rounded-[12px] text-[#F59E0B]">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#94A3B8]">Coding Hours</p>
            <h3 className="text-2xl font-black text-[#F8FAFC]">{overallStats.codingHours}h</h3>
          </div>
        </div>

        <div className="bg-[#1E293B] rounded-[16px] p-5 border border-[#334155] shadow-[0_8px_30px_rgba(0,0,0,0.25)] flex items-center gap-4">
          <div className="p-3 bg-[#38BDF8]/15 rounded-[12px] text-[#38BDF8]">
            <Zap size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#94A3B8]">Productivity</p>
            <h3 className="text-2xl font-black text-[#F8FAFC]">{overallStats.productivityScore}</h3>
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart - Weekly Tasks */}
        <div className="lg:col-span-2 bg-[#1E293B] rounded-[16px] p-6 border border-[#334155] shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
          <h2 className="text-base font-bold mb-1 text-[#F8FAFC]">Weekly Task Output</h2>
          <p className="text-xs text-[#94A3B8] mb-6">Completed tasks per day of the week</p>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyTasks}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111827",
                    border: "1px solid #334155",
                    borderRadius: "12px",
                    color: "#F8FAFC",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="tasks" fill="#4F7CFF" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart - Category Distribution */}
        <div className="bg-[#1E293B] rounded-[16px] p-6 border border-[#334155] shadow-[0_8px_30px_rgba(0,0,0,0.25)] flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold mb-1 text-[#F8FAFC]">Task Distribution</h2>
            <p className="text-xs text-[#94A3B8] mb-4">By category domain</p>
          </div>

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  innerRadius={45}
                  paddingAngle={5}
                >
                  {categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-semibold pt-2">
            {categoryBreakdown.map((item, idx) => (
              <div key={item.category} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}></span>
                <span className="text-[#CBD5E1]">{item.category} ({item.count})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Coding Hours Trend Chart */}
      <div className="bg-[#1E293B] rounded-[16px] p-6 border border-[#334155] shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
        <h2 className="text-base font-bold mb-1 text-[#F8FAFC]">Daily Coding Time (Hours)</h2>
        <p className="text-xs text-[#94A3B8] mb-6">Development hours recorded this week</p>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyTasks}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="day" stroke="#94A3B8" fontSize={12} />
              <YAxis stroke="#94A3B8" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                  color: "#F8FAFC",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="hours"
                stroke="#22C55E"
                strokeWidth={3}
                dot={{ r: 5, fill: "#22C55E" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;