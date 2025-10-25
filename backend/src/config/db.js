import {neon} from '@neondatabase/serverless'

import 'dotenv/config'

export const sql = neon(process.env.DB_URL);

export async function initDB() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS transactions(
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        category VARCHAR(255) NOT NULL,
        CREATED_AT DATE NOT NULL DEFAULT CURRENT_DATE     
      );
    `;
    //DECIMAL(10,2) = 8 digits + 2 decimals

    await sql`
      CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `

    console.log("Database initialised successfully");
  } catch (e) {
    console.log("Failed to initialise database", e);
    process.exit(1);
  }
}