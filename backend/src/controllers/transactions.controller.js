import { sql } from "../config/db.js";

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