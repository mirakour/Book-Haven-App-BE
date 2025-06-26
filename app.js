import express from "express";
import cors from "cors";
import usersRouter from "./routes/users.js";
import booksRouter from "./routes/books.js";
import ordersRouter from "./routes/orders.js";
import tasksRouter from "./routes/tasks.js";

const app = express();

app.use(cors()); 
app.use(express.json());

app.use("/users", usersRouter);
app.use("/books", booksRouter);
app.use("/orders", ordersRouter);
app.use("/tasks", tasksRouter);

app.use((err, req, res, next) => {
  console.error("ERROR:", err);
  res.status(500).json({ error: err.message, details: err });
});

export default app;