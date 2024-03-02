import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './App.css';
import { Box, ThemeProvider, createTheme} from '@mui/material';

import Header from './componants/Header';
import OrderIndex from './screens/orders/OrderIndex';
import NewOrderIndex from './screens/newOrders/NewOrderIndex';
import UpdateDataScreen from './screens/update/UpdateData';
import LoginPage from './screens/Login';
import { logOut, logIn } from './redux/user';

import { Amplify } from 'aws-amplify';
import { getCurrentUser, signOut } from 'aws-amplify/auth';


Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_NrST1L0l2',
      userPoolClientId: '33n5f520942ao3m0ck98f3gcag',
    }
  }
});


export const theme = createTheme({
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


function App() {

  const dispatch = useDispatch();
  const [activePage, setActivePage] = useState('New Orders');
  
  const loggedIn = useSelector((state) => state.user.loggedIn);

  const handlePageChange = (page) => {
    if (page === 'Logout') {
      signOut();
      dispatch(logOut());
      return;
    }
    setActivePage(page);
  }

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) {
        dispatch(logIn());
      }
    });
  }, []);



  return (
    <ThemeProvider theme={theme}>
      <Box className="App">
        {loggedIn ? (
          <>
            <Header activePage={activePage} hndlePageChange={handlePageChange} />
            <Box sx={{ height: '64px' }} />
            {activePage === 'Orders' && <OrderIndex />}
            {activePage === 'New Orders' && <NewOrderIndex />}
            {activePage === 'Update Data' && <UpdateDataScreen />}
          </>
        ):
          <LoginPage />
        }
      </Box>
    </ThemeProvider>
  );
}

export default App;