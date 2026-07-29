import { fetchAPI } from "./api";

const AUTH_KEY = "devhub_user";
const TOKEN_KEY = "devhub_token";

export const authService = {
  getCurrentUser: () => {
    const saved = localStorage.getItem(AUTH_KEY);
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch (e) {
      return null;
    }
  },

  getMe: async () => {
    try {
      const user = await fetchAPI("/auth/me");
      if (user && user.id) {
        localStorage.setItem(AUTH_KEY, JSON.stringify(user));
        return user;
      }
    } catch (err) {
      localStorage.removeItem(AUTH_KEY);
    }
    return null;
  },

  login: async ({ email, password }) => {
    if (!email || !password) {
      throw new Error("Please enter both email and password");
    }

    const response = await fetchAPI("/auth/login", {
      method: "POST",
      body: { email, password },
    });

    const { user, token } = response;
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
    return { user };
  },

  register: async ({ name, email, password, githubUsername }) => {
    if (!name || !email || !password) {
      throw new Error("All fields are required");
    }

    const response = await fetchAPI("/auth/register", {
      method: "POST",
      body: { name, email, password, githubUsername },
    });

    return response;
  },

  verifyEmail: async (token) => {
    return await fetchAPI("/auth/verify-email", {
      method: "POST",
      body: { token },
    });
  },

  resendVerification: async (email) => {
    return await fetchAPI("/auth/resend-verification", {
      method: "POST",
      body: { email },
    });
  },

  updateProfile: async (updatedFields) => {
    const response = await fetchAPI("/auth/profile", {
      method: "PUT",
      body: updatedFields,
    });

    const updatedUser = response.id ? response : { ...authService.getCurrentUser(), ...updatedFields };
    localStorage.setItem(AUTH_KEY, JSON.stringify(updatedUser));
    return updatedUser;
  },

  logout: async () => {
    try {
      await fetchAPI("/auth/logout", { method: "POST" });
    } catch (err) {
      // Ignore logout errors
    }
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(TOKEN_KEY);
    return true;
  },
};
