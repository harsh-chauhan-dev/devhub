import { Calendar, Clock, Plus } from "lucide-react";
import Card from "../common/Card";
import { useState } from "react";

const INITIAL_EVENTS = [
  { id: 1, title: "React 19 & Architecture Review", time: "10:00 AM", date: "Today", tag: "Work", color: "border-[#4F7CFF] text-[#38BDF8] bg-[#4F7CFF]/10" },
  { id: 2, title: "Deploy DevHub to Production", time: "02:30 PM", date: "Today", tag: "Release", color: "border-[#22C55E] text-[#22C55E] bg-[#22C55E]/10" },
  { id: 3, title: "System Design Sync & Demo", time: "04:00 PM", date: "Tomorrow", tag: "Meeting", color: "border-[#8B5CF6] text-[#8B5CF6] bg-[#8B5CF6]/10" },
];

const CalendarWidget = () => {
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [showInput, setShowInput] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");

  const handleAddEvent = () => {
    if (!newEventTitle.trim()) return;
    const newEvent = {
      id: Date.now(),
      title: newEventTitle,
      time: "03:00 PM",
      date: "Upcoming",
      tag: "Task",
      color: "border-[#38BDF8] text-[#38BDF8] bg-[#38BDF8]/10",
    };
    setEvents([...events, newEvent]);
    setNewEventTitle("");
    setShowInput(false);
  };

  return (
    <Card title="Upcoming Schedule">
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-2">
          <span className="flex items-center gap-1.5 font-semibold text-[#CBD5E1]">
            <Calendar size={15} className="text-[#38BDF8]" />
            {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
          </span>
          <button
            onClick={() => setShowInput(!showInput)}
            className="text-xs text-[#38BDF8] hover:underline flex items-center gap-1 font-bold"
          >
            <Plus size={14} /> Add Event
          </button>
        </div>

        {showInput && (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Event title..."
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddEvent()}
              className="flex-1 text-xs border rounded-[8px] px-3 py-1.5 bg-[#111827] border-[#334155] text-[#F8FAFC] outline-none focus:border-[#4F7CFF]"
            />
            <button
              onClick={handleAddEvent}
              className="bg-[#4F7CFF] text-white text-xs px-3 py-1.5 rounded-[8px] hover:bg-[#3B6EF6] font-semibold"
            >
              Add
            </button>
          </div>
        )}

        <div className="space-y-2.5 max-h-48 overflow-y-auto">
          {events.map((event) => (
            <div
              key={event.id}
              className={`p-3 rounded-[12px] border-l-4 ${event.color} border-[#334155] transition duration-200`}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-[#F8FAFC]">
                  {event.title}
                </h4>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#1E293B] text-[#CBD5E1] border border-[#334155]">
                  {event.tag}
                </span>
              </div>
              <p className="text-[11px] text-[#94A3B8] mt-1 flex items-center gap-1">
                <Clock size={12} /> {event.date} • {event.time}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default CalendarWidget;
