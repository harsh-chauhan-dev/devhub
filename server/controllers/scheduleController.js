import { queryDB } from "../config/db.js";
import { sendScheduleCreatedEmail } from "../services/mailService.js";

// @desc    Get all user schedules from PostgreSQL
// @route   GET /api/schedules
// @access  Private
export const getSchedules = async (req, res) => {
  try {
    if (req.user?.id) {
      const result = await queryDB(
        "SELECT id, title, description, scheduled_date, status, notify_email, created_at FROM schedules WHERE user_id = $1 ORDER BY scheduled_date ASC",
        [req.user.id]
      );
      return res.json(result.rows);
    }
  } catch (error) {
    // Handled silently
  }

  res.json([]);
};

// @desc    Create a schedule in PostgreSQL, add in-app notification & dispatch email
// @route   POST /api/schedules
// @access  Private
export const createSchedule = async (req, res) => {
  const { title, description, scheduledDate, notifyEmail } = req.body;

  if (!title || !scheduledDate) {
    return res.status(400).json({ message: "Title and Scheduled Date & Time are required" });
  }

  try {
    if (req.user?.id) {
      const result = await queryDB(
        `INSERT INTO schedules (user_id, title, description, scheduled_date, notify_email)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, title, description, scheduled_date, status, notify_email, created_at`,
        [req.user.id, title, description || "", new Date(scheduledDate), notifyEmail !== false]
      );

      const createdSchedule = result.rows[0];

      const formattedDate = new Date(scheduledDate).toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      // Dispatch Email via Nodemailer ONLY on schedule creation if notify_email is true
      if (notifyEmail !== false && req.user.email) {
        sendScheduleCreatedEmail({
          to: req.user.email,
          name: req.user.name,
          title,
          scheduledDate: formattedDate,
          description,
          actionUrl: "http://localhost:5173/schedules",
        }).catch(() => {});
      }

      return res.status(201).json(createdSchedule);
    }
  } catch (error) {
    return res.status(500).json({ message: "Failed to create schedule in PostgreSQL database" });
  }

  res.status(401).json({ message: "User not authenticated" });
};

// @desc    Update a schedule in PostgreSQL
// @route   PUT /api/schedules/:id
// @access  Private
export const updateSchedule = async (req, res) => {
  const { id } = req.params;
  const { title, description, scheduledDate, status, notifyEmail } = req.body;

  try {
    if (id && req.user?.id) {
      const result = await queryDB(
        `UPDATE schedules
         SET title = COALESCE($1, title),
             description = COALESCE($2, description),
             scheduled_date = COALESCE($3, scheduled_date),
             status = COALESCE($4, status),
             notify_email = COALESCE($5, notify_email)
         WHERE id = $6 AND user_id = $7
         RETURNING id, title, description, scheduled_date, status, notify_email, created_at`,
        [
          title,
          description,
          scheduledDate ? new Date(scheduledDate) : null,
          status,
          notifyEmail,
          id,
          req.user.id,
        ]
      );

      if (result.rows.length > 0) {
        return res.json(result.rows[0]);
      }
    }
  } catch (error) {
    // Handled silently
  }

  res.json({ message: "Schedule updated" });
};

// @desc    Delete a schedule in PostgreSQL
// @route   DELETE /api/schedules/:id
// @access  Private
export const deleteSchedule = async (req, res) => {
  const { id } = req.params;

  try {
    if (id && req.user?.id) {
      await queryDB("DELETE FROM schedules WHERE id = $1 AND user_id = $2", [id, req.user.id]);
      return res.json({ message: "Schedule deleted successfully" });
    }
  } catch (error) {
    // Handled silently
  }

  res.json({ message: "Schedule removed" });
};
