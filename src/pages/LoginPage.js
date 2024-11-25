import React, { useState } from 'react';
import axios from 'axios';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Clear previous error message
    try {
      const response = await axios.post('https://api.example.com/login', {
        username,
        password,
      })      
      console.log({response})
      ;
      console.log({response})
      const token = response.data.token;
      console.log('Login Successful. Token:', token);
      localStorage.setItem('authToken', token);
      setLoading(false);
      // Redirect to another page or update state
    } catch (error) {
      console.log("HI")
      console.error('Login failed:', error.message);
      setLoading(false);
      setError(error.response?.data?.message || 'Login failed'); // Set the error message
    }
  };

  return (
    <div className="login-container">
      <h1>Login to Your Account</h1>
      <form onSubmit={handleLogin}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default LoginPage;
