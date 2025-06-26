import express from "express";
import db from "../db/client.js";
import { requireUser } from "../middleware/auth.js";

const router = express.Router();

// POST /tasks - create a task
router.post("/", requireUser, async (req, res, next) => {
  const { title, done } = req.body;
  const userId = req.user.id;

  console.log("POST /tasks payload:", { title, done, userId });

  try {
    const {
      rows: [task],
    } = await db.query(
      `INSERT INTO tasks (user_id, title, done)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [userId, title, done ?? false]  // default false if undefined
    );
    console.log("Task inserted:", task);
    res.status(201).send(task);
  } catch (err) {
    console.error("Error inserting task:", err.message);
    next(err);
  }
});

// GET /tasks - get all tasks for user
router.get("/", requireUser, async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT * FROM tasks WHERE user_id = $1`,
      [req.user.id]
    );
    res.send(rows);
  } catch (err) {
    next(err);
  }
});

// PUT /tasks/:id - update a task
router.put("/:id", requireUser, async (req, res, next) => {
  const { title, done } = req.body;
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const {
      rows: [task],
    } = await db.query(
      `UPDATE tasks
       SET title = $1, done = $2
       WHERE id = $3 AND user_id = $4
       RETURNING *`,
      [title, done, id, userId]
    );
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.send(task);
  } catch (err) {
    next(err);
  }
});

// DELETE /tasks/:id - delete a task
router.delete("/:id", requireUser, async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const {
      rows: [task],
    } = await db.query(
      `DELETE FROM tasks
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [id, userId]
    );
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.send(task);
  } catch (err) {
    next(err);
  }
});

export default router;