import jwt from "jsonwebtoken";

function authMiddleware(req, res, next) {
  const token = req.cookies.jwt;
  if (!token) return res.status(401).json({ message: "غير مصرح بالدخول" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "un auth token" });
  }
}

export default authMiddleware;
