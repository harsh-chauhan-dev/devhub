import { useState, useEffect } from "react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import Loader from "../components/common/Loader";
import { scheduleService } from "../services/scheduleService";
import { useAuth } from "../hooks/useAuth";
import { Calendar, Clock, Plus, Bell, CheckCircle2, Trash2, Sparkles, Mail, AlertCircle } from "lucide-react";

const Schedules = () => {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    scheduledDate: "",
    notifyEmail: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const loadSchedules = async () => {
    try {
      const list = await scheduleService.getSchedules();
      setSchedules(list);
    } catch (err) {
      console.error("Error loading schedules:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedules();
  }, []);

  const handleCreateSchedule = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.scheduledDate) return;

    setSubmitting(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const res = await scheduleService.createSchedule(formData);
      if (res?.message && res.message.includes("Offline")) {
        setErrorMsg(res.message);
        return;
      }
      setSuccessMsg("Upcoming schedule created! Confirmation email dispatched to your inbox.");
      setFormData({
        title: "",
        description: "",
        scheduledDate: "",
        notifyEmail: true,
      });
      setIsModalOpen(false);
      loadSchedules();
    } catch (err) {
      console.error("Failed to create schedule:", err);
      setErrorMsg(err.message || "Failed to create schedule");
    } finally {
      setSubmitting(false);
      setTimeout(() => {
        setSuccessMsg("");
        setErrorMsg("");
      }, 5000);
    }
  };

  const handleToggleStatus = async (item) => {
    const nextStatus = item.status === "Scheduled" ? "Completed" : "Scheduled";
    try {
      await scheduleService.updateSchedule(item.id, { status: nextStatus });
      setSchedules((prev) =>
        prev.map((s) => (s.id === item.id ? { ...s, status: nextStatus } : s))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await scheduleService.deleteSchedule(id);
      setSchedules((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Failed to delete schedule:", err);
    }
  };

  const formatCountdown = (dateString) => {
    if (!dateString) return "";
    const target = new Date(dateString);
    const now = new Date();
    const diffMs = target - now;

    if (diffMs <= 0) return "Due Now / Passed";

    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `In ${diffMins} mins`;
    if (diffHours < 24) return `In ${diffHours} hrs`;
    return `In ${diffDays} days`;
  };

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#F8FAFC] flex items-center gap-2.5">
            <Calendar className="text-[#38BDF8]" size={28} /> Upcoming Schedule Manager
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1 font-medium">
            Schedule future meetings, release deadlines, and events with automated in-app bell & email alerts
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 font-bold shadow-lg shadow-[#4F7CFF]/20 self-start sm:self-auto"
        >
          <Plus size={16} /> Make Schedule
        </Button>
      </div>

      {successMsg && (
        <div className="p-4 bg-[#22C55E]/15 border border-[#22C55E]/30 rounded-[14px] text-[#22C55E] text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 size={16} /> {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-[#EF4444]/15 border border-[#EF4444]/30 rounded-[14px] text-[#EF4444] text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <AlertCircle size={16} /> {errorMsg}
        </div>
      )}

      {/* Schedule Items List */}
      <div className="space-y-4">
        {schedules.length === 0 ? (
          <Card className="text-center py-12">
            <div className="w-12 h-12 rounded-full bg-[#4F7CFF]/15 text-[#4F7CFF] flex items-center justify-center mx-auto mb-3">
              <Calendar size={24} />
            </div>
            <h3 className="font-bold text-base text-[#F8FAFC]">No Upcoming Schedules</h3>
            <p className="text-xs text-[#94A3B8] max-w-sm mx-auto mt-1 mb-4">
              You have zero upcoming scheduled events. Click Make Schedule to set your first reminder!
            </p>
            <Button variant="secondary" onClick={() => setIsModalOpen(true)} className="text-xs">
              <Plus size={14} className="mr-1" /> Make Schedule Now
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schedules.map((item) => {
              const countdown = formatCountdown(item.scheduledDate);
              const formattedDate = new Date(item.scheduledDate).toLocaleString([], {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={item.id}
                  className={`bg-[#1E293B] rounded-[16px] p-5 border transition-all duration-200 shadow-md ${
                    item.status === "Completed"
                      ? "border-[#334155] opacity-60"
                      : "border-[#4F7CFF]/40 hover:border-[#4F7CFF]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold mb-2 ${
                          item.status === "Completed"
                            ? "bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30"
                            : "bg-[#4F7CFF]/15 text-[#38BDF8] border border-[#4F7CFF]/30"
                        }`}
                      >
                        <Clock size={10} /> {countdown}
                      </span>
                      <h3 className="font-extrabold text-base text-[#F8FAFC] leading-snug">{item.title}</h3>
                    </div>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-[#94A3B8] hover:text-[#EF4444] p-1 rounded-[8px] transition"
                      title="Delete Schedule"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {item.description && (
                    <p className="text-xs text-[#CBD5E1] mt-2 line-clamp-2 bg-[#111827]/60 p-2.5 rounded-[10px] border border-[#334155]/40">
                      {item.description}
                    </p>
                  )}

                  <div className="mt-4 pt-3 border-t border-[#334155] flex items-center justify-between text-xs text-[#94A3B8]">
                    <div className="flex items-center gap-1.5 font-mono text-[11px]">
                      <Calendar size={13} className="text-[#38BDF8]" />
                      <span>{formattedDate}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.notifyEmail && (
                        <span className="text-[#22C55E] text-[10px] font-bold flex items-center gap-1" title="Email Notification Enabled">
                          <Mail size={12} /> Email Sync
                        </span>
                      )}
                      <button
                        onClick={() => handleToggleStatus(item)}
                        className={`px-3 py-1 rounded-[8px] text-[11px] font-bold transition ${
                          item.status === "Completed"
                            ? "bg-[#334155] text-[#CBD5E1] hover:bg-[#475569]"
                            : "bg-[#22C55E] text-white hover:bg-[#16A34A]"
                        }`}
                      >
                        {item.status === "Completed" ? "Re-open" : "Mark Done"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Make Schedule Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Make Upcoming Schedule">
        <form onSubmit={handleCreateSchedule} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#CBD5E1] mb-1">Schedule Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Sprint Release Demo & Code Review"
              className="w-full devhub-input p-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#CBD5E1] mb-1">Scheduled Date & Time *</label>
            <input
              type="datetime-local"
              required
              value={formData.scheduledDate}
              onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
              className="w-full devhub-input p-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#CBD5E1] mb-1">Description (Optional)</label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add details, links, or agenda items for this schedule..."
              className="w-full devhub-input p-2.5 text-sm resize-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="notifyEmail"
              checked={formData.notifyEmail}
              onChange={(e) => setFormData({ ...formData, notifyEmail: e.target.checked })}
              className="w-4 h-4 rounded border-[#334155] text-[#4F7CFF] focus:ring-0 accent-[#4F7CFF]"
            />
            <label htmlFor="notifyEmail" className="text-xs font-semibold text-[#CBD5E1] cursor-pointer flex items-center gap-1.5">
              <Mail size={14} className="text-[#38BDF8]" /> Send automatic email notification to {user?.email || "my email"}
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="font-bold">
              {submitting ? "Creating..." : "Save Schedule"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Schedules;
