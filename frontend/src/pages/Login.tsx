import { useState } from "react";
import { authService } from "../services/api";

interface LoginProps {
    onLogin: () => void; // Funtion that parent provides
}

export default function Login({ onLogin }: LoginProps) {
    // State = data that changes and triggers re-render
    // when state changes react automatically updates UI

    const [isRegister, setIsRegister] = useState(false); // useState is set to false for isRegister variable

    // setIsRegister is the funtion to update value
    // useState(false): means initial value is false

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // How State Works :- 
    // User types input -> onChange fires -> setEmail('new value)
    // -> React sees state changes -> re-renders component -> UI updates

    const handleSubmit = async (e: React.FormEvent) => {
        // Prevent deafault form behaviour (page refresh)
        e.preventDefault();

        // clear any previous errors
        setError('');
        // show loading indicator
        setLoading(true);
        try {
               if (isRegister) {
        // Call register API
        await authService.register(name, email, password);
      } else {
        // Call login API
        await authService.login(email, password);
      }
      onLogin();
            onLogin()
        } catch (err: any) {
  // Handle errors
      const errorMessage = err.response?.data?.message || 'Something went wrong';
      setError(errorMessage);
        } finally{
            // always hide loading weather success or error 
            setLoading(false)
        }
    };
    return (
        <div className="login-container">
            <div className="login-box">
                <h1>{isRegister? 'Register' : 'Login'}</h1>
                {/* only show error div if error exists */}
                {error && ( <div className="error-message">{error}</div> )}
                <form onSubmit={handleSubmit} className="login-form">
                    {isRegister && ( <input type="text" placeholder="Name" value={name} onChange={(e)=> setName(e.target.value)} required className="form-input"  /> ) 
             
          }
                 
            <input type ="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"/>

            <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="form-input"
          />
           
          <button 
            type="submit" 
            disabled={loading}
            className="submit-button"
          >{loading ? 'Loading...' : isRegister ? 'Register' : 'login'}</button>


                

                </form>

                 <p className="toggle-text">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span 
            onClick={() => setIsRegister(!isRegister)}
            className="toggle-link"
          >
            {isRegister ? 'Login' : 'Register'}
          </span>
        </p>
            </div>
        </div>
    )


}