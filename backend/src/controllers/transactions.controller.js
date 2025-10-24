import { sql } from "../config/db.js";

/*
GET /api/transactions/:userId
fetches all transactions matching userId
*/
export async function getTransactionsById(req, res) {
  try {
    const {userId} = req.params;

    const transactions = await sql`
      SELECT *
      FROM transactions
      WHERE
        user_id = ${userId}
      ORDER BY
        created_at DESC;
    `;

    res.status(200).json(transactions);
  } catch (e) {
    console.log("Error fetching transactions", e);
    res.status(500).send();
  }
}

/*
POST /api/transactions/
creates a transaction
{
  user_id: "123"
  title: "groceries"
  category: "expense"
  amount: -2000
}
*/
export async function createTransaction(req, res) {
  try {
    const {title, amount, category, user_id} = req.body;

    if(!title || !category || !user_id || amount === undefined)
      return res.status(400).json({message: "Bad request"});

    const transaction = await sql`
      INSERT INTO transactions(user_id, title, amount, category)
      VALUES(${user_id}, ${title}, ${amount}, ${category})
      RETURNING *
    `

    res.status(201).json(transaction[0])
  } catch (e) {
    console.log("Error creating transaction", e);
    res.status(500).send();
  }
}