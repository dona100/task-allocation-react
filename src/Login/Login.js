import React, { useState } from 'react';
import './Login.css'
import Dashboard from '../Dashboard/Dashboard';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://127.0.0.1:8000/jwt/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.access); // Store access token
        localStorage.setItem('refreshToken', data.refresh); // Store refresh token
        setIsLoggedIn(true);
        
        
      } else {
        // Handle unsuccessful login
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  return (
    <div>
      {isLoggedIn ? (<Dashboard/>):
      (<div className='login-container'>
<div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      </div>
      </div>)
      

  }
    </div>
  );
};

export default Login;
