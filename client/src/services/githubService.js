// GitHub Integration Service

export const githubService = {
  getUserProfile: async (username = "harsh-chauhan-dev") => {
    try {
      const res = await fetch(`https://api.github.com/users/${username}`);
      if (!res.ok) {
        throw new Error(`GitHub user '${username}' not found`);
      }
      const data = await res.json();
      return {
        username: data.login,
        name: data.name || "Harsh Chauhan",
        avatar: data.avatar_url || "https://avatars.githubusercontent.com/u/199341266?v=4",
        bio: data.bio || "Full Stack Developer building web applications & system architectures",
        publicRepos: data.public_repos ?? 18,
        followers: data.followers ?? 12,
        following: data.following ?? 8,
        location: data.location || "Meerut, India",
        htmlUrl: data.html_url || `https://github.com/${username}`,
        company: data.company || "DevHub",
      };
    } catch (err) {
      console.warn("GitHub API fetch fallback:", err.message);
      return {
        username,
        name: "Harsh Chauhan",
        avatar: "https://avatars.githubusercontent.com/u/199341266?v=4",
        bio: "Full Stack Developer building scalable web applications and learning system design.",
        publicRepos: 18,
        followers: 12,
        following: 8,
        location: "Meerut, India",
        htmlUrl: `https://github.com/${username}`,
        company: "DevHub",
      };
    }
  },

  getUserRepos: async (username = "harsh-chauhan-dev") => {
    try {
      const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
      if (!res.ok) throw new Error("Failed to fetch repos");
      const repos = await res.json();
      if (Array.isArray(repos) && repos.length > 0) {
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
      console.warn("GitHub repos fallback:", err.message);
    }
    return [
      {
        id: 1,
        name: "devhub",
        description: "Developer productivity portal dashboard with React & Supabase",
        stars: 12,
        forks: 4,
        language: "JavaScript",
        url: `https://github.com/${username}/devhub`,
      },
      {
        id: 2,
        name: "backend_node-express",
        description: "Node.js & Express RESTful microservices architecture",
        stars: 8,
        forks: 2,
        language: "JavaScript",
        url: `https://github.com/${username}`,
      },
      {
        id: 3,
        name: "12_month_plan",
        description: "12 Month Full Stack Development & System Design Roadmap",
        stars: 24,
        forks: 6,
        language: "JavaScript",
        url: `https://github.com/${username}`,
      },
    ];
  },
};
