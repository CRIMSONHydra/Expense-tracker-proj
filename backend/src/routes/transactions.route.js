import express from "express";

import {
  createTransaction,
  getTransactionsById,
  deleteById,
  getSummaryById
} from "../controllers/transactions.controller.js";

const router = express.Router();

router.get('/:userId', getTransactionsById);
router.post('/', createTransaction);
router.delete('/:id', deleteById);
router.get('/summary/:userId', getSummaryById);

export default router;