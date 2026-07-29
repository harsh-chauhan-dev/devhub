import { Calendar, Clock, Plus, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import Card from "../common/Card";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { scheduleService } from "../../services/scheduleService";

const CalendarWidget = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const data = await scheduleService.getSchedules();
      // Filter out completed and sort by scheduledDate ascending
      const sorted = (Array.isArray(data) ? data : []).sort(
        (a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate)
      );
      setSchedules(sorted);
    } catch (err) {
      console.error("Failed to fetch schedules in widget:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleAddEvent = async () => {
    if (!newEventTitle.trim()) return;
    setSubmitting(true);
    try {
      // Default to 1 hour in future if no date string picked
      const targetDate = newEventDate || new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16);
      await scheduleService.createSchedule({
        title: newEventTitle,
        scheduledDate: targetDate,
        notifyEmail: true,
      });
      setNewEventTitle("");
      setNewEventDate("");
      setShowInput(false);
      await fetchSchedules();
    } catch (err) {
      console.error("Failed to create quick schedule:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatEventTime = (dateStr) => {
    if (!dateStr) return { dateText: "Upcoming", timeText: "", tag: "Upcoming", color: "border-[#38BDF8] text-[#38BDF8] bg-[#38BDF8]/10" };
    const eventDate = new Date(dateStr);
    const now = new Date();

    const isToday = eventDate.toDateString() === now.toDateString();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    const isTomorrow = eventDate.toDateString() === tomorrow.toDateString();

    const timeText = eventDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const dateText = isToday ? "Today" : isTomorrow ? "Tomorrow" : eventDate.toLocaleDateString([], { month: "short", day: "numeric" });

    let tag = dateText;
    let color = "border-[#4F7CFF] text-[#38BDF8] bg-[#4F7CFF]/10";

    if (isToday) {
      tag = "Today";
      color = "border-[#22C55E] text-[#22C55E] bg-[#22C55E]/10";
    } else if (isTomorrow) {
      tag = "Tomorrow";
      color = "border-[#8B5CF6] text-[#8B5CF6] bg-[#8B5CF6]/10";
    }

    return { dateText, timeText, tag, color };
  };

  return (
    <Card title="Upcoming Schedule">
      <div className="space-y-3">
        {/* Header Bar */}
        <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-2">
          <span className="flex items-center gap-1.5 font-semibold text-[#CBD5E1]">
            <Calendar size={15} className="text-[#38BDF8]" />
            {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInput(!showInput)}
              className="text-xs text-[#38BDF8] hover:underline flex items-center gap-1 font-bold"
            >
              <Plus size={14} /> Add Event
            </button>
            <Link
              to="/schedules"
              className="text-xs text-[#94A3B8] hover:text-[#F8FAFC] flex items-center gap-1 font-medium ml-1"
            >
              Planner <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Quick Add Form */}
        {showInput && (
          <div className="p-3 bg-[#111827] border border-[#334155] rounded-[12px] space-y-2.5 animate-fadeIn">
            <input
              type="text"
              placeholder="Event title (e.g. Team Sync Meeting)..."
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              className="w-full text-xs border rounded-[8px] px-3 py-1.5 bg-[#1E293B] border-[#334155] text-[#F8FAFC] outline-none focus:border-[#4F7CFF]"
            />
            <div className="flex gap-2">
              <input
                type="datetime-local"
                value={newEventDate}
                onChange={(e) => setNewEventDate(e.target.value)}
                className="flex-1 text-xs border rounded-[8px] px-2.5 py-1.5 bg-[#1E293B] border-[#334155] text-[#F8FAFC] outline-none focus:border-[#4F7CFF]"
              />
              <button
                onClick={handleAddEvent}
                disabled={submitting}
                className="bg-[#4F7CFF] text-white text-xs px-3 py-1.5 rounded-[8px] hover:bg-[#3B6EF6] font-semibold flex items-center gap-1"
              >
                {submitting ? <Loader2 size={12} className="animate-spin" /> : "Save"}
              </button>
            </div>
          </div>
        )}

        {/* Schedule List */}
        {loading ? (
          <div className="py-8 flex justify-center text-[#94A3B8]">
            <Loader2 size={20} className="animate-spin text-[#38BDF8]" />
          </div>
        ) : schedules.length === 0 ? (
          <div className="text-center py-6 border border-dashed border-[#334155] rounded-[12px] bg-[#111827]/40">
            <Calendar size={20} className="mx-auto text-[#94A3B8] mb-1.5 opacity-60" />
            <p className="text-xs font-semibold text-[#CBD5E1]">No Upcoming Schedules</p>
            <p className="text-[11px] text-[#94A3B8] mt-0.5">Click + Add Event to create your first schedule</p>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {schedules.map((event) => {
              const { dateText, timeText, tag, color } = formatEventTime(event.scheduledDate);
              const isCompleted = event.status === "Completed";

              return (
                <div
                  key={event.id}
                  className={`p-3 rounded-[12px] border-l-4 transition duration-200 ${
                    isCompleted
                      ? "border-[#334155] bg-[#111827]/40 opacity-60"
                      : `${color} border-[#334155]`
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={`font-bold text-xs ${isCompleted ? "line-through text-[#94A3B8]" : "text-[#F8FAFC]"}`}>
                      {event.title}
                    </h4>
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        isCompleted
                          ? "bg-[#334155] text-[#94A3B8]"
                          : "bg-[#1E293B] text-[#CBD5E1] border border-[#334155]"
                      }`}
                    >
                      {isCompleted ? "Done" : tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8] mt-1 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="text-[#38BDF8]" /> {dateText} • {timeText}
                    </span>
                    {event.notifyEmail && !isCompleted && (
                      <span className="text-[10px] text-[#22C55E] font-semibold flex items-center gap-0.5">
                        <CheckCircle2 size={10} /> Email Alert
                      </span>
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
};

export default CalendarWidget;
