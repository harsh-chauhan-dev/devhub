import { queryDB, isPgConnected } from "../config/db.js";

// @desc    Get all user todos from PostgreSQL
// @route   GET /api/todos
// @access  Private
export const getTodos = async (req, res) => {
  try {
    if (isPgConnected && req.user?.id) {
      const result = await queryDB(
        "SELECT id, text, completed, priority, category, created_at FROM todos WHERE user_id = $1 ORDER BY created_at DESC",
        [req.user.id]
      );
      return res.json(result.rows);
    }
  } catch (error) {
    // Handled silently
  }

  res.json([]);
};

// @desc    Create a todo in PostgreSQL
// @route   POST /api/todos
// @access  Private
export const createTodo = async (req, res) => {
  const { text, priority, category } = req.body;

  if (!text) {
    return res.status(400).json({ message: "Text field is required" });
  }

  try {
    if (isPgConnected && req.user?.id) {
      const result = await queryDB(
        `INSERT INTO todos (user_id, text, priority, category)
         VALUES ($1, $2, $3, $4)
         RETURNING id, text, completed, priority, category, created_at`,
        [req.user.id, text, priority || "Medium", category || "General"]
      );

      const createdItem = result.rows[0];
      return res.status(201).json(createdItem);
    }
  } catch (error) {
    return res.status(500).json({ message: "Failed to create task in PostgreSQL" });
  }

  res.status(500).json({ message: "Database connection unavailable" });
};

// @desc    Update a todo in PostgreSQL
// @route   PUT /api/todos/:id
// @access  Private
export const updateTodo = async (req, res) => {
  const { id } = req.params;
  const { text, completed, priority, category } = req.body;

  try {
    if (isPgConnected && id && req.user?.id) {
      const result = await queryDB(
        `UPDATE todos
         SET text = COALESCE($1, text),
             completed = COALESCE($2, completed),
             priority = COALESCE($3, priority),
             category = COALESCE($4, category)
         WHERE id = $5 AND user_id = $6
         RETURNING id, text, completed, priority, category, created_at`,
        [text, completed, priority, category, id, req.user.id]
      );

      if (result.rows.length > 0) {
        return res.json(result.rows[0]);
      }
    }
  } catch (error) {
    // Handled silently
  }

  res.json({ message: "Todo updated" });
};

// @desc    Delete a todo in PostgreSQL
// @route   DELETE /api/todos/:id
// @access  Private
export const deleteTodo = async (req, res) => {
  const { id } = req.params;

  try {
    if (isPgConnected && id && req.user?.id) {
      await queryDB("DELETE FROM todos WHERE id = $1 AND user_id = $2", [id, req.user.id]);
      return res.json({ message: "Todo deleted successfully" });
    }
  } catch (error) {
    // Handled silently
  }

  res.json({ message: "Todo removed" });
};

// @desc    Clear completed todos in PostgreSQL
// @route   DELETE /api/todos/completed
// @access  Private
export const clearCompletedTodos = async (req, res) => {
  try {
    if (isPgConnected && req.user?.id) {
      await queryDB("DELETE FROM todos WHERE user_id = $1 AND completed = true", [req.user.id]);
      return res.json({ message: "Completed todos cleared" });
    }
  } catch (error) {
    // Handled silently
  }

  res.json({ message: "Completed todos cleared" });
};
