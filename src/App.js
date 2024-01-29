import React, { useState } from 'react';
import './App.css';
import { Box } from '@mui/material';

import Header from './componants/Header';
import OrderIndex from './screens/orders/OrderIndex';
import NewOrderIndex from './screens/newOrders/NewOrderIndex';
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
