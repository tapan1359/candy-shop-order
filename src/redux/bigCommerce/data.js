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
    updateCustomerById: (state, action) => {
      const customer = action.payload;
      const index = state.customers.findIndex((c) => c.id === customer.id);
      if (index !== -1) {
        state.customers[index] = customer;
      }
    }
  },
});

export const { setCustomers, setProducts, updateCustomerById } = dataSlice.actions;

export default dataSlice.reducer;
