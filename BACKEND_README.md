# DevHub — Node.js & Express Backend Documentation & Implementation Guide

This guide provides everything you need to build, structure, and deploy a separate **Node.js + Express** REST API backend for the **DevHub** developer productivity portal.

---

## 📐 1. Tech Stack Overview

- **Runtime & Framework**: Node.js (v18+) with Express.js
- **Database Options**:
  - **MongoDB** with Mongoose *(Recommended for fast prototyping)*
  - **PostgreSQL** with Prisma or `pg` / Sequelize
- **Authentication**: JSON Web Tokens (JWT) & `bcryptjs` for password hashing
- **Security & Utilities**: CORS, `dotenv`, `express-validator`, `helmet`

---

## 📁 2. Recommended Directory Structure

```text
devhub-backend/
├── config/
│   └── db.js                 # Database connection (MongoDB / PostgreSQL)
├── controllers/
│   ├── authController.js     # User registration, login, profile updates
│   ├── noteController.js     # CRUD operations for notes
│   └── todoController.js     # CRUD operations for sprint todos
├── middleware/
│   ├── authMiddleware.js     # JWT token verification
│   └── errorMiddleware.js    # Global Express error handler
├── models/
│   ├── User.js               # User & Profile model
│   ├── Note.js               # Note model
│   └── Todo.js               # Todo model
├── routes/
│   ├── authRoutes.js         # /api/auth endpoints
│   ├── noteRoutes.js         # /api/notes endpoints
│   └── todoRoutes.js         # /api/todos endpoints
├── .env.example
├── .gitignore
├── package.json
└── server.js                 # Application entry point
```

---

## ⚙️ 3. Environment Variables (`.env.example`)

Create a `.env` file in the root of your backend project:

```env
PORT=5000
NODE_ENV=development

# MongoDB Connection String (If using MongoDB)
MONGO_URI=mongodb://localhost:27017/devhub

# OR PostgreSQL Connection String (If using PostgreSQL)
DATABASE_URL=postgresql://postgres:password@localhost:5432/devhub?schema=public

# JWT Authentication Secret
JWT_SECRET=super_secret_jwt_key_devhub_2026
JWT_EXPIRE=30d

# Frontend CORS Origin
CLIENT_URL=http://localhost:5173
```

---

## 🗄️ 4. Data Models / Schemas

### A. User & Profile Schema (`models/User.js`)
```javascript
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, default: "Full Stack Developer" },
    bio: { type: String, default: "Passionate developer building scalable web applications." },
    location: { type: String, default: "Meerut, India" },
    githubUsername: { type: String, default: "harsh-chauhan-dev" },
    avatar: { type: String, default: "https://avatars.githubusercontent.com/u/199341266?v=4" },
    skills: { type: [String], default: ["React", "Node.js", "Express", "PostgreSQL", "Tailwind CSS", "MongoDB"] },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
```

### B. Todo Schema (`models/Todo.js`)
```javascript
import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
    priority: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" },
    category: { type: String, default: "General" },
  },
  { timestamps: true }
);

export default mongoose.model("Todo", todoSchema);
```

### C. Note Schema (`models/Note.js`)
```javascript
import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    tag: { type: String, default: "General" },
  },
  { timestamps: true }
);

export default mongoose.model("Note", noteSchema);
```

---

## 🚀 5. REST API Specification

### Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Description | Auth Required | Request Body |
| :--- | :--- | :--- | :---: | :--- |
| `POST` | `/api/auth/register` | Register a new user account | ❌ No | `{ "name": "...", "email": "...", "password": "..." }` |
| `POST` | `/api/auth/login` | Log in and receive JWT token | ❌ No | `{ "email": "...", "password": "..." }` |
| `GET` | `/api/auth/me` | Get current logged-in user profile | 🔒 Yes | None (Bearer Token in Header) |
| `PUT` | `/api/auth/profile` | Update user profile details | 🔒 Yes | `{ "name": "...", "role": "...", "bio": "...", "location": "...", "githubUsername": "...", "avatar": "..." }` |
| `POST` | `/api/auth/logout` | Logout user | 🔒 Yes | None |

### Sprint Todo Endpoints (`/api/todos`)

| Method | Endpoint | Description | Auth Required | Request Body / Params |
| :--- | :--- | :--- | :---: | :--- |
| `GET` | `/api/todos` | Fetch all todos for logged-in user | 🔒 Yes | None |
| `POST` | `/api/todos` | Create a new todo item | 🔒 Yes | `{ "text": "...", "priority": "High", "category": "Backend" }` |
| `PUT` | `/api/todos/:id` | Toggle completion or update todo | 🔒 Yes | `{ "completed": true }` or `{ "text": "..." }` |
| `DELETE` | `/api/todos/:id` | Delete a todo item by ID | 🔒 Yes | URL param `:id` |
| `DELETE` | `/api/todos/completed` | Clear all completed todos | 🔒 Yes | None |

### System Notes Endpoints (`/api/notes`)

| Method | Endpoint | Description | Auth Required | Request Body / Params |
| :--- | :--- | :--- | :---: | :--- |
| `GET` | `/api/notes` | Fetch all notes for logged-in user | 🔒 Yes | None |
| `POST` | `/api/notes` | Create a new system note | 🔒 Yes | `{ "title": "...", "content": "...", "tag": "Architecture" }` |
| `PUT` | `/api/notes/:id` | Update an existing note | 🔒 Yes | `{ "title": "...", "content": "...", "tag": "..." }` |
| `DELETE` | `/api/notes/:id` | Delete a note by ID | 🔒 Yes | URL param `:id` |

---

## 🔒 6. Auth Middleware Boilerplate (`middleware/authMiddleware.js`)

```javascript
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "super_secret_jwt_key_devhub_2026");

      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token invalid or expired" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
};
```

---

## 💻 7. Main Application Entry Point (`server.js`)

```javascript
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json());

// Database Connection
if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch((err) => console.error("MongoDB Connection Error:", err));
}

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/notes", noteRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "DevHub Express REST Backend Server Running", timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`🚀 DevHub Backend Server running on http://localhost:${PORT}`);
});
```

---

## ⚡ 8. Step-by-Step Backend Setup Instructions

1. **Create a new folder for your backend**:
   ```bash
   mkdir devhub-backend
   cd devhub-backend
   ```

2. **Initialize Node package**:
   ```bash
   npm init -y
   ```

3. **Install Core Dependencies**:
   ```bash
   npm install express mongoose dotenv cors bcryptjs jsonwebtoken
   npm install -D nodemon
   ```

4. **Add "type": "module" and start script to `package.json`**:
   ```json
   {
     "name": "devhub-backend",
     "version": "1.0.0",
     "type": "module",
     "scripts": {
       "start": "node server.js",
       "dev": "nodemon server.js"
     }
   }
   ```

5. **Start your backend server**:
   ```bash
   npm run dev
   ```

6. **Connect Client App**:
   In your client application (`devhub/client/.env`), set:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```
