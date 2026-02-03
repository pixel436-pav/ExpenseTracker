import { Request, Response } from 'express'
import mongoose from 'mongoose'
import Expense from '../models/Expense.js'

//Get all expenses
export const getExpense = async (req: Request, res: Response) => {

    try {
        const expenses = await Expense.find().sort({ date: -1 }) // the .sort function will sort our expense by date , -1 means descending
        res.json(expenses)
    } catch (error) {
        res.status(500).json({message:'Server Error'})
    }

};
 // Get an expense by id 
export const getExpenseById = async (req:Request,res:Response) => {
    try {
        const expense = await Expense.findById(req.params.id)
       return !expense ? res.status(404).json({message:'Expense not found'}) : res.send(expense);
    } catch (error) {
        res.send(500).json({message:'Expense not found'})
    }
  
};

// new expense 
export const createExpense = async (req:Request,res:Response) => {
    try {
        const {title , amount , category, date } = req.body
        const expense = await Expense.create({title , amount , category, date})
        res.status(201).json(expense)
    } catch (error) {
        res.status(500).json({message:'Server Request'})
    }
  
}


// update existing expense

export const updateExpense = async (req:Request,res:Response) => {
    try {

        const expense = await Expense.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new:true,runValidators:true}
        );
        return !expense ? res.status(404).json({message:'Bad Request'}) : res.json(expense)
        
    } catch (error) {
        res.status(500).json({message:'Server Error'})
    }
}

// Delete the expense 

export const deleteExpense = async (req:Request,res:Response) => {
 
    try {
        const expense = await Expense.findByIdAndDelete(req.params.id);
        return !expense ? res.status(404).json({message:'Not Found'}) : res.json({message:'Expense Deleted'})
        
    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }
}
