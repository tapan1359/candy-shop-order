import { createSlice } from '@reduxjs/toolkit';

const newOrdersSlice = createSlice({
    name: 'newOrders',
    initialState: {
        customers: [],
        addressBook: [],
        billingInfo: [],
        shippingInfo: [],
        cart: [],
    },
    reducers: {
        setCustomers: (state, action) => {
            state.customers = action.payload;
        },
        setAddressBook: (state, action) => {
            state.addressBook = action.payload;
        },
        setBillingInfo: (state, action) => {
            state.billingInfo = action.payload;
        },
        setShippingInfo: (state, action) => {
            state.shippingInfo = action.payload;
        },
        setCart: (state, action) => {
            state.cart = action.payload;
        },
    },
});

export const { setCustomers, setAddressBook, setBillingInfo, setShippingInfo, setCart } = newOrdersSlice.actions;

export default newOrdersSlice.reducer;