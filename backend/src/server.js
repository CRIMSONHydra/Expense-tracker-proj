import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import { initDB } from './config/db.js';
import transactionRoutes from './routes/transactions.route.js';


const app = express();

//setup
app.use(express.json());
dotenv.config();

const PORT = process.env.PORT || 3001;

app.use('/api/transactions', transactionRoutes);

//Connect db and start server
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  })
})
