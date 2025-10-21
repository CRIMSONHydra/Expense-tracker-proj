import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { sql, initDB } from './config/db.js';

const app = express();

//setup
app.use(express.json());
dotenv.config();

const PORT = process.env.PORT || 3001;

//Connect db and start server
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  })
})
