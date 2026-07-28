// GitHub Integration Service

export const githubService = {
  getUserProfile: async (username = "developer") => {
    const handle = (username && username.trim()) || "developer";
    try {
      const res = await fetch(`https://api.github.com/users/${handle}`);
      if (!res.ok) {
        throw new Error(`GitHub user '${handle}' not found`);
      }
      const data = await res.json();
      return {
        username: data.login || handle,
        name: data.name || data.login || handle,
        avatar: data.avatar_url || `https://github.com/${handle}.png`,
        bio: data.bio || `Developer profile (@${handle})`,
        publicRepos: data.public_repos ?? 0,
        followers: data.followers ?? 0,
        following: data.following ?? 0,
        location: data.location || "Developer Workspace",
        htmlUrl: data.html_url || `https://github.com/${handle}`,
        company: data.company || "DevHub",
      };
    } catch (err) {
      console.warn("GitHub API profile fetch warning:", err.message);
      return {
        username: handle,
        name: handle,
        avatar: `https://github.com/${handle}.png`,
        bio: `GitHub Developer (@${handle})`,
        publicRepos: 0,
        followers: 0,
        following: 0,
        location: "Developer Workspace",
        htmlUrl: `https://github.com/${handle}`,
        company: "DevHub",
      };
    }
  },

  getUserRepos: async (username = "developer") => {
    const handle = (username && username.trim()) || "developer";
    try {
      const res = await fetch(`https://api.github.com/users/${handle}/repos?sort=updated&per_page=6`);
      if (!res.ok) throw new Error("Failed to fetch repos");
      const repos = await res.json();
      if (Array.isArray(repos)) {
        return repos.map((r) => ({
          id: r.id,
          name: r.name,
          description: r.description || "No description provided",
          stars: r.stargazers_count,
          forks: r.forks_count,
          language: r.language || "JavaScript",
          url: r.html_url,
          updatedAt: r.updated_at,
        }));
      }
    } catch (err) {
      console.warn("GitHub repos fetch warning:", err.message);
    }
    return [];
  },

  getUserEvents: async (username = "developer") => {
    const handle = (username && username.trim()) || "developer";
    try {
      const res = await fetch(`https://api.github.com/users/${handle}/events/public?per_page=60`);
      if (!res.ok) throw new Error(`Failed to fetch events for '${handle}'`);
      const events = await res.json();
      if (Array.isArray(events)) {
        return events;
      }
    } catch (err) {
      console.warn("GitHub events fetch warning:", err.message);
    }
    return [];
  },
};
