import { supabase } from "./supabaseClient";

const AUTH_KEY = "devhub_user";
const TOKEN_KEY = "devhub_token";

const DEFAULT_USER = {
  id: "usr_harsh",
  name: "Harsh Chauhan",
  email: "harsh@devhub.com",
  role: "Full Stack Developer",
  bio: "Passionate about building scalable web applications, React, Node.js, and modern system design.",
  skills: ["React", "Node.js", "Express", "PostgreSQL", "Tailwind CSS", "Supabase"],
  avatar: "https://avatars.githubusercontent.com/u/199341266?v=4",
  githubUsername: "harsh-chauhan-dev",
  location: "Meerut, India",
};

export const authService = {
  getCurrentUser: () => {
    const saved = localStorage.getItem(AUTH_KEY);
    if (!saved) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(DEFAULT_USER));
      localStorage.setItem(TOKEN_KEY, "demo_jwt_token_12345");
      return DEFAULT_USER;
    }
    const parsed = JSON.parse(saved);
    // Ensure actual github username and avatar if it was octocat previously
    if (parsed.githubUsername === "octocat" || !parsed.avatar || parsed.avatar.includes("unsplash")) {
      parsed.githubUsername = "harsh-chauhan-dev";
      parsed.avatar = "https://avatars.githubusercontent.com/u/199341266?v=4";
      localStorage.setItem(AUTH_KEY, JSON.stringify(parsed));
    }
    return parsed;
  },

  login: async ({ email, password }) => {
    if (!email || !password) {
      throw new Error("Please enter both email and password");
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Fetch profile from Supabase
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      const userObj = {
        id: data.user.id,
        name: profile?.name || data.user.user_metadata?.name || "Harsh Chauhan",
        email: data.user.email,
        role: profile?.role || "Full Stack Developer",
        bio: profile?.bio || "Passionate about building scalable web applications.",
        location: profile?.location || "Meerut, India",
        githubUsername: profile?.github_username || "harsh-chauhan-dev",
        avatar: profile?.avatar || "https://avatars.githubusercontent.com/u/199341266?v=4",
      };

      localStorage.setItem(AUTH_KEY, JSON.stringify(userObj));
      localStorage.setItem(TOKEN_KEY, data.session?.access_token || "token_" + Date.now());

      return { user: userObj, token: data.session?.access_token };
    } catch (supabaseError) {
      console.warn("Supabase Auth fallback to local session:", supabaseError.message);

      const userObj = { ...DEFAULT_USER, email };
      localStorage.setItem(AUTH_KEY, JSON.stringify(userObj));
      localStorage.setItem(TOKEN_KEY, "token_" + Date.now());
      return { user: userObj, token: localStorage.getItem(TOKEN_KEY) };
    }
  },

  register: async ({ name, email, password }) => {
    if (!name || !email || !password) {
      throw new Error("All fields are required");
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });

      if (error) throw error;

      const newUser = {
        ...DEFAULT_USER,
        id: data.user?.id || "usr_" + Date.now(),
        name,
        email,
      };

      // Create profile row in Supabase database
      if (data.user?.id) {
        await supabase.from("profiles").upsert([
          {
            id: data.user.id,
            name,
            email,
            role: "Full Stack Developer",
            location: "Meerut, India",
            github_username: "harsh-chauhan-dev",
            avatar: "https://avatars.githubusercontent.com/u/199341266?v=4",
          },
        ]);
      }

      localStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
      localStorage.setItem(TOKEN_KEY, data.session?.access_token || "token_" + Date.now());

      return { user: newUser, token: data.session?.access_token };
    } catch (supabaseError) {
      console.warn("Supabase SignUp fallback to local session:", supabaseError.message);

      const newUser = {
        ...DEFAULT_USER,
        id: "usr_" + Date.now(),
        name,
        email,
      };

      localStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
      localStorage.setItem(TOKEN_KEY, "token_" + Date.now());
      return { user: newUser, token: localStorage.getItem(TOKEN_KEY) };
    }
  },

  updateProfile: async (updatedFields) => {
    const current = authService.getCurrentUser();
    const updated = { ...current, ...updatedFields };

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.id) {
        await supabase.from("profiles").upsert({
          id: user.id,
          name: updated.name,
          role: updated.role,
          bio: updated.bio,
          location: updated.location,
          github_username: updated.githubUsername,
          avatar: updated.avatar,
        });
      }
    } catch (err) {
      console.warn("Supabase profile update fallback:", err.message);
    }

    localStorage.setItem(AUTH_KEY, JSON.stringify(updated));
    return updated;
  },

  logout: async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn("Supabase SignOut fallback:", err.message);
    }
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(TOKEN_KEY);
    return true;
  },
};
