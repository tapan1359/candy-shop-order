import React, { useEffect, useState } from 'react';
import { Button, Paper } from '@mui/material';
import { useSelector } from 'react-redux';

const FloatOrderDetails = () => {
  const [isMinimized, setIsMinimized] = useState(true);
  const [activeTab, setActiveTab] = useState('');

  const checkout = useSelector((state) => state.newOrders.checkout);
  const cart = useSelector((state) => state.newOrders.cart);
  const order = useSelector((state) => state.newOrders.order);

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsMinimized(false);
  };
  
  const paperSize = isMinimized ? 50 : 600;

  return (
    <Paper
      sx={{
        position: 'fixed',
        top: '600px',
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
              fontSize: '0.5rem',
              padding: '2px 2px', 
              minWidth: '50px',
            }}
            variant="contained"
            color={activeTab === 'cart' ? 'primary' : 'secondary'}
            onClick={() => handleTabChange('cart')}
          >
            Cart
          </Button>
          <Button
            sx={{
              fontSize: '0.5rem',
              padding: '2px 2px', 
              minWidth: '50px',
            }}
            variant="contained"
            color={activeTab === 'checkout' ? 'primary' : 'secondary'}
            onClick={() => handleTabChange('checkout')}
          >
            Checkout
          </Button>
          <Button
            sx={{
              fontSize: '0.5rem',
              padding: '2px 2px', 
              minWidth: '50px',
            }}
            variant="contained"
            color={activeTab === 'order' ? 'primary' : 'secondary'}
            onClick={() => handleTabChange('order')}
          >
            Order
          </Button>

          {activeTab === 'cart' && (
            <>
              <h3>Cart Data:</h3>
              <div style={{ maxHeight: '200px', overflowY: 'scroll' }}>
                <pre>{JSON.stringify(cart, null, 2)}</pre>
              </div>
            </>
          )}
          {activeTab === 'checkout' && (
            <>
              <h3>Checkout Data:</h3>
              <div style={{ maxHeight: '200px', overflowY: 'scroll' }}>
                <pre>{JSON.stringify(checkout, null, 2)}</pre>
              </div>
            </>
          )}
          {activeTab === 'order' && (
            <>
              <h3>Order Data:</h3>
              <div style={{ maxHeight: '200px', overflowY: 'scroll' }}>
                <pre>{JSON.stringify(order, null, 2)}</pre>
              </div>
            </>
          )}
        </>
      )}

      <Button 
        sx={{
          fontSize: '0.5rem',
          padding: '2px 2px', 
          minWidth: '50px',
        }}
        variant="contained" 
        color="primary" 
        onClick={handleMinimize}>
          {isMinimized ? 'Restore' : 'Minimize'}
      </Button>
    </Paper>
  );
};

export default FloatOrderDetails;