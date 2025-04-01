import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, logoutUser } from './store/slices/authSlice';
import { auth } from './config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getCurrentUser } from './services/api';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Products from './pages/Products';
import Footer from './components/Footer';
import PublicOnlyRoute from './components/PublicOnlyRoute';
import PrivateRoute from './components/PrivateRoute';
import './styles/global.css';

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const idToken = await firebaseUser.getIdToken();
          localStorage.setItem('token', idToken);
          
          try {
            const userData = await getCurrentUser();
            if (userData) {
              dispatch(loginUser(userData));
              localStorage.setItem('authState', JSON.stringify({
                user: userData,
                isAuthenticated: true
              }));
            }
          } catch (error) {
            console.error('Error getting user data:', error);
            // Ако сървърът не е достъпен, използваме Firebase данните
            const firebaseUserData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName
            };
            dispatch(loginUser(firebaseUserData));
            localStorage.setItem('authState', JSON.stringify({
              user: firebaseUserData,
              isAuthenticated: true
            }));
          }
        } else {
          dispatch(logoutUser());
          localStorage.removeItem('token');
          localStorage.removeItem('authState');
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        dispatch(logoutUser());
        localStorage.removeItem('token');
        localStorage.removeItem('authState');
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router future={{ v7_relativeSplatPath: true }}>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            
            {/* Public routes */}
            <Route 
              path="/login" 
              element={
                <PublicOnlyRoute>
                  <Login />
                </PublicOnlyRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicOnlyRoute>
                  <Register />
                </PublicOnlyRoute>
              } 
            />
            
            {/* Protected routes */}
            <Route 
              path="/profile" 
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/cart" 
              element={
                <PrivateRoute>
                  <Cart />
                </PrivateRoute>
              } 
            />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;