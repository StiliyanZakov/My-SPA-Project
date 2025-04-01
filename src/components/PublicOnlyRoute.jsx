import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  console.log('PublicOnlyRoute - isAuthenticated:', isAuthenticated);
  
  // Ако потребителят е логнат, пренасочваме към началната страница
  if (isAuthenticated) {
    console.log('PublicOnlyRoute - Redirecting to home');
    return <Navigate to="/" replace />;
  }
  
  // Ако потребителят не е логнат, показваме компонента
  console.log('PublicOnlyRoute - Rendering children');
  return children;
};

export default PublicOnlyRoute; 