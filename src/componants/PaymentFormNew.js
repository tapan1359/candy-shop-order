import {Box, Button, TextField, Typography} from "@mui/material";
import React from "react";

export function PaymentFormNew({
   order,
   submitPayment,
}) {

  const [paymentInfo, setPaymentInfo] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async () => {
    let updatedPaymentInfo = {...paymentInfo};
    if (paymentInfo.expiryDate) {
      const [expiryMonth, expiryYear] = paymentInfo.expiryDate.split('/');
      const fullExpiryYear = `20${expiryYear}`;
      updatedPaymentInfo = {...paymentInfo, expiryMonth, expiryYear: fullExpiryYear};
    }
    setLoading(true);
    await submitPayment(updatedPaymentInfo);
    setLoading(false);
    setPaymentInfo(null)
  };

  const handleExpiryDateChange = (event) => {
    let value = event.target.value;
    if (value.length === 2 && !value.includes('/')) {
      value += '/';
    } else if (value.length === 3 && value.endsWith('/')) {
      value = value.slice(0, -1);
    }
    setPaymentInfo({...paymentInfo, expiryDate: value});
  };

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: '8px',
        // boxShadow: 24,
        p: 4,
        gap: 2,
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
        label="Expiry Date"
        placeholder="MM/YY"
        value={paymentInfo?.expiryDate}
        onChange={handleExpiryDateChange}
      />
      <TextField
        label="Zip"
        type="number"
        value={paymentInfo?.zipcode}
        onChange={(event) => setPaymentInfo({...paymentInfo, zipcode: event.target.value})}
      />
      <Button
        onClick={handleSubmit}
        variant={"contained"}
        disabled={loading}
      >
        {loading ? "Loading..." : "Submit Payment"}
      </Button>
    </Box>
  );
}