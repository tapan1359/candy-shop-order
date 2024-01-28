import { configureStore } from '@reduxjs/toolkit';

import { ordersSlice } from './bigCommerce/ordersSlice';
import newOrdersSlice from './bigCommerce/newOrderSlice';
import dataSlice from './bigCommerce/data';

export const store = configureStore({
  reducer: {
    orders: ordersSlice.reducer,
    newOrders: newOrdersSlice,
    data: dataSlice,
  },
});
