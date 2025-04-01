import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/slices/authSlice'
import '../styles/global.css'

const Header = ({ user }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const cart = useSelector((state) => state.cart.items)
  
  const handleLogout = async () => {
    try {
      await dispatch(logout())
      navigate('/')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }
  
  return (
    <header className="header">
      <div className="container header-container">
        <div className="header-logo">
          <Link to="/">E-Commerce</Link>
        </div>
        
        <nav className="header-nav">
          <ul className="header-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/products">Products</Link>
            </li>
            {user ? (
              <>
                <li>
                  <Link to="/cart">
                    Cart ({cart.reduce((total, item) => total + item.quantity, 0)})
                  </Link>
                </li>
                <li>
                  <Link to="/profile">Profile</Link>
                </li>
                <li>
                  <button className="btn-logout" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header 