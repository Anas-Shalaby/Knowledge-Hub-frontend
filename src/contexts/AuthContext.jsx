import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider(props) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Comprehensive logging
  useEffect(() => {
    console.log('AuthProvider props:', props);
    console.log('Children type:', typeof props.children);
    console.log('Children:', props.children);

    // Detailed error logging
    if (!props.children) {
      console.error('No children passed to AuthProvider');
      console.trace('Children trace');
    }
  }, [props.children]);

  useEffect(() => {
    // Check for user in localStorage on initial load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // Set default Authorization header for all axios requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
      } catch (error) {
        console.error('Error parsing stored user', error);
        localStorage.removeItem('user');
        setError(error);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const { data } = await axios.post('https://notes-app-ibkq.onrender.com/api/users/login', { 
        email, 
        password 
      });

      // Set user in state and localStorage
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      
      // Set Authorization header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

      toast.success('Login successful');
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      toast.error(errorMessage);
      setError(error);
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      if (!name || !email || !password) {
        throw new Error('Name, email, and password are required');
      }

      const { data } = await axios.post('https://notes-app-ibkq.onrender.com/api/users', { 
        name, 
        email, 
        password 
      });

      // Set user in state and localStorage
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      
      // Set Authorization header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

      toast.success('Registration successful');
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      toast.error(errorMessage);
      setError(error);
      throw error;
    }
  };

  const logout = () => {
    // Remove user from state and localStorage
    setUser(null);
    localStorage.removeItem('user');
    
    // Remove Authorization header
    delete axios.defaults.headers.common['Authorization'];

    toast.success('Logged out successfully');
  };

  // Render a loading spinner instead of null
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Minimal rendering with error handling
  try {
    // Validate children
    if (!props.children) {
      throw new Error('No children provided to AuthProvider');
    }

    return (
      <AuthContext.Provider value={{ 
        user, 
        login, 
        register, 
        logout, 
        error 
      }}>
        {props.children}
      </AuthContext.Provider>
    );
  } catch (error) {
    console.error('Error rendering AuthProvider:', error);
    setError(error);
    return null;
  }
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}