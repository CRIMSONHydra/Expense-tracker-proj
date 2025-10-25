import { sql } from "../config/db.js";

/*
GET /api/transactions/
fetches all transactions for the LOGGED IN user
*/
export async function getTransactions(req, res) {
  try {
    // Get userId from the auth middleware, not from params
    const userId = req.user.id; 

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
creates a transaction for the LOGGED IN user
{
  title: "groceries"
  category: "expense"
  amount: -2000
}
*/
export async function createTransaction(req, res) {
  try {
    const { title, amount, category } = req.body;
    
    // Get userId from the auth middleware
    const user_id = req.user.id;

    if (!title || !category || amount === undefined)
      return res.status(400).json({ message: "Bad request" });

    const transaction = await sql`
      INSERT INTO transactions(user_id, title, amount, category)
      VALUES(${user_id}, ${title}, ${amount}, ${category})
      RETURNING *;
    `;

    res.status(201).json(transaction[0]);
  } catch (e) {
    console.log("Error creating transaction", e);
    res.status(500).send();
  }
}

/*
DELETE /api/transactions/:id
Deletes the transaction with given id, only if it belongs to the logged in user
*/
export async function deleteById(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Get userId from auth middleware

    if (isNaN(parseInt(id)))
      return res.status(400).json({ message: "Invalid id" });

    const deletedTransaction = await sql`
      DELETE FROM transactions
      WHERE
        id = ${id} AND
        user_id = ${userId} -- This ensures user can only delete their own
      RETURNING *;
    `;

    if (deletedTransaction.length === 0)
      return res.status(404).json({ message: "id not found or not authorized" });

    res.status(200).json({ message: "transaction deleted successfully" });
  } catch (e) {
    console.log("Error deleting transaction", e);
    res.status(500).send();
  }
}

/*
GET /api/transactions/summary
returns balance, income and expenses aggregated for the LOGGED IN user
*/
export async function getSummary(req, res) {
  try {
    // Get userId from the auth middleware
    const userId = req.user.id; 

    const balanceRes = await sql`
      SELECT
        COALESCE(SUM(amount), 0) AS balance
      FROM transactions
      WHERE
        user_id = ${userId};
    `;

    const incomeRes = await sql`
      SELECT
        COALESCE(SUM(amount), 0) AS income
      FROM transactions
      WHERE
        user_id = ${userId} AND
        amount > 0;
    `;

    const expensesRes = await sql`
      SELECT
        (COALESCE(SUM(amount), 0)*-1) AS expenses
      FROM transactions
      WHERE
        user_id = ${userId} AND
        amount < 0;
    `;

    res.status(200).json({
      balance: balanceRes[0].balance,
      income: incomeRes[0].income,
      expenses: expensesRes[0].expenses
    });
  } catch (e) {
    console.log("Error getting the summary", e);
    res.status(500).send();
  }
}