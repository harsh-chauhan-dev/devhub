import { queryDB, isPgConnected } from "../config/db.js";

// @desc    Get all user notes from PostgreSQL
// @route   GET /api/notes
// @access  Private
export const getNotes = async (req, res) => {
  try {
    if (isPgConnected && req.user?.id) {
      const result = await queryDB(
        "SELECT id, title, content, tag, created_at FROM notes WHERE user_id = $1 ORDER BY created_at DESC",
        [req.user.id]
      );
      return res.json(result.rows);
    }
  } catch (error) {
    // Handled silently
  }

  res.json([]);
};

// @desc    Create a note in PostgreSQL
// @route   POST /api/notes
// @access  Private
export const createNote = async (req, res) => {
  const { title, content, tag } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and Content are required" });
  }

  try {
    if (isPgConnected && req.user?.id) {
      const result = await queryDB(
        `INSERT INTO notes (user_id, title, content, tag)
         VALUES ($1, $2, $3, $4)
         RETURNING id, title, content, tag, created_at`,
        [req.user.id, title, content, tag || "General"]
      );

      const createdNote = result.rows[0];
      return res.status(201).json(createdNote);
    }
  } catch (error) {
    return res.status(500).json({ message: "Failed to save note in PostgreSQL" });
  }

  res.status(500).json({ message: "Database connection unavailable" });
};

// @desc    Update a note in PostgreSQL
// @route   PUT /api/notes/:id
// @access  Private
export const updateNote = async (req, res) => {
  const { id } = req.params;
  const { title, content, tag } = req.body;

  try {
    if (isPgConnected && id && req.user?.id) {
      const result = await queryDB(
        `UPDATE notes
         SET title = COALESCE($1, title),
             content = COALESCE($2, content),
             tag = COALESCE($3, tag)
         WHERE id = $4 AND user_id = $5
         RETURNING id, title, content, tag, created_at`,
        [title, content, tag, id, req.user.id]
      );
      if (result.rows.length > 0) {
        return res.json(result.rows[0]);
      }
    }
  } catch (error) {
    // Handled silently
  }

  res.json({ message: "Note updated" });
};

// @desc    Delete a note in PostgreSQL
// @route   DELETE /api/notes/:id
// @access  Private
export const deleteNote = async (req, res) => {
  const { id } = req.params;

  try {
    if (isPgConnected && id && req.user?.id) {
      await queryDB("DELETE FROM notes WHERE id = $1 AND user_id = $2", [id, req.user.id]);
      return res.json({ message: "Note deleted successfully" });
    }
  } catch (error) {
    // Handled silently
  }

  res.json({ message: "Note removed" });
};
