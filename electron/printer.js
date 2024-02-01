const { ipcMain, BrowserWindow, app } = require('electron');
const pdfPrinter = require('pdf-to-printer');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const createDoc = require('./createDoc');
const os = require('os');
const unixPrint = require('unix-print');

const setUpPrint = (mainWindow) => {
  ipcMain.on('get-printers', async (event) => {
    console.log('win', typeof mainWindow);
    try {
      const printers = await mainWindow.webContents.getPrintersAsync();
      console.log("printers", printers);
      event.reply('printers-list', printers); // Sending the printers list to the renderer
    } catch (error) {
      console.error('Error fetching printers:', error);
      event.reply('printers-list', []); // Sending an empty array on error
    }
  });

  ipcMain.on('print', async (event, arg) => {
    const filepath = await createDoc(arg.text);
    try {
      console.log('args', arg);
      if (os.platform() === 'win32') {
        pdfPrinter.print(filepath, {
          printer: arg.printerName
        });
      } else {
        unixPrint.print(filepath, arg.printerName);
      }
    } catch (error) {
      console.log('error in print', error);
      event.reply('print-error', error);
    }

    // remove file after print
    // setTimeout(() => {
    //   fsExtra.remove(path.join(__dirname, `/tempPdf/${fileName}.pdf`));
    // }, 1000);
  });

  ipcMain.on('printUrl', async (event, arg) => {
    console.log('printUrl', arg);
    const pdfUrl = arg.url;
    const random = Math.floor(Math.random() * 1000000000);

    // Download the PDF content from the URL and save it to a file
    const axios = require('axios'); // You may need to install the axios library
    try {
      const response = await axios.get(pdfUrl, { responseType: 'stream' });
      const tempFolder = app.getPath('userData');
      const tempPdfDir = path.join(tempFolder, 'pdfTemp'); // Path to the pdfTemp directory

      // Check if the pdfTemp directory exists, create if not
      if (!fs.existsSync(tempPdfDir)) {
        fs.mkdirSync(tempPdfDir, { recursive: true });
      }

      // Define the file path for the PDF inside the pdfTemp directory
      const filePath = path.join(tempPdfDir, `${random}.pdf`);
      const writeStream = fs.createWriteStream(filePath);
      response.data.pipe(writeStream);

      writeStream.on('finish', () => {
        console.log('The file was saved!');

        // Use pdf-to-printer to print the saved PDF
        pdfPrinter.print(filePath, {
          printer: arg.printerName,
          pageSize: {
            height: arg.height,
            width: arg.width,
          },
        });
      });

      writeStream.on('error', (err) => {
        console.error('Error saving the file:', err);
      });
    } catch (error) {
      console.error('Error downloading the PDF:', error);
    }
  });
  ipcMain.on('printBlob', async (event, arg) => {
    const random = Math.floor(Math.random() * 1000000000);

    try {
      // Ensure tempPdf directory exists
      // if (!fs.existsSync(tempPdfDir)) {
      //     fs.mkdirSync(tempPdfDir);
      // }
      const tempPdfDir = app.getPath('userData');
      console.log('tempPdfDir', tempPdfDir);
      const filePath = path.join(tempPdfDir, `${random}.pdf`);
      // Writing the PDF Blob to a file
      const writeStream = fs.createWriteStream(filePath);
      writeStream.write(Buffer.from(arg.pdfDoc));
      writeStream.end();
      console.log('The file was saved!', filePath);
      writeStream.on('finish', () => {
        // Print the PDF
        pdfPrinter.print(filePath, {
          printer: arg.printerName,
          pageSize: {
            height: arg.height,
            width: arg.width,
          },
        });

        // Optional: Clean up the file after a delay
        setTimeout(() => {
          // fs.unlinkSync(filePath);
        }, 10000); // Delay in milliseconds
      });

      writeStream.on('error', (err) => {
        //   throw new Error(`Failed to write PDF: ${err.message}`);
        event.reply('print-error', { message: err.message, code: err.code });
      });
    } catch (error) {
      console.error('Error in printBlob:', error);
      event.reply('print-error', { message: error.message, code: error.code });
      // Clean up if file exists
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  });
};

module.exports = setUpPrint;
