import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { queryDB, isPgConnected } from "../config/db.js";
import { sendNotificationEmail } from "../services/mailService.js";

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || "super_secret_jwt_key_devhub_2026",
    {
      expiresIn: process.env.JWT_EXPIRE || "30d",
    }
  );
};

// Helper utility to parse clean GitHub handle from full URL or string
export const cleanGithubUsername = (input) => {
  if (!input || typeof input !== "string") return "developer";
  let str = input.trim();
  str = str.replace(/\/+$/, "");
  if (str.includes("github.com/")) {
    const parts = str.split("github.com/");
    str = parts[parts.length - 1].split("/")[0];
  }
  str = str.replace(/^@/, "");
  return str.trim() || "developer";
};

// @desc    Register user in PostgreSQL
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password, githubUsername } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please provide name, email, and password" });
  }

  const github = cleanGithubUsername(githubUsername || email.split("@")[0]);
  const avatarUrl = `https://github.com/${github}.png`;

  try {
    if (!isPgConnected) {
      return res.status(500).json({ message: "PostgreSQL Database Connection Offline" });
    }

    // Check if user already exists
    const existing = await queryDB("SELECT id FROM users WHERE email = $1", [email.toLowerCase()]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Hash password using bcryptjs
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user into PostgreSQL
    const result = await queryDB(
      `INSERT INTO users (name, email, password, github_username, avatar)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, role, bio, location, github_username, avatar, skills`,
      [name, email.toLowerCase(), hashedPassword, github, avatarUrl]
    );

    const user = result.rows[0];
    const token = generateToken(user.id);

    // 1. Create Welcome Database Notification
    await queryDB(
      `INSERT INTO notifications (user_id, message, type) VALUES ($1, $2, $3)`,
      [
        user.id,
        `Welcome to DevHub! Your account and GitHub profile (@${github}) have been connected.`,
        "system",
      ]
    ).catch(() => {});

    // 2. Dispatch Welcome Email via Nodemailer
    sendNotificationEmail({
      to: user.email,
      subject: "🎉 Welcome to DevHub Developer Workspace!",
      title: `Welcome aboard, ${user.name}!`,
      body: `Your DevHub workspace account has been created successfully. Your GitHub profile (<strong>@${github}</strong>) is synced and ready.`,
      actionUrl: "http://localhost:5173/dashboard",
    }).catch((err) => console.warn("Welcome email error:", err.message));

    return res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        location: user.location,
        githubUsername: user.github_username,
        avatar: user.avatar,
        skills: user.skills,
      },
      token,
    });
  } catch (error) {
    console.error("PG Register Error:", error.message);
    return res.status(500).json({ message: "Registration failed, database error" });
  }
};

// @desc    Authenticate user & get token from PostgreSQL
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password" });
  }

  try {
    if (!isPgConnected) {
      return res.status(500).json({ message: "PostgreSQL Database Connection Offline" });
    }

    const result = await queryDB("SELECT * FROM users WHERE email = $1", [email.toLowerCase()]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user.id);
    const userGithub = cleanGithubUsername(user.github_username || user.email?.split("@")[0]);
    const userAvatar = user.avatar || `https://github.com/${userGithub}.png`;

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        location: user.location,
        githubUsername: userGithub,
        avatar: userAvatar,
        skills: user.skills,
      },
      token,
    });
  } catch (error) {
    console.error("PG Login Error:", error.message);
    return res.status(500).json({ message: "Login failed, database error" });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  res.json(req.user);
};

// @desc    Update user profile in PostgreSQL
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  const { name, role, bio, location, githubUsername, avatar, skills } = req.body;
  const github = cleanGithubUsername(githubUsername || req.user.githubUsername);
  const avatarUrl = avatar || `https://github.com/${github}.png`;

  try {
    if (isPgConnected && req.user.id && req.user.id.includes("-")) {
      const result = await queryDB(
        `UPDATE users
         SET name = COALESCE($1, name),
             role = COALESCE($2, role),
             bio = COALESCE($3, bio),
             location = COALESCE($4, location),
             github_username = $5,
             avatar = $6,
             skills = COALESCE($7, skills)
         WHERE id = $8
         RETURNING id, name, email, role, bio, location, github_username, avatar, skills`,
        [name, role, bio, location, github, avatarUrl, skills, req.user.id]
      );

      if (result.rows.length > 0) {
        const u = result.rows[0];
        return res.json({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          bio: u.bio,
          location: u.location,
          githubUsername: u.github_username,
          avatar: u.avatar,
          skills: u.skills,
        });
      }
    }
  } catch (error) {
    console.error("PG Update Profile Error:", error.message);
    return res.status(500).json({ message: "Update profile failed" });
  }

  res.json({
    ...req.user,
    ...req.body,
    githubUsername: github,
    avatar: avatarUrl,
  });
};
