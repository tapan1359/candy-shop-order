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
    proxyReq.setHeader('Content-Type', 'application/json');
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`Received response with status: ${proxyRes.statusCode}`);
  },
  onError: (err, req, res) => {
      console.log(`Proxy error: ${err.message}`);
      console.log(`Proxy error: ${err.stack}`);
      console.log(`Proxy error: ${res.message}`);
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/create-pdf', async (req, res) => {
  console.log('Creating PDF with message:', req.body);
  const doc = new PDFDocument({ size: [2.25 * 72, 3.5 * 72], margin: 0 });

  // Assuming you want to center the message in the document
  const docWidth = 2.25 * 72;
  const docHeight = 3.5 * 72;

  // Write content to PDF
  doc.fontSize(10);

  // Measure the text
  const textWidth = doc.widthOfString(req.body.message);
  const textHeight = doc.heightOfString(req.body.message, {width: docWidth});

  // Calculate the starting positions to center the text
  const startX = (docWidth - textWidth) / 2;

  const startY = (docHeight - textHeight) / 2;

  const centerX = docWidth / 2;
  const centerY = docHeight / 2;

  doc.translate(centerX, centerY);
  doc.rotate(90);


  // if (textHeight < 15) {
  //   Y = 0
  // } else if (textHeight < 25) {
  //   Y = -5
  // } else if (textHeight < 57) {
  //   Y = -15
  // } else if (textHeight < 110) {
  //   Y = -30
  // } else if(textHeight < 150) {
  //   Y = -45
  // } else if (textHeight < 200) {
  //   Y = -60
  // } else {
  //    Y = -70
  // } 

  const m = -0.353;
  const b = 4.944;
  let Y = m * textHeight + b;
  Y = Math.max(Y, -65);


  console.log('textHeight', textHeight);
  console.log('Y', Y);

  // Write content to PDF
  doc.text(req.body.message, -centerY, Y, {
    width: docHeight,
    align: "center"
  });
  
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