import { sql } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/*
POST /api/auth/register
{ username: "test", password: "123" }
*/
export async function register(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if user already exists
    const existingUser = await sql`
      SELECT * FROM users WHERE username = ${username}
    `;
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save new user
    const newUser = await sql`
      INSERT INTO users (username, password)
      VALUES (${username}, ${hashedPassword})
      RETURNING id, username;
    `;

    res.status(201).json({
      message: "User registered successfully",
      user: newUser[0],
    });
  } catch (e) {
    console.log("Error registering user", e);
    res.status(500).send();
  }
}

/*
POST /api/auth/login
{ username: "test", password: "123" }
*/
export async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Find user
    const user = await sql`
      SELECT * FROM users WHERE username = ${username}
    `;
    if (user.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create JWT
    const payload = {
      id: user[0].id,
      username: user[0].username,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(200).json({ token });
  } catch (e) {
    console.log("Error logging in", e);
    res.status(500).send();
  }
}