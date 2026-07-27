// Schedule Service for DevHub Dashboard
import { fetchAPI } from "./api";

export const scheduleService = {
  getSchedules: async () => {
    try {
      const data = await fetchAPI("/schedules");
      if (Array.isArray(data)) {
        return data.map((s) => ({
          id: s.id,
          title: s.title,
          description: s.description || "",
          scheduledDate: s.scheduled_date || s.scheduledDate,
          status: s.status || "Scheduled",
          notifyEmail: s.notify_email !== false,
          createdAt: s.created_at || s.createdAt,
        }));
      }
    } catch (err) {
      console.warn("Schedule API fetch warning:", err.message);
    }
    return [];
  },

  createSchedule: async ({ title, description, scheduledDate, notifyEmail }) => {
    return await fetchAPI("/schedules", {
      method: "POST",
      body: { title, description, scheduledDate, notifyEmail },
    });
  },

  updateSchedule: async (id, updatedFields) => {
    return await fetchAPI(`/schedules/${id}`, {
      method: "PUT",
      body: updatedFields,
    });
  },

  deleteSchedule: async (id) => {
    return await fetchAPI(`/schedules/${id}`, {
      method: "DELETE",
    });
  },
};
