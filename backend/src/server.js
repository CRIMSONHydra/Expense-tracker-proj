import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import { initDB } from './config/db.js';
import transactionRoutes from './routes/transactions.route.js';
import rateLimiter from './middlewares/rateLimiter.js';


const app = express();

//setup
dotenv.config();
app.use(rateLimiter)
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.use('/api/transactions', transactionRoutes);

//Connect db and start server
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  })
})
