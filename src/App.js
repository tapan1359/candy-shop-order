import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { getOrders } from './bigCommerce/orders/orders.get';
import Header from './componants/Header';
import OrderIndex from './screens/orders/OrderIndex';
import NewOrderIndex from './screens/newOrders/NewOrderIndex';
import { Box } from '@mui/material';



function App() {
    // getOrders({
    //   // params: {
    //   //   // min_date_created: '2023-01-01',
    //   //   // max_date_created: '2023-01-02',
    //   // }
    //   order_id: 172
    // });

    const [activePage, setActivePage] = useState('New Orders');

  return (
   <Box className="App">
      <Header activePage={activePage} hndlePageChange={setActivePage} />
      <Box sx={{ height: '64px' }} />
      {activePage === 'Orders' && <OrderIndex />}
      {activePage === 'New Orders' && <NewOrderIndex />}
    </Box>
  );
}

export default App;
