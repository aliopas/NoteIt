import axios from "axios";
import dotenv from "dotenv";
dotenv.config(); 
// ✅ استخدام environment variable
export const API_BASE_URL = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ===============================
// Unified Data API
// ===============================

/**
 * جلب كل بيانات المستخدم (الفئات + النوتس + بيانات المستخدم)
 */
export const getAllUserData = async () => {
  console.log("Fetching all user data...");
  try {
    const res = await API_BASE_URL.get("/api/data/all");
    return res.data;
  } catch (err) {
    console.error("Error fetching all user data:", err);
    throw err;
  }
};

// ===============================
// Categories API (عمليات CRUD)
// ===============================

/**
 * جلب كل الـ Categories
 */
export const getAllCategories = async () => {
  try {
    const res = await API_BASE_URL.get("/api/data/all");
    return res.data.categories;
  } catch (err) {
    console.error("Error fetching categories:", err);
    throw err;
  }
};

export const createCategory = async (categoryName) => {
  try {
    const res = await API_BASE_URL.post("/api/categories", { categoryName });
    return res.data;
  } catch (err) {
    console.error("Error creating category:", err);
    throw err;
  }
};

// ===============================
// Notes API (عمليات CRUD)
// ===============================

/**
 * جلب النوتس حسب الـ Category
 */
export const getNotesByCategory = async (categoryName) => {
  try {
    const res = await API_BASE_URL.get("/api/data/all");
    const allNotes = res.data.notes;
    
    // فلترة النوتس حسب اسم الـ category
    return allNotes.filter(
      (note) => note.category_name?.toLowerCase() === categoryName?.toLowerCase()
    );
  } catch (err) {
    console.error("Error fetching notes by category:", err);
    throw err;
  }
};

export const createNote = async (noteData) => {
  try {
    const res = await API_BASE_URL.post("/api/notes", noteData);
    return res.data;
  } catch (err) {
    console.error("Error creating note:", err);
    throw err;
  }
};

export const updateNote = async (noteId, noteData) => {
  try {
    const res = await API_BASE_URL.put(`/api/notes/${noteId}`, {
      title: noteData.title,
      content: noteData.content,
      category_id: noteData.category_id,
    });
    return res.data;
  } catch (err) {
    console.error("Error updating note:", err);
    throw err;
  }
};

export const deleteNote = async (noteId) => {
  try {
    const res = await API_BASE_URL.delete(`/api/notes/${noteId}`);
    return res.data;
  } catch (err) {
    console.error("Error deleting note:", err);
    throw err;
  }
};

// ===============================
// Auth API
// ===============================

export const registerUser = async (userData) => {
  try {
    const res = await API_BASE_URL.post("/api/auth/register", userData);
    return res.data;
  } catch (err) {
    console.error("Error registering user:", err);
    throw err;
  }
};

export const loginUser = async (credentials) => {
  try {
    const res = await API_BASE_URL.post("/api/auth/login", credentials);
    return res.data;
  } catch (err) {
    console.error("Error logging in user:", err);
    throw err;
  }
};

export const getCurrentUser = async () => {
  try {
    const res = await API_BASE_URL.get("/api/auth/me");
    return res.data.user;
  } catch (err) {
    console.error("Error fetching current user:", err);
    throw err;
  }
};

export const logoutUser = async () => {
  try {
    const res = await API_BASE_URL.post("/api/auth/logout");
    return res.data;
  } catch (err) {
    console.error("Error logging out:", err);
    throw err;
  }
};

// ✅ Interceptor للتعامل مع 401 Unauthorized
API_BASE_URL.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAuthPage = window.location.pathname.includes('/login') || 
                        window.location.pathname.includes('/register');
      if (!isAuthPage) {
        localStorage.removeItem('token');
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);