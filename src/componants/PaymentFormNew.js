import {Box, Button, TextField, Typography} from "@mui/material";
import React, { useRef } from "react";

export function PaymentFormNew({
  order,
  customerName = null,
  billingZipCode = null,
  submitPayment,
}) {

  const [paymentInfo, setPaymentInfo] = React.useState({
    nameOnCard: customerName,
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    zipcode: billingZipCode,
  });
  const [loading, setLoading] = React.useState(false);

  const nameOnCardRef = useRef();
  const cardNumberRef = useRef();
  const expiryDateRef = useRef();
  const cvvRef = useRef();
  const zipcodeRef = useRef();
  const submitButtonRef = useRef();

  const handleSubmit = async () => {
    let updatedPaymentInfo = {...paymentInfo};
    if (paymentInfo.expiryDate) {
      const [expiryMonth, expiryYear] = paymentInfo.expiryDate.split('/');
      const fullExpiryYear = `20${expiryYear}`;
      updatedPaymentInfo = {...paymentInfo, expiryMonth, expiryYear: fullExpiryYear};
    }
    setLoading(true);
    try {
      await submitPayment(updatedPaymentInfo);
      setLoading(false);
      setPaymentInfo({
        nameOnCard: customerName,
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        zipcode: billingZipCode,
      })
    } catch (error) {
      setLoading(false);
    }
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

  const handleKeyDown = (event, nextRef) => {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      nextRef.current.focus();
    }
  };

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: '8px',
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
        inputRef={nameOnCardRef}
        onKeyDown={(event) => handleKeyDown(event, cardNumberRef)}
      />
      <TextField
        label="Card Number"
        type="number"
        value={paymentInfo?.cardNumber}
        onChange={(event) => setPaymentInfo({...paymentInfo, cardNumber: event.target.value})}
        inputRef={cardNumberRef}
        onKeyDown={(event) => handleKeyDown(event, expiryDateRef)}
      />
      <TextField
        label="Expiry Date"
        placeholder="MM/YY"
        value={paymentInfo?.expiryDate}
        onChange={handleExpiryDateChange}
        inputRef={expiryDateRef}
        onKeyDown={(event) => handleKeyDown(event, cvvRef)}
      />
      <TextField
        label="CVV"
        type="number"
        value={paymentInfo?.cvv}
        onChange={(event) => setPaymentInfo({...paymentInfo, cvv: event.target.value})}
        inputRef={cvvRef}
        onKeyDown={(event) => handleKeyDown(event, zipcodeRef)}
      />
      <TextField
        label="Zip"
        type="number"
        value={paymentInfo?.zipcode}
        onChange={(event) => setPaymentInfo({...paymentInfo, zipcode: event.target.value})}
        inputRef={zipcodeRef}
        onKeyDown={(event) => handleKeyDown(event, submitButtonRef)}
      />
      <Button
        onClick={handleSubmit}
        variant={"contained"}
        disabled={loading}
        ref={submitButtonRef}
      >
        {loading ? "Loading..." : "Submit Payment"}
      </Button>
    </Box>
  );
}