import React, { useEffect, useState } from 'react';
import {Box, Button, Paper, Typography} from '@mui/material';
import { useSelector } from 'react-redux';

const Cart = ({
  customer,
  billingAddress,
  consignments,
  pickupConsignments,
}) => {
  const [isMinimized, setIsMinimized] = useState(true);
  const [activeTab, setActiveTab] = useState('');


  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsMinimized(false);
  };

  const paperSize = isMinimized ? 50 : 300;

  return (
    <Paper
      sx={{
        position: 'fixed',
        top: '90vh',
        right: '10px',
        transform: 'translateY(-50%)',
        zIndex: 9999,
        width: paperSize,
        padding: 2,
        opacity: 0.8,
      }}
      elevation={3}
    >
      {!isMinimized && (
        <>
          <Button
            sx={{
              padding: '2px 2px',
              minWidth: '50px',
            }}
            variant="contained"
            color={activeTab === 'details' ? 'primary' : 'secondary'}
            onClick={() => handleTabChange('details')}
          >
            Details
          </Button>

          <Button
            sx={{
              padding: '2px 2px',
              minWidth: '50px',
            }}
            variant="contained"
            color={activeTab === 'products' ? 'primary' : 'secondary'}
            onClick={() => handleTabChange('products')}
          >
            Products
          </Button>

          {activeTab === 'details' && (
            <>
              {customer && (
                <Box>
                  <Typography variant="subtitle1">Customer: </Typography>
                  <Typography variant="subtitle1">{customer.first_name} {customer.last_name}</Typography>
                  <Typography variant="subtitle1">{customer.email}</Typography>
                </Box>
              )}
              {billingAddress && (
                <Box>
                  <Typography variant="h6">Billing Address</Typography>
                  <Typography>{billingAddress.street}</Typography>
                  <Typography>{billingAddress.city}</Typography>
                  <Typography>{billingAddress.postcode}</Typography>
                </Box>
              )}
            </>
          )}
          {activeTab === 'products' && (
            <>
            </>
          )}
        </>
      )}

      <Button
        sx={{
          padding: '2px 2px',
          minWidth: '50px',
        }}
        variant="contained"
        color="primary"
        onClick={handleMinimize}>
        {isMinimized ? 'Cart' : 'Close'}
      </Button>
    </Paper>
  );
};

export default Cart;