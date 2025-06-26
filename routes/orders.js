import express from "express";
import db from "../db/client.js";
import { requireUser } from "../middleware/auth.js";

const router = express.Router();

// GET /orders - fetch user orders with book info and price
router.get("/", requireUser, async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT o.id, o.date, o.note, b.title AS book_title, b.image_url, b.price, ob.quantity
       FROM orders o
       JOIN order_books ob ON o.id = ob.order_id
       JOIN books b ON ob.book_id = b.id
       WHERE o.user_id = $1
       ORDER BY o.date DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// POST /orders - place an order with quantity
router.post("/", requireUser, async (req, res, next) => {
  const { date, note, bookId, quantity } = req.body;

  if (!date || !bookId || !quantity) {
    return res.status(400).json({ error: "Missing date, bookId, or quantity" });
  }

  try {
    const {
      rows: [order],
    } = await db.query(
      `INSERT INTO orders (user_id, date, note)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [req.user.id, date, note]
    );

    await db.query(
      `INSERT INTO order_books (order_id, book_id, quantity)
       VALUES ($1, $2, $3)`,
      [order.id, bookId, quantity]
    );

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
});

// DELETE /orders/:id - cancel an order
router.delete("/:id", requireUser, async (req, res, next) => {
  const orderId = req.params.id;

  try {
    await db.query(`DELETE FROM order_books WHERE order_id = $1`, [orderId]);

    await db.query(`DELETE FROM orders WHERE id = $1 AND user_id = $2`, [
      orderId,
      req.user.id,
    ]);

    res.send({ message: "Order cancelled successfully" });
  } catch (err) {
    next(err);
  }
});

export default router;