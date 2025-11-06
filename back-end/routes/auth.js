import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db.js"; // الاتصال بقاعدة البيانات
import dotenv from "dotenv";
import authMiddleware from "../middleware/authMiddleware.js";
dotenv.config();
const router = express.Router();
//////////

/////////
router.post("/register", async (req, res) => {
  let { name, email, password } = req.body;
  email = email.toLowerCase()
  name = name.toLowerCase();
  try {
    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "البريد الإلكتروني مستخدم بالفعل" }); //<= here we should to add toast message in front-end // also validation in front-end
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: "تم التسجيل بنجاح", user: result.rows[0] });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});
/////////////////

////////////////
router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  email = email.toLowerCase();
  console.log(email,password);
  try {
    let byemailResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    let user = byemailResult.rows[0];
    if (!user) {
      const byusernameResult = await pool.query("SELECT * FROM users WHERE name = $1", [email]);
      user = byusernameResult.rows[0];

    if (!user) {
        return res.status(401).json({ message: "Invalid username or password." });
      }
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    
    res.cookie("jwt", token, {
      httpOnly: true,//to prevent XSS attacks
      secure: false,//in production change to true
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, //one week
    });
    res.json({
      message: "تم تسجيل الدخول بنجاح",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error( err);
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});
router.post("/logout", (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
  console.log("User logged out, cookie cleared.");
  res.json({ message: "Logged out successfully" });
});

///////////////

//////////////
router.get("/profile", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ message: "ممنوع الدخول - لا يوجد توكن" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await pool.query("SELECT id, name, email FROM users WHERE id=$1", [decoded.id]);
    res.json(user.rows[0]);
  } catch {
    res.status(401).json({ message: "التوكن غير صالح" });
  }
});
router.get("/me", authMiddleware, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});



export default router;
