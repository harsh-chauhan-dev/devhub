import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { queryDB, isPgConnected } from "../config/db.js";
import { sendAuthVerificationEmail, sendWelcomeEmail, sendProfileUpdatedEmail } from "../services/mailService.js";

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

// Helper utility to set HTTP-Only cookie natively
export const sendTokenCookie = (res, token) => {
  res.setHeader(
    "Set-Cookie",
    `token=${token}; HttpOnly; Path=/; Max-Age=${30 * 24 * 60 * 60}; SameSite=Lax`
  );
};

// Helper utility to clear HTTP-Only cookie natively
export const clearTokenCookie = (res) => {
  res.setHeader(
    "Set-Cookie",
    "token=; HttpOnly; Path=/; Max-Age=0; SameSite=none; secure"
  );
};

// Helper utility to hash tokens securely with SHA256 (matching auth_services)
export const hashToken = (token) => {
  if (!token) return "";
  return crypto.createHash("sha256").update(token).digest("hex");
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

// @desc    Register user in PostgreSQL and dispatch Email Verification
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

    // Insert new user into PostgreSQL (is_verified = FALSE)
    const result = await queryDB(
      `INSERT INTO users (name, email, password, github_username, avatar, is_verified)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, email, role, bio, location, github_username, avatar, skills, is_verified`,
      [name, email.toLowerCase(), hashedPassword, github, avatarUrl, false]
    );

    const user = result.rows[0];

    // Generate raw verification token and store SHA256 token hash in email_verifications table
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = hashToken(verificationToken);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 Hours

    await queryDB(
      `INSERT INTO email_verifications (user_id, verification_token_hash, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, tokenHash, expiresAt]
    );

    // Insert initial Registration In-App Notification
    await queryDB(
      `INSERT INTO notifications (user_id, title, message, description, type)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        user.id,
        "Welcome to DevHub Workspace 🚀",
        "Verification email dispatched!",
        "Please check your inbox and verify your email address to unlock full developer suite capabilities.",
        "auth_verification",
      ]
    ).catch((err) => console.error("Registration notification error:", err));

    // Dispatch Auth Email Verification via Nodemailer
    const clientBaseUrl = process.env.CLIENT_URL || "http://localhost:5173";
    sendAuthVerificationEmail({
      to: user.email,
      name: user.name,
      verificationToken,
      actionUrl: `${clientBaseUrl}/verify-email?token=${verificationToken}`,
    }).catch((err) => console.error("Registration mail dispatch error:", err));

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
        isVerified: user.is_verified,
      },
      message: "Registration successful! A verification email has been sent to your email inbox.",
    });
  } catch (error) {
    return res.status(500).json({ message: "Registration failed, database error" });
  }
};

// @desc    Verify email address using verification token
// @route   POST /api/auth/verify-email
// @access  Public
export const verifyEmail = async (req, res) => {
  const token = req.body.token || req.query.token;

  if (!token) {
    return res.status(400).json({ message: "Verification token is required" });
  }

  try {
    if (!isPgConnected) {
      return res.status(500).json({ message: "PostgreSQL Database Connection Offline" });
    }

    const tokenHash = hashToken(token);
    
    // 1. Primary check: email_verifications table
    let result = await queryDB(
      "SELECT id, user_id, expires_at FROM email_verifications WHERE verification_token_hash = $1 OR verification_token_hash = $2",
      [tokenHash, token]
    );

    let userId = null;

    if (result.rows.length > 0) {
      const record = result.rows[0];
      if (new Date() > new Date(record.expires_at)) {
        return res.status(400).json({ message: "Verification token expired. Please request a new verification email." });
      }
      userId = record.user_id;
    } else {
      // 2. Fallback check: direct verification_token on users table
      const userResult = await queryDB(
        "SELECT id FROM users WHERE verification_token = $1",
        [token]
      );
      if (userResult.rows.length > 0) {
        userId = userResult.rows[0].id;
      }
    }

    if (!userId) {
      return res.status(400).json({ message: "Invalid or expired verification token" });
    }

    // Mark user as verified in database
    await queryDB(
      "UPDATE users SET is_verified = TRUE, verification_token = NULL WHERE id = $1",
      [userId]
    );

    // Clean up consumed token from email_verifications table
    await queryDB(
      "DELETE FROM email_verifications WHERE user_id = $1",
      [userId]
    );

    // Fetch user details for welcome email & notification
    const userRes = await queryDB("SELECT name, email FROM users WHERE id = $1", [userId]);
    if (userRes.rows.length > 0) {
      const u = userRes.rows[0];
      // Create Welcome In-App Notification
      await queryDB(
        `INSERT INTO notifications (user_id, title, message, description, type)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          userId,
          "Welcome to DevHub Workspace 🎉",
          "Account verified successfully!",
          "Your email has been verified. Explore your developer dashboard, task manager, notebook, and schedules.",
          "auth_welcome",
        ]
      ).catch((err) => console.error("Welcome notification error:", err));

      // Dispatch Welcome Email
      sendWelcomeEmail({
        to: u.email,
        name: u.name,
        actionUrl: "http://localhost:5173/dashboard",
      }).catch(() => {});
    }

    return res.json({
      success: true,
      message: "Email address verified successfully! You can now log in to your account.",
    });
  } catch (error) {
    return res.status(500).json({ message: "Email verification failed, database error" });
  }
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
export const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    if (!isPgConnected) {
      return res.status(500).json({ message: "PostgreSQL Database Connection Offline" });
    }

    const userRes = await queryDB(
      "SELECT id, name, email, is_verified FROM users WHERE email = $1",
      [email.toLowerCase()]
    );

    if (userRes.rows.length === 0) {
      return res.json({ message: "If an account exists with this email, a verification link has been sent." });
    }

    const user = userRes.rows[0];

    if (user.is_verified) {
      return res.status(400).json({ message: "Email address is already verified." });
    }

    // 60-second cooldown check from latest token creation
    const tokenRes = await queryDB(
      "SELECT created_at FROM email_verifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1",
      [user.id]
    );

    if (tokenRes.rows.length > 0) {
      const lastSent = new Date(tokenRes.rows[0].created_at).getTime();
      if (Date.now() - lastSent < 60 * 1000) {
        return res.status(429).json({ message: "Please wait 60 seconds before requesting another verification email." });
      }
    }

    // Delete previous verification tokens
    await queryDB("DELETE FROM email_verifications WHERE user_id = $1", [user.id]);

    // Generate new token & store hash
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = hashToken(verificationToken);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await queryDB(
      "INSERT INTO email_verifications (user_id, verification_token_hash, expires_at) VALUES ($1, $2, $3)",
      [user.id, tokenHash, expiresAt]
    );

    // Dispatch Verification Email
    await sendAuthVerificationEmail({
      to: user.email,
      name: user.name,
      verificationToken,
      actionUrl: `http://localhost:5173/verify-email?token=${verificationToken}`,
    });

    return res.json({ message: "Verification email sent successfully. Please check your email inbox." });
  } catch (error) {
    return res.status(500).json({ message: "Failed to resend verification email" });
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

    // Require email verification matching auth_services policy
    if (!user.is_verified) {
      return res.status(403).json({
        message: "Please verify your email address before logging in.",
        isVerified: false,
      });
    }

    const token = generateToken(user.id);
    const userGithub = cleanGithubUsername(user.github_username || user.email?.split("@")[0]);
    const userAvatar = user.avatar || `https://github.com/${userGithub}.png`;

    // Set HTTP-Only cookie for auth
    sendTokenCookie(res, token);

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
        isVerified: user.is_verified,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Login failed, database error" });
  }
};

// @desc    Logout user & clear HTTP-Only cookie
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = async (req, res) => {
  clearTokenCookie(res);
  return res.json({ message: "Logged out successfully" });
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

        // Create in-app notification for profile update
        await queryDB(
          `INSERT INTO notifications (user_id, title, message, description, type)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            req.user.id,
            "Profile Information Updated",
            "Your profile details were updated",
            "Developer profile, role, bio, and GitHub handle changes saved.",
            "profile_updated",
          ]
        ).catch((err) => console.error("Profile notification error:", err));

        // Dispatch Security Email
        if (u.email) {
          sendProfileUpdatedEmail({
            to: u.email,
            name: u.name,
            actionUrl: "http://localhost:5173/profile",
          }).catch(() => {});
        }

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
    return res.status(500).json({ message: "Update profile failed" });
  }

  res.json({
    ...req.user,
    ...req.body,
    githubUsername: github,
    avatar: avatarUrl,
  });
};
