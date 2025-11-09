import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import pool from "./db.js";
import authRoutes from "./routes/auth.js";
import cookieParser from "cookie-parser";
import authMiddleware from "./middleware/authMiddleware.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// ===============================
// 🔧 Middlewares
// ===============================
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.FRONTEND_URL, // رابط الـ Frontend بتاعك على Vercel أو Netlify
];

app.use(
  cors({
    origin: (origin, callback) => {
      // السماح بـ requests من Postman أو بدون origin
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ status: "✅ Server is running", environment: process.env.NODE_ENV });
});

// Auth routes
app.use("/api/auth", authRoutes);

// ===============================
// ✅ Unified Endpoint: Get all user data
// ===============================
app.get("/api/data/all", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    // 🗂️ Get all categories
    const categoriesResult = await pool.query(
      "SELECT * FROM categories WHERE user_id = $1",
      [userId]
    );

    // 📝 Get all notes with category name
    const notesResult = await pool.query(
      `SELECT notes.*, categories.name AS category_name
       FROM notes
       JOIN categories ON notes.category_id = categories.id
       WHERE notes.user_id = $1
       ORDER BY notes.created_at DESC`,
      [userId]
    );

    // 📦 Send combined response
    res.json({
      categories: categoriesResult.rows,
      notes: notesResult.rows,
    });
  } catch (err) {
    console.error("Error fetching all data:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// ===============================
// ✅ Add new category
// ===============================
app.post("/api/categories", authMiddleware, async (req, res) => {
  const { categoryName } = req.body;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      "INSERT INTO categories (name, user_id) VALUES ($1, $2) RETURNING *",
      [categoryName, userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding category:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// ===============================
// ✅ Add new note
// ===============================
app.post("/api/notes", authMiddleware, async (req, res) => {
  const { title, content, category } = req.body;
  const userId = req.user.id;

  try {
    const catResult = await pool.query(
      "SELECT id FROM categories WHERE name ILIKE $1 AND user_id = $2",
      [category, userId]
    );

    const categoryId = catResult.rows[0]?.id;
    if (!categoryId) {
      return res.status(400).json({ error: "Invalid or unauthorized category" });
    }

    const insertResult = await pool.query(
      "INSERT INTO notes (title, content, category_id, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, content, categoryId, userId]
    );

    res.status(201).json(insertResult.rows[0]);
  } catch (err) {
    console.error("Error adding note:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// ===============================
// ✅ Update note
// ===============================
app.put("/api/notes/:id", authMiddleware, async (req, res) => {
  const noteId = req.params.id;
  const { title, content, category_id } = req.body;
  const userId = req.user.id;

  try {
    const checkNote = await pool.query(
      "SELECT * FROM notes WHERE id = $1 AND user_id = $2",
      [noteId, userId]
    );

    if (checkNote.rows.length === 0) {
      return res.status(403).json({ error: "Not authorized or note not found" });
    }

    const result = await pool.query(
      `UPDATE notes 
       SET title = $1, 
           content = $2, 
           category_id = $3,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING *`,
      [title, content, category_id, noteId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating note:", err);
    res.status(500).json({ error: "Failed to update note" });
  }
});

// ===============================
// ✅ Delete note
// ===============================
app.delete("/api/notes/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const checkNote = await pool.query(
      "SELECT * FROM notes WHERE id = $1 AND user_id = $2",
      [id, userId]
    );

    if (checkNote.rows.length === 0) {
      return res.status(403).json({ error: "Not authorized or note not found" });
    }

    await pool.query("DELETE FROM notes WHERE id = $1", [id]);
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting note:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// ===============================
// ✅ Start server
// ===============================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
});