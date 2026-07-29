import jwt from "jsonwebtoken";
import { queryDB, isPgConnected } from "../config/db.js";

const parseCookies = (req) => {
  if (!req.headers.cookie) return {};
  return req.headers.cookie.split(";").reduce((acc, cookieStr) => {
    const [key, ...val] = cookieStr.trim().split("=");
    if (key) acc[key] = val.join("=");
    return acc;
  }, {});
};

export const protect = async (req, res, next) => {
  let token = null;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    const cookies = parseCookies(req);
    token = cookies.token;
  }

  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "super_secret_jwt_key_devhub_2026"
      );

      if (isPgConnected) {
        const result = await queryDB(
          "SELECT id, name, email, role, bio, location, github_username, avatar, skills FROM users WHERE id = $1",
          [decoded.id]
        );

        if (result.rows.length > 0) {
          const u = result.rows[0];
          const cleanHandle = (u.github_username && u.github_username.trim()) || u.email?.split("@")[0] || "developer";
          req.user = {
            _id: u.id,
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            bio: u.bio,
            location: u.location,
            githubUsername: cleanHandle,
            avatar: u.avatar || `https://github.com/${cleanHandle}.png`,
            skills: u.skills,
          };
          return next();
        }
      }

      return res.status(401).json({ message: "Not authorized, user record not found" });
    } catch (error) {
      console.error("JWT Verification Failure:", error.message);
      return res.status(401).json({ message: `Not authorized, token verification failed: ${error.message}` });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, missing authorization token" });
  }
};
