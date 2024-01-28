import React, { useEffect, useState } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getOrders } from '../bigCommerce/orders/orders.get';
import { Box, Typography, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setOrders } from '../redux/bigCommerce/ordersSlice';
import '../styles/StartEndTimePicker.css';

export default function StartEndTimePicker() {
    const [startDate, setStartDate] = useState(new Date('2021-10-01')); //this is the start date for the picker
    const [endDate, setEndDate] = useState(new Date());
    const orders = useSelector((state) => state.orders.orders);
    const dispatch = useDispatch();

    useEffect(() => {
        getOrdersByDate();
    }, [startDate, endDate]);

    
    const getOrdersByDate = async () => {
        const orders = await getOrders({
            params: {
                min_date_created: startDate,
                max_date_created: endDate,
            }
        });
        dispatch(setOrders(orders));
    }

    const handleResetDates = () => {
        setStartDate(new Date());
        setEndDate(new Date());
    }
  return (
    //the goal is to have a start date and end date that can be selected and then used to filter the orders
    //the style should be a box with a title and then a date picker for start and end date
    //both boxes should be side by side with buttonr on the side to reset the dates to the current date
    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: '100px', border: '1px solid black' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '50%', height: '100%' }}>
            <Typography variant="h6">Start Date</Typography>
            <DatePicker
                selected={startDate}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                onChange={date => setStartDate(date)}
                wrapperClassName='date-picker'
            />        
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '50%', height: '100%' }}>
            <Typography variant="h6">End Date</Typography>
            <DatePicker
                selected={endDate}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                onChange={date => setEndDate(date)}
            />        
        </Box>
        {/* this is where the button to reset goes */}
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '50%', height: '100%' }}>
            <Button variant="contained" onClick={handleResetDates}>Reset Dates</Button>
        </Box>
        
    </Box>
  )
}
