// Analytics Service for DevHub Dashboard
import { fetchAPI } from "./api";

const EMPTY_ANALYTICS = {
  weeklyTasks: [
    { day: "Mon", tasks: 0, hours: 0 },
    { day: "Tue", tasks: 0, hours: 0 },
    { day: "Wed", tasks: 0, hours: 0 },
    { day: "Thu", tasks: 0, hours: 0 },
    { day: "Fri", tasks: 0, hours: 0 },
    { day: "Sat", tasks: 0, hours: 0 },
    { day: "Sun", tasks: 0, hours: 0 },
  ],
  overallStats: {
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    totalNotes: 0,
    codingHours: 0,
    commitCount: 0,
    productivityScore: "0%",
  },
  categoryBreakdown: [],
};

export const analyticsService = {
  getAnalyticsData: async () => {
    try {
      const data = await fetchAPI("/analytics");
      if (data && data.overallStats) {
        return data;
      }
    } catch (err) {
      console.warn("Analytics API fetch warning:", err.message);
    }
    return EMPTY_ANALYTICS;
  },
};
