import React, { useState } from 'react';
import './App.css';
import { Box, ThemeProvider, createTheme} from '@mui/material';

import Header from './componants/Header';
import OrderIndex from './screens/orders/OrderIndex';
import NewOrderIndex from './screens/newOrders/NewOrderIndex';
import UpdateDataScreen from './screens/update/UpdateData';


function App() {
  const [activePage, setActivePage] = useState('New Orders');

  // Create a custom theme
  const theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#659DBD',
      },
      secondary: {
        main: '#DAAD86',
      },
    },
    typography: {
      fontFamily: 'monospace',
      fontSize: 11,
    },    
  });

  return (
    <ThemeProvider theme={theme}>
      <Box className="App">
        <Header activePage={activePage} hndlePageChange={setActivePage} />
        <Box sx={{ height: '64px' }} />
        {activePage === 'Orders' && <OrderIndex />}
        {activePage === 'New Orders' && <NewOrderIndex />}
        {activePage === 'Update Data' && <UpdateDataScreen />}
      </Box>
    </ThemeProvider>
  );
}

export default App;