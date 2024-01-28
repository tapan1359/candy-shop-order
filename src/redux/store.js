import { configureStore } from '@reduxjs/toolkit'

import { ordersSlice } from './bigCommerce/ordersSlice'
import newOrdersSlice  from './bigCommerce/newOrderSlice'


export const store = configureStore({
    reducer: {
        orders: ordersSlice.reducer,
        newOrders: newOrdersSlice
    },
  })