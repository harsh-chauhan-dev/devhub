// Analytics Service for DevHub Dashboard

export const analyticsService = {
  getAnalyticsData: () => {
    return {
      weeklyTasks: [
        { day: "Mon", tasks: 4, hours: 6 },
        { day: "Tue", tasks: 6, hours: 8 },
        { day: "Wed", tasks: 5, hours: 7.5 },
        { day: "Thu", tasks: 8, hours: 9 },
        { day: "Fri", tasks: 7, hours: 8 },
        { day: "Sat", tasks: 9, hours: 5 },
        { day: "Sun", tasks: 3, hours: 3 },
      ],
      overallStats: {
        totalTasks: 42,
        completedTasks: 32,
        pendingTasks: 10,
        totalNotes: 14,
        codingHours: 46.5,
        commitCount: 89,
        productivityScore: "94%",
      },
      categoryBreakdown: [
        { category: "Frontend", count: 18 },
        { category: "Backend", count: 12 },
        { category: "Database", count: 7 },
        { category: "DevOps", count: 5 },
      ],
    };
  },
};
