import React, {useEffect, useState} from 'react';
import {Button, Paper} from '@mui/material'
import { useSelector } from 'react-redux';

const FloatOrderDetails = () => {

  const [isMinimized, setIsMinimized] = useState(false);
  const checkout = useSelector((state) => state.newOrders.checkout);
  const cart = useSelector((state) => state.newOrders.cart);
  const order = useSelector((state) => state.newOrders.order);

  useEffect(() => {
    console.log('cart', cart);
    console.log('checkout', checkout);
    console.log('order', order);
  }, [cart, checkout, order]);

  useEffect(() => {
    console.log('cartB', cart);
    console.log('checkoutB', checkout);
    console.log('orderB', order);
  }, [cart, checkout, order]);

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <Paper
      sx={{
        position: 'fixed',
        top: '500px',
        right: '10px',
        transform: 'translateY(-50%)',
        zIndex: 9999,
        width: 300,
        padding: 2,
      }}
      elevation={3}
    >
      {!isMinimized && (
        <>
        {cart && (
          <div>
            <h3>Cart Data:</h3>
            <pre>{JSON.stringify(cart, null, 2)}</pre>
          </div>
        )}
        {checkout && (
          <div>
            <h3>Checkout Data:</h3>
            <pre>{JSON.stringify(checkout, null, 2)}</pre>
          </div>
        )}
        {order && (
          <div>
            <h3>Order Data:</h3>
            <pre>{JSON.stringify(order, null, 2)}</pre>
          </div>
        )}
        </>
      )}
      <Button variant="contained" color="primary" onClick={handleMinimize}>
        {isMinimized ? 'Restore' : 'Minimize'}
      </Button>
    </Paper>
  );
};

export default FloatOrderDetails;