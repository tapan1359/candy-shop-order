export const getPrinters = () => {
    return new Promise((resolve, reject) => {
        const { ipcRenderer } = window.require('electron');
        ipcRenderer.send('get-printers');
        ipcRenderer.addListener('printers-list', (event, printers) => {
            console.log('printers', printers);
            resolve(printers);
        });
    });
};

export const printPDF = (text, printerName, height, width) => {
    return new Promise((resolve, reject) => {
        const { ipcRenderer } = window.require('electron');
        ipcRenderer.send('print', { text, printerName, height, width });
        ipcRenderer.addListener('print-error', (event, error) => {
            reject(error);
        });
    });
}