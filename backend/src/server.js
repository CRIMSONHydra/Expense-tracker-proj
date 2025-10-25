import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'

import { initDB } from './config/db.js';
import transactionRoutes from './routes/transactions.route.js';
import rateLimiter from './middlewares/rateLimiter.js';
import authRoutes from './routes/auth.route.js';

const __dirname = path.resolve();
const app = express();

//setup
dotenv.config();
app.use(cors());
app.use(rateLimiter)
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

app.use(express.static(path.join(__dirname, "web/dist")));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'web/dist/index.html'));
});

//Connect db and start server
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  })
})
