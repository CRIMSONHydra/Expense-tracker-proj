import express from "express";

import { createTransaction, getTransactionsById } from "../controllers/transactions.controller.js";

const router = express.Router();

router.get('/:userId', getTransactionsById);
router.post('/', createTransaction);

export default router;