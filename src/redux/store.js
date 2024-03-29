import {combineReducers, configureStore} from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore } from 'redux-persist';

import ordersSlice from './bigCommerce/ordersSlice';
import newOrdersSlice from './bigCommerce/newOrderSlice';
import dataSlice from './bigCommerce/data';
import userSlice from './user';

const persistConfig = {
  key: 'root',
  storage,
};

const persistedDataReducer = persistReducer(persistConfig, dataSlice);

export const store = configureStore({
  reducer: {
    orders: ordersSlice,
    newOrders: newOrdersSlice,
    data: persistedDataReducer,
    user: userSlice,
  },
});

export const persistor = persistStore(store);
