import React, { useEffect } from 'react';
import {
  Alert,
  Box,
  Button, Divider,
  TextField,
  Typography,
  Modal,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import SelectCustomer from '../../componants/SelectCustomer';
import Shipping from "../../componants/Shipping";
import AddressForm from "../../componants/AddressForm";
import {
  addCheckoutBillingAddress,
  addShippingOptions,
  createCart, createOrder,
  createShippingConsignments,
  getCheckout,
  getOrder
} from "../../bigCommerce/orders/orders";
import {ShippingOptions} from "../../componants/ShippingOptions";
import {processOrderPayment} from "../../bigCommerce/payment/payments";
import { setCart, setOrder, setCheckout } from '../../redux/bigCommerce/newOrderSlice';
import FloatOrderDetails from '../../componants/floatOrderDetails';
import CreateAddress from '../../componants/CreateAddress';


const createDefaultConsignment = (id) => {
  return {
    "internalId": id,
    "address": null,
    "items": []
  }
}

let consignmentInteralId = 0

export default function NewOrderIndex() {

  const dispatch = useDispatch();
  const customers = useSelector((state) => state.data.customers);
  const products = useSelector((state) => state.data.products);
  const order = useSelector((state) => state.newOrders.order);

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
  
  const [orderCreated, setOrderCreated] = React.useState(false);

  useEffect(() => {
    console.log("Updated"); 
  }, []);

  const resetPage = () => {
    setError(null);
    setCustomer(null);
    setBilling(null);
    setConsignments([]);
    setAPIConsignments([]);
    setConsignmentToShippingMapping({});
    setCheckoutId(null);
    dispatch(setCart(null));
    dispatch(setOrder(null));
    dispatch(setCheckout(null));
  }

  const resetOrder = () => {
    setOrderId(null);
    setPaymentInfo(null);
    setOrderCreated(false);
  }

  const addConsignment = () => {
    setConsignments([...consignments, createDefaultConsignment(consignmentInteralId)]);
    consignmentInteralId++;
  }

  const removeConsignment = (internalId) => {
    setConsignments(consignments.filter((consignment) => consignment.internalId !== internalId));
  }

  const updateConsignmentShippingAddress = (internalId, address) => {
    setConsignments(consignments.map((consignment) => {
      if (consignment.internalId === internalId) {
        return {...consignment, address};
      }
      return consignment;
    }));
  }

  const updateConsignmentItems = (internalId, items) => {
    setConsignments(consignments.map((consignment) => {
      if (consignment.internalId === internalId) {
        return {...consignment, items};
      }
      return consignment;
    }));
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

  const setShippingOption = (consignmentId, shippingOptionId) => {
    setConsignmentToShippingMapping({...consignmentToShippingMapping, [consignmentId]: shippingOptionId});
  }

  const handleSubmit = async () => {

    try {
      setLoading(true);
      setError(null);

      if (consignments.some((consignment) => !consignment.address || consignment.items.length === 0)) {
        setError("Invalid consignments. check address and items.");
        return
      }

      // Create Cart
      const cart = await createCart({
        customerId: customer.id,
        items: consignments.flatMap((consignment) => consignment.items)
      });
      const checkoutId = cart.data.id;
      dispatch(setCart(cart.data));

      // Create Consignments
      const consignmentResponse = await createShippingConsignments({
        checkoutId,
        consignments,
        cartLineItems: cart.data.line_items
      });

      dispatch(setCheckout(consignmentResponse.data));

      // consignmentResponse.data.consignments.
      setAPIConsignments(consignmentResponse.data.consignments);

      setCheckoutId(checkoutId);

    } catch (error) {
      const data = error.response.data;
      setError(JSON.stringify(data?.title));
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateOrder = async () => {

    try {
      setLoading(true);
      setError(null);

      if (orderId) {
        setError("Order already created!");
        return;
      }


      let checkout = await addCheckoutBillingAddress({checkoutId, billingAddress: billing});
      dispatch(setCheckout(checkout));

      await addShippingOptions({checkoutId, consignmentToShippingMapping});
      checkout = await getCheckout({checkoutId});
      dispatch(setCheckout(checkout));

      const responseOrderId = await createOrder({checkoutId});
      setOrderId(responseOrderId);
      setOrderCreated(true);
      
      
      const order = await getOrder({orderId: responseOrderId});
      dispatch(setOrder(order));


    } catch (error) {
      const data = error.response.data;
      setError(JSON.stringify(data?.title));
      setLoading(false);
    }
    finally {
      setLoading(false);
    }

  }

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!orderId || !paymentInfo) {
        setError("provide payment info!");
        return;
      }

      if (orderId && paymentInfo) {
        await processOrderPayment({orderId, paymentInfo});
      }

      setPaymentModalOpen(false);
      resetOrder();
      resetPage();

    } catch (error) {
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
      <FloatOrderDetails />
      {error && (
        <Alert
          severity="error"
          onClose={() => setError(null)}
          sx={{
            position: 'fixed',
            top: '16px',
            right: '16px',
            zIndex: 9999,
          }}
        >
          {error}
        </Alert>
      )}
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
          <SelectCustomer customers={customers} customer={customer} setCustomer={setCustomer} />
          <CreateAddress customerId={customer?.id} />
          <Button color={'error'} onClick={resetPage}>
            RESET
          </Button>
        </Box>
        <Divider />
        {!orderCreated && (
          <>
            <AddressForm title={"Billing Address"} customerId={customer?.id} address={billing} setAddress={setBilling} />
          <Divider />

          <Typography variant="h6">Shipping Addresses</Typography>
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
              <Shipping 
                key={consignment.internalId} 
                customerId={customer?.id} 
                products={products} 
                consignment={consignment} 
                updateConsignmentShippingAddress={updateConsignmentShippingAddress}
                updateConsignmentItems={updateConsignmentItems}
                removeConsignment={removeConsignment} 
              />
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
          <ShippingOptions APIConsignments={APIConsignments} setShippingOption={setShippingOption} />
          <Divider />
          <Button
            size={"large"}
            onClick={handleCreateOrder}
            disabled={disableCreateOrder()}
          >
            {loading ? "Loading..." : "Create Order"}
          </Button>
          </>
        )}

        {orderCreated && (
          <Box sx={{ padding: 2 }}>
            <Typography variant="h4">Order Summary</Typography>
            <Divider />
            {/* You would replace the following with your actual order summary display */}
            <Typography variant="body1">Order ID: {orderId}</Typography>
            <Typography variant="body1">Customer: {customer.first_name} {customer.last_name}</Typography>
            <Typography variant="body1">Billing Address: {billing.address1}, {billing.city}</Typography>
            <Typography variant="body1">Total: {order.total_inc_tax}</Typography>
            <Typography variant="body1">Status: {order.status}</Typography>
          </Box>
        )}
        
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
      </Box>

    </>
  )
}
