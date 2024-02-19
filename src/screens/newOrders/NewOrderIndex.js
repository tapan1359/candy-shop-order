import React, { useEffect } from 'react';
import {
  Alert,
  Box,
  Button, Divider,
  TextField,
  Typography,
  Modal,
} from '@mui/material';
import { useSelector } from 'react-redux';
import SelectCustomer from '../../componants/SelectCustomer';
import Shipping from "../../componants/Shipping";
import AddressForm from "../../componants/AddressForm";
import {
  addCheckoutBillingAddress,
  addShippingOptions,
  createCart, createOrder,
  createShippingConsignments
} from "../../bigCommerce/orders/orders";
import {ShippingOptions} from "../../componants/ShippingOptions";
import {processOrderPayment} from "../../bigCommerce/payment/payments";


const createDefaultConsignment = (id) => {
  return {
    "internalId": id,
    "address": {},
    "items": []
  }
}

let consignmentInteralId = 0

export default function NewOrderIndex() {

  const customers = useSelector((state) => state.data.customers);
  const products = useSelector((state) => state.data.products);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [customer, setCustomer] = React.useState(null);
  const [billing, setBilling] = React.useState(null);
  const [consignments, setConsignments] = React.useState([]);
  const [APIConsignments, setAPIConsignments] = React.useState([]);
  const [consignmentToShippingMapping, setConsignmentToShippingMapping] = React.useState({});
  const [checkoutId, setCheckoutId] = React.useState(null);
  const [orderId, setOrderId] = React.useState(null);
  const [paymentModalOpen, setPaymentModalOpen] = React.useState(false);
  const [paymentInfo, setPaymentInfo] = React.useState(null);



  const resetPage = () => {
    setError(null);
    setCustomer(null);
    setBilling(null);
    setConsignments([]);
    setAPIConsignments([]);
    setConsignmentToShippingMapping({});
    setCheckoutId(null);
  }

  const resetOrder = () => {
    setOrderId(null);
    setPaymentInfo(null);
  }

  const addConsignment = () => {
    setConsignments([...consignments, createDefaultConsignment(consignmentInteralId)]);
    consignmentInteralId++;
  }

  const removeConsignment = (internalId) => {
    setConsignments(consignments.filter((consignment) => consignment.internalId !== internalId));
  }

  const disableCreateCart = () => {
    if (!customer || !billing || consignments.length === 0) {
      return true;
    }
  }


  const disableCreateOrder = () => {
    if (!checkoutId || !consignmentToShippingMapping) {
      return true;
    }
  }

  const handleSubmit = async () => {

    try {
      setLoading(true);
      setError(null);

      // Create Cart
      const cart = await createCart({
        customerId: customer.id,
        items: consignments.flatMap((consignment) => consignment.items)
      });
      console.log("cart", cart)
      const checkoutId = cart.data.id;

      // Create Consignments
      const consignmentResponse = await createShippingConsignments({
        checkoutId,
        consignments,
        cartLineItems: cart.data.line_items
      });

      // consignmentResponse.data.consignments.
      setAPIConsignments(consignmentResponse.data.consignments);

      setCheckoutId(checkoutId);

    } catch (error) {
      console.log('error creating order', error);
      const data = error.response.data;
      setError(JSON.stringify(data?.title));
      setLoading(false);
      console.log('error creating order', error);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateOrder = async () => {

    try {
      setLoading(true);
      setError(null);

      await addCheckoutBillingAddress({checkoutId, billingAddress: billing});

      await addShippingOptions({checkoutId, consignmentToShippingMapping});

      const orderId = await createOrder({checkoutId});
      setOrderId(orderId);

    } catch (error) {
      console.log('error creating order', error);
      const data = error.response.data;
      setError(JSON.stringify(data?.title));
      setLoading(false);
    }
    finally {
      setLoading(false);
      resetPage();
    }

  }

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      if (orderId && paymentInfo) {
        await processOrderPayment({orderId, paymentInfo});
      }

      setPaymentModalOpen(false);
      resetOrder();

    } catch (error) {
      console.log('error creating order', error);
      const data = error.response.data;
      setError(JSON.stringify(data?.title));
      setLoading(false);
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <>
      {error && <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          paddingTop: 2,
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}
        >
          <SelectCustomer customers={customers} setCustomer={setCustomer} />
          <Button
            color={'error'}
            onClick={resetPage}
          >
            RESET
          </Button>
        </Box>
        <Divider />
        <AddressForm title={"Billing Address"} addresses={customer?.addresses} setAddress={setBilling} />
        <Divider />

        <Typography variant="h6">Consignments</Typography>
        {consignments.map((consignment) => (
          <Box
            key={consignment.internalId}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              padding: 2,
              borderRadius: 2,
            }}
          >
            <Shipping key={consignment.internalId} addresses={customer?.addresses} products={products} consignment={consignment} removeConsignment={removeConsignment} />
          </Box>
        ))}
        <Button
          onClick={addConsignment}
        >
          Add New Consignment
        </Button>
        <Divider />
        <Button
          size={"large"}
          onClick={handleSubmit}
          disabled={disableCreateCart()}
        >
          {loading ? "Loading..." : "Create Cart and Get Shipping Options"}
        </Button>
        <Divider />
        <ShippingOptions APIConsignments={APIConsignments} setConsignmentIdToShippingMapping={setConsignmentToShippingMapping} />
        <Divider />
        <Button
          size={"large"}
          onClick={handleCreateOrder}
          disabled={disableCreateOrder()}
        >
          {loading ? "Loading..." : "Create Order"}
        </Button>
        <Divider />
        <Button
          size={"large"}
          onClick={() => setPaymentModalOpen(true)}
          disabled={!orderId}
        >Add Payment</Button>

        <Modal
          open={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'background.paper',
              borderRadius: '8px',
              boxShadow: 24,
              p: 4,
              top: '50%',
              left: '50%',
              width: 400,
              transform: 'translate(80%, 50%)',
              gap: 2
            }}
          >
            <Typography variant="h6">Payment Info</Typography>
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
      </Box>

    </>
  )
}
