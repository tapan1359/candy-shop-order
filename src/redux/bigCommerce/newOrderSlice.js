import { createSlice } from '@reduxjs/toolkit';

const newOrdersSlice = createSlice({
  name: 'newOrders',
  initialState: {
    cart: {},
    order: {},
    checkout: {}
  },
  reducers: {
    setCart: (state, action) => {
      state.cart = action.payload;
    },
    setOrder: (state, action) => {
      state.order = action.payload;
    },
    setCheckout: (state, action) => {
      state.checkout = action.payload;
    },
  },
});

export const {
  setCart, setOrder, setCheckout
} = newOrdersSlice.actions;

export default newOrdersSlice.reducer;
