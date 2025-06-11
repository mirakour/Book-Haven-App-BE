import express from "express";
const app = express();

app.use(express.json());

// Add routers here later

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Something went wrong.");
});

export default app;