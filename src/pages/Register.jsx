import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../store/slices/authSlice';
import { auth } from '../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { register } from '../services/api';
import '../styles/global.css';

const Register = () => {
  console.log('Register component rendering');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('Register component mounted');
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const checkEmailExists = async (email) => {
    // Вашата логика за проверка на съществуващ имейл
    // Може да направите API повикване, за да проверите дали имейлът вече е регистриран
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Проверка за съществуващ имейл
    const emailExists = await checkEmailExists(formData.email);
    if (emailExists) {
      setError('Email is already registered.');
      return;
    }
    
    setLoading(true);

    try {
      console.log('Starting Firebase registration...');
      // Създаваме нов потребител в Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      console.log('Firebase registration successful:', userCredential.user);

      // Взимаме токена веднага
      console.log('Getting Firebase ID token...');
      const idToken = await userCredential.user.getIdToken();
      console.log('Firebase ID token received');
      localStorage.setItem('token', idToken);

      // След това регистрираме потребителя в нашия сървър
      console.log('Starting server registration...');
      const response = await register({
        email: formData.email,
        password: formData.password,
        displayName: formData.displayName
      });
      console.log('Server registration successful:', response);

      // Обновяваме Redux store
      console.log('Updating Redux store...');
      dispatch(loginUser(response));

      // Навигацията се прави накрая
      console.log('Registration completed, navigating to home...');
      navigate('/');
    } catch (error) {
      console.error('Registration error details:', error);
      let errorMessage = 'An error occurred during registration.';
      
      // Проверяваме за Firebase грешки
      if (error.code) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'Email is already registered.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Invalid email address.';
            break;
          case 'auth/operation-not-allowed':
            errorMessage = 'Email/password accounts are not enabled.';
            break;
          case 'auth/weak-password':
            errorMessage = 'Password is too weak.';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Network error. Please check your connection.';
            break;
          default:
            errorMessage = error.message;
        }
      }
      // Проверяваме за сървърни грешки
      else if (error.error) {
        errorMessage = error.error;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Register</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="displayName">Username</label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <div className="auth-links">
          <button type="button" onClick={() => navigate('/login')}>
            Already have an account? Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register; 