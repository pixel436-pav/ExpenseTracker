import express, {Express , Request, Response} from 'express';
import dotenv from 'dotenv'

dotenv.config();
 const app: Express = express();
 const PORT : number = parseInt(process.env.PORT|| '5555',10)

 app.use(express.json());

 app.get('/',(req:Request,res:Response) => {
  res.json({message: 'Expense Tracker App'}) 
 });

 app.listen(PORT,() => {
   console.log(`Server is running on PORT ${PORT}`)
 }
 )