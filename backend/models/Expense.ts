import mongoose, { Document, Schema } from 'mongoose';
// DOCUMENT  is the base class for all the mongoose enteries it contains all the mongoose function 
import { isNumberObject } from 'node:util/types';

export interface IExpense extends Document {  // By extending Document, your IExpense interface inherits a long list of built-in Mongoose properties and methods. Without this, TypeScript would throw an error every time you tried to use standard Mongoose functions on your data.

    // by using these words i give my interface a name of Expense where the I stands for Interface and extends Document means the including the properties written below it will also have access to _id __v and .save() , and other mongoose document properties 
    title: String,
    amount:number,
    category : string,
    date: Date
}
const ExpenseSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    amount :{
        type: Number,
        required: true
    },
    category:{
        tyep:String,
        required:true,
        enum:['Food' ,'Travel','Shopping','Bills','Others']

    },
    date:{
        type:Date,
        default: Date.now
    }
});

export default mongoose.model<IExpense>('Expense',ExpenseSchema);