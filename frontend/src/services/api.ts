import axios from 'axios'


// BASE_URL for all API ENDPOINTS
const APU_URL = 'http://localhost:5555/api';

// Create axios instance - a pre-configured axios with default settings

const api = axios.create({
    baseURL:APU_URL,
    headers:{
        'Content-Type':'application/json'
    },
})
//INTERCEPTOR CONCEPT:
// Think of it as a "middleware" for HTTP requests
// Every request passes through here BEFORE going to the backend
//
// Without interceptor:
//   api.get('/expenses', { headers: { Authorization: 'Bearer token' }})
//   api.post('/expenses', data, { headers: { Authorization: 'Bearer token' }})
//   // You'd repeat this everywhere!
//
// With interceptor:
//   api.get('/expenses')  // Token automatically added!
//   api.post('/expenses', data)  // Token automatically added!


api.interceptors.request.use((config) => {
  // Get token from browser storage
  const token = localStorage.getItem('token');
  // If token exists , add it to request headers
  if (token){
    config.headers.Authorization = `Bearer ${token}`
  }
  return config;
}
);

// Auth Services - handles user authentication 

export const authService = {
    // Register a new User

    register: async (name:string,email:string,password:string) => {

        const response = await api.post('/auth/register',{name, email, password});

        // store token in localStorage (browser storage)
        if(response.data.token){
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
      
    },
    // login existing user
    login: async (email:string,password:string
    ) => {
        const response = await api.post('/auth/login',{email,password});
        // store token for future requests
        if(response.data.token){
            localStorage.setItem('token',response.data.token)
        }
      return response.data;
    },

    // logout user 
    logout:  () => {
      localStorage.removeItem('token');
    },
    // check if the user has token (is logged in )

    getToken: () =>{
        return localStorage.getItem('token');
    },
};

// Expense Services - handles expense CRUD operations 

export const expenseService = {
    // Get all expense for loggedin user
    getAll: async()=> {
        const response = await api.get('/expenses');

        return response.data;
    },
    // Get single expense by ID
    getById:async (id:string)=>{
        const response = await api.get(`/expenses/${id}`);
        return response.data;
    },
    // create new expense 
    create : async (expense:{
        title: string; 
    amount: number; 
    category: string; 
    date?: string;
    }) =>{
        const response = await api.post('/expenses',expense);
        return response.data
    },
    // Update exisitng expense
    update: async (id:string, expense:{
        title: string; 
    amount: number; 
    category: string; 
    date?: string;
    }) => {
      const response = await api.put(`/expenses/${id}`,expense);
      return response.data
    },
    // Delete expense
    delete: async(id: string)=>{
        const response = await api.delete(`/expenses/${id}`);
        return response.data;
    },
    
};

export default api;



