// Express setup
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const PDFDocument = require('pdfkit');
const getStream = require('get-stream');
const path = require('path');




const app = express();
const port = process.env.PORT || 6868;

// // Serve static files from the React app
// app.use(express.static(path.join(__dirname, './build')));

// // The "catchall" handler: for any request that doesn't
// // match one above, send back React's index.html file.
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, './', 'index.html'));
// });

// Body parser middleware to parse request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware for cross-origin requests
const cors = require('cors');
app.use(cors({ origin: '*' }));

// Proxy middleware for BigCommerce API
app.use('/api', createProxyMiddleware({
  target: 'https://api.bigcommerce.com',
  changeOrigin: true,
  pathRewrite: { '^/api': `/stores/${process.env.BIGCOMMERCE_STORE_HASH}` },
  onProxyReq: (proxyReq, req) => {
    proxyReq.setHeader('X-Auth-Token', process.env.BIGCOMMERCE_ACCESS_TOKEN);
    proxyReq.setHeader('Accept', 'application/json');
  },
}));

// Proxy middleware for BigCommerce Payments API
app.use('/payments', createProxyMiddleware({
  target: 'https://payments.bigcommerce.com',
  changeOrigin: true,
  pathRewrite: { '^/payments': `/stores/${process.env.BIGCOMMERCE_STORE_HASH}` },
  onProxyReq: (proxyReq, req) => {
    proxyReq.setHeader('Accept', 'application/vnd.bc.v1+json');
    proxyReq.setHeader('Content-Type', 'application/json');
  },
}));

app.post('/create-pdf', async (req, res) => {
  const doc = new PDFDocument({ size: [2.25 * 72, 3.5 * 72], margin: 0 });

  // Write content to PDF
  doc.fontSize(10).text(req.body.message, 10, 10);

  // Finalize PDF file
  doc.end();

  // Convert PDF stream to a buffer
  const buffer = await getStream.buffer(doc);

  // Send a response with the PDF buffer
  res.writeHead(200, {
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'attachment;filename=gift_message.pdf',
    'Content-Length': buffer.length,
  });

  res.end(buffer);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});