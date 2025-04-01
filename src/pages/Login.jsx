import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../store/slices/authSlice';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { login } from '../services/api';
import '../styles/global.css';

const Login = () => {
  console.log('Login component rendering');
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('Login component mounted');
    // Добавяме active клас след малко за да се покажат анимациите
    const container = document.querySelector('.auth-container');
    const box = document.querySelector('.auth-box');
    if (container && box) {
      setTimeout(() => {
        container.classList.add('active');
        box.classList.add('active');
      }, 100);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Първо влизаме в Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Взимаме токена веднага
      const idToken = await userCredential.user.getIdToken();
      localStorage.setItem('token', idToken);

      // След това правим заявка към сървъра
      const response = await login(formData.email, formData.password);
      
      // Обновяваме Redux store
      dispatch(loginUser(response));

      // Навигацията се прави накрая
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'An error occurred during login.';

      if (error.code) {
        switch (error.code) {
          case 'auth/invalid-credential':
            errorMessage = 'Invalid email or password.';
            break;
          case 'auth/user-not-found':
            errorMessage = 'No user found with this email.';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password.';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Too many failed attempts. Please try again later.';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Network error. Please check your connection.';
            break;
          default:
            errorMessage = error.message;
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
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
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="auth-links">
          <button type="button" onClick={() => navigate('/register')}>
            Don't have an account? Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login; 