import React, { useEffect } from 'react';
import {
  Alert,
  Box,
  Button, Divider,
  TextField,
  Typography,
  Modal,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import SelectCustomer from '../../componants/SelectCustomer';
import Shipping from "../../componants/Shipping";
import Pickup from "../../componants/Pickup";
import AddressForm from "../../componants/AddressForm";
import {
  addCheckoutBillingAddress,
  addShippingOptions,
  createCart, createOrder,
  createShippingConsignments,
  getCheckout,
  getOrder,
  createPickupConsignments,
  updateOrderBillingAddressZipCode
} from "../../bigCommerce/orders/orders";
import {ShippingOptions} from "../../componants/ShippingOptions";
import {processOrderPayment} from "../../bigCommerce/payment/payments";
import { setCart, setOrder, setCheckout } from '../../redux/bigCommerce/newOrderSlice';
import FloatOrderDetails from '../../componants/floatOrderDetails';
import CreateAddress from '../../componants/CreateAddress';
import CreateCustomer from '../../componants/CreateCustomer';
import CustomAlert from "../../CustomAlert";
import {PaymentFormNew} from "../../componants/PaymentFormNew";


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
  const [customer, setCustomer] = React.useState(null);
  const [billing, setBilling] = React.useState(null);
  const [consignments, setConsignments] = React.useState([]);
  const [APIConsignments, setAPIConsignments] = React.useState([]);
  const [consignmentToShippingMapping, setConsignmentToShippingMapping] = React.useState({});
  const [checkoutId, setCheckoutId] = React.useState(null);
  const [orderId, setOrderId] = React.useState(null);
  const [paymentModalOpen, setPaymentModalOpen] = React.useState(false);
  const [fullfillmentType, setFullfillmentType] = React.useState("shipping");
  const [pickupConsignment, setPickupConsignment] = React.useState({
    items: []
  });
  
  const [orderCreated, setOrderCreated] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState(null);

  const resetPage = () => {
    setAlertMessage(null);
    setCustomer(null);
    setBilling(null);
    setConsignments([]);
    setAPIConsignments([]);
    setConsignmentToShippingMapping({});
    setCheckoutId(null);
    dispatch(setCart(null));
    dispatch(setOrder(null));
    dispatch(setCheckout(null));
    setOrderId(null);
    setOrderCreated(false);
    setPickupConsignment({items: []});
    setFullfillmentType("shipping");
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

  const updatePickupConsignmentItems = (items) => {
    setPickupConsignment({...pickupConsignment, items});
  }

  const disableShippingCart = () => {
    if (!customer || !billing || consignments.length === 0) {
      return true;
    }
  }

  const disablePickupCart = () => {
    console.log(pickupConsignment.items.length);
    console.log(customer);
    if (!customer || pickupConsignment.items.length === 0) {
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

  const handlePickupCart = async () => {
    try {
      setLoading(true);
      setAlertMessage(null);

      if (pickupConsignment.items.length === 0) {
        setAlertMessage({message: "Invalid consignments. check items.", severity: "error"});
        return
      }

      const cart = await createCart({
        customerId: customer.id,
        items: pickupConsignment.items
      });
      const checkoutId = cart.data.id;
      dispatch(setCart(cart.data));


      const consignmentResponse = await createPickupConsignments({
        checkoutId,
        lineItems: cart.data.line_items
      });

      setAlertMessage({message: "Cart and Consignments created!", severity: "success"});

      dispatch(setCheckout(consignmentResponse.data));

      // consignmentResponse.data.consignments.
      setAPIConsignments(consignmentResponse.data.consignments);

      setCheckoutId(checkoutId);

    } catch (error) {
      const data = error.response.data;
      setAlertMessage({message: JSON.stringify(data?.title), severity: "error"});
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  const handleShippingCart = async () => {

    try {
      setLoading(true);
      setAlertMessage(null);

      if (consignments.some((consignment) => !consignment.address || consignment.items.length === 0)) {
        setAlertMessage({message: "Invalid consignments. check address and items.", severity: "error"});
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



      setAlertMessage({message: "Cart and Consignments created!", severity: "success"});

      dispatch(setCheckout(consignmentResponse.data));

      // consignmentResponse.data.consignments.
      setAPIConsignments(consignmentResponse.data.consignments);

      setCheckoutId(checkoutId);

    } catch (error) {
      const data = error.response.data;
      setAlertMessage({message: JSON.stringify(data?.title), severity: "error"});
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateOrder = async () => {

    try {
      setLoading(true);
      setAlertMessage(null);

      if (orderId) {
        setAlertMessage({message: "Order already created!", severity: "error"});
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
      
      setAlertMessage({message: "Order created!", severity: "success"});
      
      const order = await getOrder({orderId: responseOrderId});
      dispatch(setOrder(order));


    } catch (error) {
      console.log(error);
      const data = error.response.data;
      setAlertMessage({message: JSON.stringify(data?.title), severity: "error"});
      setLoading(false);
    }
    finally {
      setLoading(false);
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
        setAlertMessage({message: "ZipCode is different than billing. Error updating zip", severity: "error"});
        return;
      }
 

      if (orderId && paymentInfo) {
        await processOrderPayment({orderId, paymentInfo});
      }

      setAlertMessage({message: "Payment processed!", severity: "success"});
      setPaymentModalOpen(false);
      resetPage();

    } catch (error) {
      // const data = error.response.data;
      setAlertMessage({message: JSON.stringify(error), severity: "error"});
      setLoading(false);
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <>
      <FloatOrderDetails />
      {alertMessage && (
        <CustomAlert
          severity={alertMessage.severity}
          onClose={() => setAlertMessage(null)}
          message={alertMessage.message}
        />
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
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-around',
          }}
        >
          <SelectCustomer customers={customers} customer={customer} setCustomer={setCustomer} />
          <CreateAddress buttonName="New Address" customerId={customer?.id} />
          <CreateCustomer setCustomer={setCustomer} setSelectedBillingAddress={setBilling}/>
          <Button color={'error'} onClick={resetPage}>
            RESET
          </Button>
        </Box>
        <Divider />
        {!orderCreated && (
          <>
            <AddressForm title={"Billing Address"} customerId={customer?.id} address={billing} setAddress={setBilling} />
          <Divider />
          <FormControl>
            <FormLabel>Select Fulfillment Type</FormLabel>
            <RadioGroup
              row
              value={fullfillmentType}
              onChange={(event) => setFullfillmentType(event.target.value)}
            >
              <FormControlLabel value="shipping" control={<Radio />} label="Shipping" />
              <FormControlLabel value="pickup" control={<Radio />} label="Pickup" />
            </RadioGroup>
          </FormControl>
          {fullfillmentType === "pickup" && (
            <>
            <Pickup  
              products={products} 
              consignment={pickupConsignment} 
              updateConsignmentItems={updatePickupConsignmentItems}
            />
            <Divider />
              <Button
                size={"large"}
                onClick={handlePickupCart}
              >
                {loading ? "Loading..." : "Create Cart"}
              </Button>
            </>  
          )}
          {fullfillmentType === "shipping" && (
            <>
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
                Add New Products
              </Button>
              <Divider />
              <Button
                size={"large"}
                onClick={handleShippingCart}
              >
                {loading ? "Loading..." : "Create Cart and Get Shipping Options"}
              </Button>
              <Divider />
              <ShippingOptions APIConsignments={APIConsignments} setShippingOption={setShippingOption} />
            </>
          )}
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
            <Typography variant="body1">Customer: {customer?.first_name} {customer?.last_name}</Typography>
            <Typography variant="body1">Billing Address: {billing?.address1}, {billing?.city}</Typography>
            <Typography variant="body1">Total: {order?.total_inc_tax}</Typography>
            <Typography variant="body1">Status: {order?.status}</Typography>
          </Box>
        )}
        
        <Divider />
        <Button
          size={"large"}
          onClick={() => setPaymentModalOpen(true)}
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
            <PaymentFormNew order={order} submitPayment={handlePayment} />
          </Box>
        </Modal>
      </Box>

    </>
  )
}
