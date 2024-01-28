import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { getOrders } from './bigCommerce/orders/orders.get';
import Header from './componants/Header';
import OrderIndex from './screens/orders/OrderIndex';
import NewOrderIndex from './screens/newOrders/NewOrderIndex';
import { Box } from '@mui/material';
import UpdateDataScreen from './screens/update/UpdateData';

function App() {
  const [activePage, setActivePage] = useState('Update Data');

  return (
    <Box className="App">
      <Header activePage={activePage} hndlePageChange={setActivePage} />
      <Box sx={{ height: '64px' }} />
      {activePage === 'Orders' && <OrderIndex />}
      {activePage === 'New Orders' && <NewOrderIndex />}
      {activePage === 'Update Data' && <UpdateDataScreen />}
    </Box>
  );
}

export default App;
