import { createSlice } from '@reduxjs/toolkit';

const dataSlice = createSlice({
  name: 'data',
  initialState: {
    customers: [],
    products: [],
  },
  reducers: {
    setCustomers: (state, action) => {
      state.customers = action.payload;
    },
    setProducts: (state, action) => {
      state.products = action.payload;
    },
  },
});

export const { setCustomers, setProducts } = dataSlice.actions;

export default dataSlice.reducer;
