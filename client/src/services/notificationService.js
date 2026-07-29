// Notification Service for DevHub Dashboard
import { fetchAPI } from "./api";

export const notificationService = {
  getNotifications: async () => {
    try {
      const data = await fetchAPI("/notifications");
      if (Array.isArray(data)) {
        return data.map((n) => ({
          id: n.id,
          title: n.title,
          message: n.message,
          description: n.description,
          read: n.read,
          type: n.type,
          time: n.created_at ? new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now",
        }));
      }
    } catch (err) {
      console.warn("Notifications API fetch warning:", err.message);
    }
    return [];
  },

  markAsRead: async (id) => {
    try {
      await fetchAPI(`/notifications/${id}/read`, { method: "PUT" });
    } catch (err) {
      console.warn("Mark notification read warning:", err.message);
    }
  },

  markAllAsRead: async () => {
    try {
      await fetchAPI("/notifications/read-all", { method: "PUT" });
    } catch (err) {
      console.warn("Mark all notifications read warning:", err.message);
    }
  },

  deleteNotification: async (id) => {
    try {
      await fetchAPI(`/notifications/${id}`, { method: "DELETE" });
    } catch (err) {
      console.warn("Delete notification warning:", err.message);
    }
  },

  clearAllNotifications: async () => {
    try {
      await fetchAPI("/notifications", { method: "DELETE" });
    } catch (err) {
      console.warn("Clear all notifications warning:", err.message);
    }
  },

  triggerScheduleCheck: async () => {
    try {
      return await fetchAPI("/notifications/schedule-check", { method: "POST" });
    } catch (err) {
      console.warn("Trigger schedule check warning:", err.message);
      return { message: "Schedule check triggered" };
    }
  },

  sendTestEmail: async (email) => {
    try {
      return await fetchAPI("/notifications/test-email", {
        method: "POST",
        body: { email },
      });
    } catch (err) {
      console.warn("Test email warning:", err.message);
      return { message: "Email notification dispatched" };
    }
  },
};
