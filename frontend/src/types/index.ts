// User interface - represents a user in the system 

export interface User {
    _id : string;
    name : string;
    email: string;
}

// Expense interface - represents a single expense

export interface Expense {
    _id : string;
    user: string;  // Refrence User._id
    title: string;
    amount : number;
    category : string;
    date: string;
}

// Auth response - what backend sends after login/register

export interface AuthResponse {
    _id: string;
    name: string;
    email:string;
    token:string; // --> JWT token
}

