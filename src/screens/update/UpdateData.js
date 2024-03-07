import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { getAllCustomers } from '../../bigCommerce/customers/customers.get';
import { getAllProducts } from '../../bigCommerce/products/products.get';
import { setCustomers, setProducts } from '../../redux/bigCommerce/data';
import LoadItem from '../../componants/LoadItem';
import { Box, Button, TextField, Alert } from '@mui/material';
import PrintPreview from '../../componants/PrintPreview';

function UpdateDataScreen() {
  const dispatch = useDispatch();
  const [printMessage, setPrintMessage] = useState(null);
  const [alertMessage, setAlertMessage] = React.useState(null);
  const [preview, setPreview] = useState(false);

  const handleUpdateCustomers = async () => {
    try {
      const customers = await getAllCustomers();
      dispatch(setCustomers(customers));
      setAlertMessage({ severity: "success", message: "Customers updated successfully!" });
    } catch (error) {
      setAlertMessage({ severity: "error", message: JSON.stringify(error) });
    }
  };

  const handleUpdateProducts = async () => {
    try {
      const products = await getAllProducts();
      dispatch(setProducts(products));
      setAlertMessage({ severity: "success", message: "Products updated successfully!" });
    } catch (error) {
      setAlertMessage({ severity: "error", message: JSON.stringify(error) });
    }
  };

  const closePreviewModal = () => {
    setPreview(false);
    setPrintMessage(null);
  }

  return (
    <div>
      {alertMessage && (
        <Alert
          severity={alertMessage.severity}
          onClose={() => setAlertMessage(null)}
          sx={{
            position: 'fixed',
            top: '16px',
            right: '16px',
            zIndex: 9999,
          }}
        >
          {alertMessage.message}
        </Alert>
      )}
      <LoadItem buttonTitle="Update Customers" fetchDataFunc={handleUpdateCustomers} />
      <LoadItem buttonTitle="Update Products" fetchDataFunc={handleUpdateProducts} />
      <Box sx={{ margin: 2, flexDirection: { xs: 'column', sm: 'row' }, display: 'flex', gap: 2 }}>
        <Box sx={{ width: '100%', maxWidth: { sm: 'none', xs: '100%' }, display: 'flex', flexDirection: 'row', gap: 1 }}>
          <TextField
            id="outlined-basic"
            label="Message to Print"
            variant="outlined"
            value={printMessage}
            size='small'
            fullWidth
            onChange={(e) => setPrintMessage(e.target.value)}
          />
          <Button onClick={() => setPreview(true)} sx={{ alignSelf: 'start' }}>Print</Button>
        </Box>
      </Box>
      {preview && <PrintPreview text={printMessage} closePreview={closePreviewModal} />}
    </div>

  );
}

export default UpdateDataScreen;
