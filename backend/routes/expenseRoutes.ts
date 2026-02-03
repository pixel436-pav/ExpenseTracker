import express from 'express'
import { getExpense, getExpenseById, createExpense, updateExpense, deleteExpense } from '../controllers/expenseController.ts'
 

const router = express.Router();

router.get('/',getExpense);
router.get('/:id',getExpenseById);
router.post('/',createExpense);
router.put('/',updateExpense);
router.delete('/',deleteExpense);

export default router