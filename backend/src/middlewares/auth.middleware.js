import jwt from "jsonwebtoken";

export function protect(req, res, next) {
  let token;
  const authHeader = req.headers.authorization;

  // Check for token in Authorization header
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      // Get token from header (e.g., "Bearer <token>")
      token = authHeader.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to the request object
      // We don't attach the password
      req.user = decoded; 

      next();
    } catch (e) {
      console.log("Token verification failed", e);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
}