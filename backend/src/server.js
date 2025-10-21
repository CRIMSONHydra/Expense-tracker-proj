import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

const app = express();

app.use(express.json());
dotenv.config();

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
})