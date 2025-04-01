import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Създаваме асинхронна заявка към API
export const fetchProductsAsync = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:3030/api/products');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Грешка при зареждане на продуктите');
    }
  }
);

const initialState = {
  products: [],
  loading: false,
  error: null
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsAsync.fulfilled, (state, action) => {
        state.products = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchProductsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Неочаквана грешка при зареждане на продуктите';
      });
  }
});

export const { setProducts, setLoading, setError } = productSlice.actions;
export default productSlice.reducer; 