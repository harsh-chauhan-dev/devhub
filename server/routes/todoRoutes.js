import express from "express";
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  clearCompletedTodos,
} from "../controllers/todoController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(protect, getTodos)
  .post(protect, createTodo);

router.delete("/completed", protect, clearCompletedTodos);

router.route("/:id")
  .put(protect, updateTodo)
  .delete(protect, deleteTodo);

export default router;
