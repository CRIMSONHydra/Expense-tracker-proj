import { Router } from "express";
import {
  getTransactions,
  createTransaction,
  deleteById,
  getSummary,
} from "../controllers/transactions.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

// Add the 'protect' middleware to all transaction routes
// These routes will now require a valid JWT (Bearer Token)

// GET /api/transactions/
router.get("/", protect, getTransactions);

// POST /api/transactions/
router.post("/", protect, createTransaction);

// GET /api/transactions/summary
router.get("/summary", protect, getSummary);

// DELETE /api/transactions/:id
router.delete("/:id", protect, deleteById);

export default router;