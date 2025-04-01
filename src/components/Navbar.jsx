import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/slices/authSlice';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
import '../styles/global.css';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logoutUser());
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        E-Commerce Store
      </Link>
      <div className="navbar-links">
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/products" className="nav-link">
          Products
        </Link>
        {user ? (
          <>
            <Link to="/cart" className="nav-link" style={{ position: 'relative' }}>
              Cart
              {items.length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: '#007bff',
                  color: 'white',
                  borderRadius: '50%',
                  padding: '2px 6px',
                  fontSize: '0.7rem',
                  minWidth: '20px',
                  textAlign: 'center'
                }}>
                  {items.length}
                </span>
              )}
            </Link>
            <Link to="/profile" className="nav-link">
              Profile
            </Link>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/register" className="nav-link">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 