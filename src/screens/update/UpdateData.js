import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { getAllCustomers } from '../../bigCommerce/customers/customers.get';
import { getAllProducts } from '../../bigCommerce/products/products.get';
import { setCustomers, setProducts } from '../../redux/bigCommerce/data';
import LoadItem from '../../componants/LoadItem';
import { Box, Button, TextField } from '@mui/material';
import PrintPreview from '../../componants/PrintPreview';

function UpdateDataScreen() {
  const dispatch = useDispatch();
  const [printMessage, setPrintMessage] = useState(null);
  const [preview, setPreview] = useState(false);

  const handleUpdateCustomers = async () => {
    const customers = await getAllCustomers();
    dispatch(setCustomers(customers));
  };

  const handleUpdateProducts = async () => {
    const customers = await getAllProducts();
    dispatch(setProducts(customers));
  };

  const closePreviewModal = () => {
    setPreview(false);
    setPrintMessage(null);
  }

  return (
    <div>
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
