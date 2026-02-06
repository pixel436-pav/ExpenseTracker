import { useState, useEffect } from 'react';
import { expenseService, authService } from '../services/api';

interface Expense {
    _id : string;
    user: string;  // Refrence User._id
    title: string;
    amount : number;
    category : string;
    date: string;
}

export default function Dashboard() {
  // STATE - data that changes
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],  // Today's date
  });

  // ⭐ useEffect CONCEPT:
  // Runs code AFTER component renders
  // Like componentDidMount in class components
  
  useEffect(() => {
    fetchExpenses();
  }, []);  // Empty array [] = run only once when component mounts
  
  // HOW useEffect WORKS:
  // useEffect(effect, dependencies)
  //
  // [] = run once on mount
  // [count] = run when count changes
  // No array = run after every render (usually bad!)
  //
  // LIFECYCLE:
  // 1. Component renders
  // 2. useEffect runs
  // 3. State changes
  // 4. Component re-renders
  // 5. useEffect checks dependencies
  // 6. If dependencies changed, run again

  const fetchExpenses = async () => {
    try {
      const data = await expenseService.getAll();
      setExpenses(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await expenseService.create({
        title: formData.title,
        amount: parseFloat(formData.amount),  // Convert string to number
        category: formData.category,
        date: formData.date,
      });
      
      // Reset form to initial state
      setFormData({ 
        title: '', 
        amount: '', 
        category: 'Food', 
        date: new Date().toISOString().split('T')[0] 
      });
      
      setShowForm(false);
      fetchExpenses();  // Refresh the list
      
    } catch (error) {
      console.error('Error creating expense:', error);
    }
  };

  const handleDelete = async (id: string) => {
    // Confirm before deleting
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await expenseService.delete(id);
        fetchExpenses();  // Refresh the list
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  const handleLogout = () => {
    authService.logout();
    window.location.reload();  // Refresh page
  };

  // ⭐ ARRAY METHODS:
  
  // reduce - accumulate values
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  // How it works:
  // sum starts at 0
  // Loop: sum = 0 + 100 = 100
  // Loop: sum = 100 + 200 = 300
  // Loop: sum = 300 + 50 = 350
  // Result: 350

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div className="dashboard-header">
        <h1>💰 Expense Tracker</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      {/* Summary Section */}
      <div className="summary-section">
        <h2>Total Expenses: ₹{totalAmount.toFixed(2)}</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="add-btn"
        >
          {showForm ? 'Cancel' : '+ Add Expense'}
        </button>
      </div>

      {/* Add Expense Form - conditionally rendered */}
      {showForm && (
        <form onSubmit={handleSubmit} className="expense-form">
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="form-input"
          />
          
          {/* SPREAD OPERATOR EXPLAINED:
              setFormData({ ...formData, title: e.target.value })
              
              Before: formData = { title: '', amount: '100', category: 'Food' }
              ...formData copies all properties
              Then we overwrite just title
              After: formData = { title: 'New', amount: '100', category: 'Food' }
          */}
          
          <input
            type="number"
            placeholder="Amount"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
            min="0"
            step="0.01"
            className="form-input"
          />
          
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="form-input"
          >
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Shopping">Shopping</option>
            <option value="Bills">Bills</option>
            <option value="Others">Others</option>
          </select>
          
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="form-input"
          />
          
          <button type="submit" className="submit-btn">
            Add Expense
          </button>
        </form>
      )}

      {/* Expense List */}
      <div className="expense-list">
        {expenses.length === 0 ? (
          <p className="no-expenses">No expenses yet. Add your first expense!</p>
        ) : (
          // ⭐ MAP CONCEPT:
          // Loop through array and return JSX for each item
          expenses.map((expense) => (
            // KEY PROP: Helps React identify which items changed
            // Must be unique for each item
            <div key={expense._id} className="expense-card">
              <div className="expense-info">
                <h3>{expense.title}</h3>
                <p className="expense-category">{expense.category}</p>
                <p className="expense-date">
                  {new Date(expense.date).toLocaleDateString()}
                </p>
              </div>
              
              <div className="expense-actions">
                <span className="expense-amount">
                  ₹{expense.amount.toFixed(2)}
                </span>
                <button 
                  onClick={() => handleDelete(expense._id)}
                  className="delete-btn"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}