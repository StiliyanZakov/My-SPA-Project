import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginUser: (state, action) => {
      console.log('authSlice - loginUser - payload:', action.payload);
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.loading = false;
      state.error = null;
      // Save to localStorage
      localStorage.setItem('authState', JSON.stringify({
        ...state,
        user: action.payload,
        isAuthenticated: true,
        error: null
      }));
      console.log('authSlice - loginUser - new state:', state);
    },
    logoutUser: (state) => {
      console.log('authSlice - logoutUser - before state:', state);
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      // Clear localStorage
      localStorage.removeItem('authState');
      localStorage.removeItem('token');
      console.log('authSlice - logoutUser - after state:', state);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    }
  }
});

export const { loginUser, logoutUser, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;