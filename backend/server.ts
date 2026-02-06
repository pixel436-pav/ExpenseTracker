import express, { Express, Request, Response } from 'express';
import { connectDb } from './config/db.js';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/auth.router.js';
import expenseRoutes from './routes/expenseRoutes.js';

dotenv.config();
connectDb();

const app: Express = express();
const PORT: number = parseInt(process.env.PORT || '5555', 10)

app.use(cors({
  origin: ' http://localhost:5173',
  credentials:true
}))

app.use(express.json());



app.use('/api/expenses', expenseRoutes)
app.use('/api/auth',router)

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Expense Tracker App',
            status: 'running'
   })
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`)
}
);