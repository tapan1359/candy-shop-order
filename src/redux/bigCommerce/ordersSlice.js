import { createSlice } from '@reduxjs/toolkit';


export const ordersSlice = createSlice({
    name: 'orders',
    initialState: {
        orders: [],
        orderStatuses: [],
        loading: false,
        error: null,
        order_id: '',
        filters: {
            limit:{
                value: 10,
                label: 'limit',
                options: [10, 20, 30, 40, 50, 100]
            },
            page:{
                value: 1,
                label: 'page',
            },
            sort:{
                value: 'created_at',
                label:'sort',
                options: ['id', 'customer_id', 'date_created', 'date_modified', 'status_id', 'channel_id', 'external_id']
            },
        },

    },

    reducers: {
        setOrders: (state, action) => {
            state.orders = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setOrderStatuses: (state, action) => {
            state.orderStatuses = action.payload;
        },
    },
});

export const { setOrders, setLoading, setError, setOrderStatuses } = ordersSlice.actions;


export const selectOrders = state => state.orders.orders;