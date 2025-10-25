import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

import { initDB } from './config/db.js';
import transactionRoutes from './routes/transactions.route.js';
import rateLimiter from './middlewares/rateLimiter.js';
import authRoutes from './routes/auth.route.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

//setup
dotenv.config();
app.use(cors());
app.use(rateLimiter)
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

const frontendDistPath = path.join(__dirname, '../web/dist');
app.use(express.static(frontendDistPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

//Connect db and start server
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  })
})
