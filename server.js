const express = require("express");
const { Pool } = require("");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Routes
app.get("/profile", async (req, res) => {
  const result = await pool.query("SELECT * FROM profile LIMIT 1");
  res.json(result.rows);
});

app.get("/skills", async (req, res) => {
  const result = await pool.query("SELECT * FROM skills");
  res.json(result.rows);
});

app.get("/education", async (req, res) => {
  const result = await pool.query("SELECT * FROM education");
  res.json(result.rows);
});

app.get("/experience", async (req, res) => {
  const result = await pool.query("SELECT * FROM experience");
  res.json(result.rows);
});

app.get("/courses", async (req, res) => {
  const result = await pool.query("SELECT * FROM courses");
  res.json(result.rows);
});

app.get("/interest", async (req, res) => {
  const result = await pool.query("SELECT * FROM interest");
  res.json(result.rows);
});

app.get("/work", async (req, res) => {
  const result = await pool.query("SELECT * FROM work");
  res.json(result.rows);
});

app.post("/contact", async (req, res) => {
  const { Name, email, message } = req.body;

  await pool.query(
    "INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3)",
    [Name, email, message]
  );

  res.send("Message saved successfully");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
