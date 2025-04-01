import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser } from '../store/slices/authSlice';
import { auth } from '../config/firebase';
import { updateProfile } from 'firebase/auth';
import { updateProfile as updateProfileApi } from '../services/api';
import '../styles/global.css';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    photoURL: user?.photoURL || ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        email: user.email || '',
        photoURL: user.photoURL || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      console.log('Submitting profile update with data:', formData);
      
      // Update Firebase Auth directly first
      if (auth.currentUser) {
        console.log('Updating Firebase Auth profile...');
        try {
          await updateProfile(auth.currentUser, {
            displayName: formData.displayName,
            photoURL: formData.photoURL
          });
          console.log('Firebase Auth profile updated successfully');
        } catch (firebaseError) {
          console.error('Error updating Firebase Auth profile:', firebaseError);
          setError(`Firebase error: ${firebaseError.message}`);
          setLoading(false);
          return;
        }
      }

      // Then update through our API
      console.log('Updating profile through API...');
      const updatedUser = await updateProfileApi(formData);
      console.log('Profile API update response:', updatedUser);
      
      // Update Redux state with the new user data
      dispatch(loginUser({ 
        ...user, 
        displayName: formData.displayName,
        photoURL: formData.photoURL
      }));
      
      setSuccess('Profile updated successfully!');
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.message || 'Error updating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h2>My Profile</h2>
          <div className="profile-avatar">
            {formData.photoURL ? (
              <img src={formData.photoURL} alt="Profile" />
            ) : (
              <div className="avatar-placeholder">
                {formData.displayName ? formData.displayName.charAt(0).toUpperCase() : '?'}
              </div>
            )}
          </div>
        </div>
        <div className="profile-info">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="photoURL">Profile Photo URL</label>
              <input
                type="url"
                id="photoURL"
                name="photoURL"
                value={formData.photoURL}
                onChange={handleChange}
                placeholder="Enter profile photo URL"
                className="modern-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="displayName">Username</label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                placeholder="Enter your username"
                className="modern-input"
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
                disabled
                className="modern-input disabled"
              />
              <small>Email cannot be changed</small>
            </div>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <div className="profile-actions">
              <button 
                type="submit" 
                disabled={loading}
                className="button-primary"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <style jsx>{`
        .profile-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 80vh;
          padding: 2rem;
        }
        
        .profile-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 500px;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .profile-card:hover {
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
        }
        
        .profile-header {
          padding: 2rem;
          text-align: center;
          background: linear-gradient(135deg, #6e8efb, #a777e3);
          color: white;
        }
        
        .profile-header h2 {
          margin-top: 0;
          margin-bottom: 1.5rem;
          font-weight: 600;
        }
        
        .profile-avatar {
          margin: 0 auto;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid white;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .profile-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .avatar-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e0e0e0;
          color: #555;
          font-size: 2.5rem;
          font-weight: bold;
        }
        
        .profile-info {
          padding: 2rem;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #333;
        }
        
        .modern-input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 16px;
          transition: all 0.3s;
        }
        
        .modern-input:focus {
          border-color: #6e8efb;
          box-shadow: 0 0 0 3px rgba(110, 142, 251, 0.2);
          outline: none;
        }
        
        .modern-input.disabled {
          background-color: #f9f9f9;
          cursor: not-allowed;
        }
        
        small {
          display: block;
          margin-top: 0.25rem;
          color: #888;
          font-size: 0.8rem;
        }
        
        .error-message {
          padding: 0.75rem;
          background-color: #ffebee;
          border: 1px solid #ffcdd2;
          border-radius: 6px;
          color: #d32f2f;
          margin-bottom: 1rem;
        }
        
        .success-message {
          padding: 0.75rem;
          background-color: #e8f5e9;
          border: 1px solid #c8e6c9;
          border-radius: 6px;
          color: #2e7d32;
          margin-bottom: 1rem;
        }
        
        .profile-actions {
          margin-top: 2rem;
          display: flex;
          justify-content: flex-end;
        }
        
        .button-primary {
          background: linear-gradient(135deg, #6e8efb, #a777e3);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .button-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .button-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
      `}</style>
    </div>
  );
};

export default Profile; 