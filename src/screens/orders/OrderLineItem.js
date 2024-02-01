import React, { useState } from 'react';
import {
  Box, Typography, Select, MenuItem, Button,
} from '@mui/material';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { updateOrder } from '../../bigCommerce/orders/orders.put';

export default function OrderLineItem({ order, printOrder }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: '50px',
        border: '1px solid black',
      }}
    >
      <Box>
        <Typography variant="body1">{order.id}</Typography>
      </Box>
      <Box>
        <Typography variant="body1">
          {order.billing_address.first_name}
          {' '}
          {order.billing_address.last_name}
        </Typography>
      </Box>
      <Box>
        <Typography variant="body1">
          $
          {order.total_inc_tax}
        </Typography>
      </Box>
      <Box>
        <MenuItem value={order.status_id}>{order.status}</MenuItem>
      </Box>
      <Box>
        <Typography variant="body1">
          {moment(order.date_created).format('MM/DD/YYYY')}
        </Typography>
      </Box>
      <Box>
        <Typography variant="body1">
          {moment(order.date_modified).format('MM/DD/YYYY')}
        </Typography>
      </Box>
      <Box>
        {/* Render the channel here */}
      </Box>
      <Box>
        <Button
          variant="contained"
          onClick={() => printOrder(order)}
          disabled={order.customer_message === ''}
        >
          Print Gift Card
        </Button>
      </Box>
    </Box>
  );
}
