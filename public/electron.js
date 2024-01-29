const { app, BrowserWindow, ipcMain } = require('electron');
const isDev = require('electron-is-dev');
const axios = require('axios');
const cors = require('cors'); // Import the cors middleware

require('dotenv').config();
// import installExtension, { REDUX_DEVTOOLS } from 'electron-devtools-installer';
const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

// Setup Express
const expressApp = express();
const port = 6868; // Port for your proxy server

expressApp.use(cors());

const xAuthToken = process.env.BIGCOMMERCE_ACCESS_TOKEN;
const storeHash = process.env.BIGCOMMERCE_STORE_HASH;

const bigCommerceProxy = createProxyMiddleware({
  target: 'https://api.bigcommerce.com', // BigCommerce API base URL
  changeOrigin: true,
  pathRewrite: {
    '^/bigcommerce': `/stores/${storeHash}`, // rewrite path
  },
  onProxyReq: (proxyReq, req, res) => {
    // Set custom headers for BigCommerce
    // console.log('proxyReq', proxyReq);
    proxyReq.setHeader('X-Auth-Token', xAuthToken);
    proxyReq.setHeader('Accept', 'application/json');
  },
  onProxyRes(proxyRes, req, res) {
    // console.log('proxyRes', proxyRes);
    // Add CORS headers
    proxyRes.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept';
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'; // Add PUT to allowed methods
  },
});

// Use the proxy middleware
expressApp.use('/bigcommerce', bigCommerceProxy);
expressApp.post('/bigcommerce/v2/orders', (req, res) => {
  const data = req.body;
  const store = `/stores/${storeHash}`;
  const target = 'https://api.bigcommerce.com'; // BigCommerce API base URL

  try {
    const response = axios.post(
      `${target}${store}/v2/orders`,
      data,
      {
        headers: {
          'X-Auth-Token': xAuthToken,
        },
      },
    );
    res.send(response.data);
  } catch (error) {
    res.status('500').send(error);
  }
});

expressApp.listen(port, () => console.log(`Proxy server running on port ${port}`));
console.log('Express server running on port 3000');

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  // load the index.html from a url
  // win.loadURL('http://localhost:3000');
  if (isDev) {
    win.loadURL('http://localhost:3000');
  } else {
    win.loadURL(`file://${path.join(__dirname, '../build/index.html')}`);
  }

  // Open the DevTools.

  if (isDev) {
    win.webContents.openDevTools();
  }

  // make a ipcmain that listens
  ipcMain.on('newOrder', async (event, arg) => {
    // get the config from args and pass it to axios
    console.log('newOrder', arg);
    try {
      const store = `/stores/${storeHash}`;
      const target = 'https://api.bigcommerce.com'; // BigCommerce API base URL

      await axios({
        method: 'post',
        url: `${target}${store}/v2/orders`,
        headers: {
          'X-Auth-Token': xAuthToken,

          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        data: arg,
      }).then((response) => {
        // console.log('newOrder response', response);
        event.reply('newOrderResponse', response.data);
      })
        .catch((error) => {
          console.log('Error in newOrder:', error.message);
          event.reply('newOrderError', JSON.stringify(error));
        });
      // console.log('newOrder response', response);
      // event.reply('newOrderResponse', response.data);
    } catch (error) {
      // console.log('Error in newOrder:', error.message);
      event.reply('newOrderError', error.message);
    }
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  installExtension(REDUX_DEVTOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err));
  createWindow();
});
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.

  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
