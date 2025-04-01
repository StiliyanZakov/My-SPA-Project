import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  console.log('PrivateRoute - isAuthenticated:', isAuthenticated);

  if (!isAuthenticated) {
    console.log('PrivateRoute - Redirecting to login');
    // Ако потребителят не е влязъл, пренасочваме към страницата за вход
    return <Navigate to="/login" replace />;
  }

  console.log('PrivateRoute - Rendering children');
  // Ако потребителят е влязъл, показваме защитения контент
  return children;
};

export default PrivateRoute; 