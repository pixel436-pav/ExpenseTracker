import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dasboard.js'
import { authService } from './services/api.js';

// ⭐ APP COMPONENT:
// Root component - decides what to show based on auth state

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in when app loads
  useEffect(() => {
    const token = authService.getToken();
    setIsAuthenticated(!!token);  // !! converts to boolean
    setLoading(false);
  }, []);

  // !! OPERATOR EXPLAINED:
  // Converts any value to boolean
  // !!null = false
  // !!undefined = false
  // !!'hello' = true
  // !!0 = false
  // !!123 = true

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // THE FLOW:
  // 1. User opens app
  // 2. App component mounts
  // 3. useEffect runs
  // 4. Check localStorage for token
  // 5. If token exists → show Dashboard
  // 6. If no token → show Login

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {isAuthenticated ? (
        <Dashboard />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </>
  );
}

export default App;