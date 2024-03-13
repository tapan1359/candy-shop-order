import React, {useEffect, useState } from 'react';
import {
  Box, TextField, Button, Modal, Typography
} from '@mui/material';
import {getOrder} from '../bigCommerce/orders/orders';

const PaymentForm = ({order=null, orderId=null, paymentInfo, setPaymentInfo, submitPayment}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [localOrder, setLocalOrder] = useState(order);


  useEffect(() => {
    if (!order) {
      getOrder(orderId).then((o) => {
        setLocalOrder(o);
      });
    }
  });

  return (
    <>
      <Button
        size={"large"}
        onClick={() => setModalOpen(true)}
      >
        Add Payment
      </Button>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
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
          <Typography variant="h6">Total: {localOrder?.total_inc_tax}</Typography>
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
            onClick={() => submitPayment(paymentInfo)}
          >
            Pay
          </Button>
        </Box>
      </Modal>
    </>
  )
}

export default PaymentForm;