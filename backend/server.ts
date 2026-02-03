import express, { Express, Request, Response } from 'express';
import { connectDb } from './config/db.js'
import dotenv from 'dotenv'
import expenseRoutes from './routes/expenseRoutes.js'

dotenv.config();
connectDb();

const app: Express = express();
const PORT: number = parseInt(process.env.PORT || '5555', 10)

app.use(express.json());

app.use('/api/expenses', expenseRoutes)

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Expense Tracker App' })
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`)
}
)