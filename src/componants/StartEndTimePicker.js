import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Box, Typography, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getOrders } from '../bigCommerce/orders/orders.get';
import { setOrders } from '../redux/bigCommerce/ordersSlice';
import '../styles/StartEndTimePicker.css';

export default function StartEndTimePicker({handleDateChange}) {
  const [startDate, setStartDate] = useState(new Date('2024-02-06')); // this is the start date for the picker
  const [endDate, setEndDate] = useState(new Date());
  const orders = useSelector((state) => state.orders.orders);

  useEffect(() => {
    handleDateChange({startDate, endDate});
  }, [startDate, endDate]);


  const handleResetDates = () => {
    setStartDate(new Date());
    setEndDate(new Date());
  };
  return (
    <Box sx={{
      display: 'flex', 
      flexDirection: { xs: 'column', sm: 'row' },
      justifyContent: 'space-around',
      alignItems: 'center',
      width: '100%', 
      height: '50px',
      '& > *': {
        marginBottom: { xs: 1, sm: 0}
      }
    }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'row',
          width: {xs: '100%', sm: 'auto'}
        }}>
        <Typography variant="body2">Start Date</Typography>
        <DatePicker
        selected={startDate}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        onChange={(date) => setStartDate(date)}
        wrapperClassName="date-picker"
        />
      </Box>
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'row',
          width: {xs: '100%', sm: 'auto'}
        }}>
        <Typography variant="body2">End Date</Typography>
        <DatePicker
        selected={endDate}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
        onChange={(date) => setEndDate(date)}
        />
        <Button 
          variant="contained" 
          onClick={handleResetDates}
          size='small'
        >
         Reset
        </Button>
    </Box>
      </Box>
  );
}
