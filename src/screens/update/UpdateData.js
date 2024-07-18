import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { getAllCustomers } from '../../bigCommerce/customers/customers.get';
import { getAllProducts } from '../../bigCommerce/products/products.get';
import { setCustomers, setProducts } from '../../redux/bigCommerce/data';
import LoadItem from '../../componants/LoadItem';
import { Box, Button, TextField, Divider, Modal, Typography } from '@mui/material';
import PrintModal from '../../componants/PrintPreview/PrintModal';
import {getOrder, updateOrderBillingAddressZipCode} from "../../bigCommerce/orders/orders";
import {processOrderPayment} from "../../bigCommerce/payment/payments";
import CustomAlert from "../../CustomAlert";
import {PaymentFormNew} from "../../componants/PaymentFormNew";

function UpdateDataScreen() {
  const dispatch = useDispatch();
  const [printMessage, setPrintMessage] = useState("");
  const [alertMessage, setAlertMessage] = React.useState(null);
  const [preview, setPreview] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = React.useState(false);
  const [order, setOrder] = React.useState(null);
  const [orderId, setOrderId] = React.useState('');
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

  const handlePayment = async (paymentInfo) => {
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

      if (!paymentInfo.nameOnCard || !paymentInfo.cardNumber || !paymentInfo.cvv || !paymentInfo.expiryMonth || !paymentInfo.expiryYear || !paymentInfo.zipcode) {
        setAlertMessage({message: "provide all payment info!", severity: "error"});
        return;
      }

      if (paymentInfo.zipcode && paymentInfo.zipcode.length !== 5) {
        setAlertMessage({message: "Invalid Zipcode!", severity: "error"});
        return;
      }

      if (paymentInfo.cardNumber && paymentInfo.cardNumber.length !== 16) {
        setAlertMessage({message: "Invalid Card Number!", severity: "error"});
        return;
      }

      if (paymentInfo.cvv && (paymentInfo.cvv.length < 3 && paymentInfo.cvv.length > 4)) {
        setAlertMessage({message: "Invalid CVV!", severity: "error"});
        return;
      }

      if (paymentInfo.expiryMonth && (paymentInfo.expiryMonth < 1 || paymentInfo.expiryMonth > 12)) {
        setAlertMessage({message: "Invalid Expiry Month!", severity: "error"});
        return;
      }

      if (paymentInfo.expiryYear && paymentInfo.expiryYear.length !== 4) {
        setAlertMessage({message: "Invalid Expiry Year!. Make sure it's 4 digit year", severity: "error"});
        return;
      }

      try {
        if (parseInt(paymentInfo.zipcode) !== parseInt(order.billing_address.zip)) {
          await updateOrderBillingAddressZipCode({orderId, zipCode: paymentInfo.zipcode})
        }
      } catch (error) {
        setAlertMessage({message: "ZipCode is different than billing. Error updating zip code", severity: "error"});
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
      throw error;
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {alertMessage && (
        <CustomAlert
          severity={alertMessage.severity}
          onClose={() => setAlertMessage(null)}
          message={alertMessage.message}
        />
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
          <Button onClick={() => setPreview(true)} disabled={printMessage === ""} sx={{ alignSelf: 'start' }}>Print</Button>
          <Button onClick={() => setPrintMessage("")} sx={{ alignSelf: 'start' }}  disabled={printMessage === ""}>Clear</Button>
        </Box>
      </Box>
      {(preview && printMessage) && <PrintModal text={printMessage} closePreview={closePreviewModal} />}
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
            <PaymentFormNew
              order={order}
              customerName={`${order?.billing_address?.first_name} ${order?.billing_address?.last_name}`}
              billingZipCode={order?.billing_address?.zip}
              submitPayment={handlePayment}
            />
          </Box>
        </Modal>
    </div>

  );
}

export default UpdateDataScreen;
