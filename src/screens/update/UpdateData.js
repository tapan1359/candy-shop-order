import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { getAllCustomers } from '../../bigCommerce/customers/customers.get';
import { getAllProducts } from '../../bigCommerce/products/products.get';
import { setCustomers, setProducts } from '../../redux/bigCommerce/data';
import LoadItem from '../../componants/LoadItem';
import { Box, Button, TextField, Alert, Divider, Modal, Typography } from '@mui/material';
import PrintModal from '../../componants/PrintPreview/PrintModal';
import {getOrder} from "../../bigCommerce/orders/orders";
import {processOrderPayment} from "../../bigCommerce/payment/payments";

function UpdateDataScreen() {
  const dispatch = useDispatch();
  const [printMessage, setPrintMessage] = useState(null);
  const [alertMessage, setAlertMessage] = React.useState(null);
  const [preview, setPreview] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = React.useState(false);
  const [paymentInfo, setPaymentInfo] = React.useState(null);
  const [order, setOrder] = React.useState(null);
  const [orderId, setOrderId] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

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

  const openPaymentModal = async () => {
    console.log('openPaymentModal', orderId);
    if (!orderId) {
      setAlertMessage({message: "Order ID is required!", severity: "error"});
      return;
    }
    try {
      const order = await getOrder({orderId});
      setOrder(order);
      setPaymentModalOpen(true);
    } catch (error) {
      setAlertMessage({message: "Order not found!", severity: "error"});
    }
  }

  const handlePayment = async () => {
    try {
      setLoading(true);
      setAlertMessage(null);
      
      if (!orderId) {
        setAlertMessage({message: "Order not created!", severity: "error"});
        return;
      }

      if (!paymentInfo) {
        setAlertMessage({message: "provide payment info!", severity: "error"});
        return;
      }

      if (orderId && paymentInfo) {
        await processOrderPayment({orderId, paymentInfo});
      }

      setAlertMessage({message: "Payment processed!", severity: "success"});
      setPaymentModalOpen(false);

    } catch (error) {
      const data = error.response.data;
      setAlertMessage({message: JSON.stringify(data?.title), severity: "error"});
      setLoading(false);
    }
    finally {
      setLoading(false);
    }
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
      {preview && <PrintModal text={printMessage} closePreview={closePreviewModal} />}
      <Divider />
      <Typography variant="h6">Payment</Typography>
      <TextField
        label="Order ID"
        type="number"
        value={orderId}
        onChange={(event) => setOrderId(event.target.value)}
      />
      <Button
          size={"large"}
          onClick={() => openPaymentModal()}
        >Add Payment</Button>

        <Modal
          open={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: 400 }, // Responsive width
              bgcolor: 'background.paper',
              borderRadius: '8px',
              boxShadow: 24,
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h6">Payment Info</Typography>
            <Typography variant="h6">Total: {order?.total_inc_tax}</Typography>
            <TextField
              label="Name on Card"
              value={paymentInfo?.nameOnCard}
              onChange={(event) => setPaymentInfo({...paymentInfo, nameOnCard: event.target.value})}
            />
            <TextField
              label="Card Number"
              type="number"
              value={paymentInfo?.cardNumber}
              onChange={(event) => setPaymentInfo({...paymentInfo, cardNumber: event.target.value})}
            />
            <TextField
              label="CVV"
              type="number"
              value={paymentInfo?.cvv}
              onChange={(event) => setPaymentInfo({...paymentInfo, cvv: event.target.value})}
            />
            <TextField
              label="Expiry Month"
              type="number"
              value={paymentInfo?.expiryDate}
              onChange={(event) => setPaymentInfo({...paymentInfo, expiryMonth: event.target.value})}
            />
            <TextField
              label="Expiry Year"
              type="number"
              value={paymentInfo?.expiryDate}
              onChange={(event) => setPaymentInfo({...paymentInfo, expiryYear: event.target.value})}
            />
            <Button
              onClick={handlePayment}
            >
              Pay
            </Button>
          </Box>
        </Modal>
    </div>

  );
}

export default UpdateDataScreen;
