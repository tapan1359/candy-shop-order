import React, {useEffect, useState} from 'react';
import {Stepper, Step, StepLabel, Button, StepContent, Box, Typography} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import SelectOrCreateCustomer from "../../componants/NewOrder/SelectOrCreateCustomer";
import SelectOrCreateBillingAddress from "../../componants/NewOrder/SelectOrCreateBillingAddress";
import AddConsignments from "../../componants/NewOrder/AddConsignments";
import CreateCartAndShowShippingOptions from "../../componants/NewOrder/CreateCartAndShowShippingOptions";
import CreateOrder from "../../componants/NewOrder/CreateOrder";
import AddPayment from "../../componants/NewOrder/AddPayment";
import CustomAlert from "../../CustomAlert";
import {
  addCheckoutBillingAddress, addShippingOptions,
  createCart, createOrder,
  createPickupConsignments,
  createShippingConsignments, getCheckout, getOrder, updateOrderBillingAddressZipCode
} from "../../bigCommerce/orders/orders";
import {setCart, setCheckout, setOrder} from "../../redux/bigCommerce/newOrderSlice";
import {processOrderPayment} from "../../bigCommerce/payment/payments";
import Cart from "../../componants/Cart";


export default function NewOrder() {
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);

  // Data
  const customers = useSelector((state) => state.data.customers);
  const products = useSelector((state) => state.data.products);
  const order = useSelector((state) => state.newOrders.order);

  const [alertMessage, setAlertMessage] = useState(null);

  // step 0
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // step 1
  const [selectedBillingAddress, setSelectedBillingAddress] = useState(null);

  // step 2
  const [pickupConsignment, setPickupConsignment] = React.useState({
    items: []
  });
  const [consignments, setConsignments] = React.useState([]);

  // step 3
  const [APIConsignments, setAPIConsignments] = React.useState([]);
  const [checkoutId, setCheckoutId] = React.useState(null);
  const [consignmentToShippingMapping, setConsignmentToShippingMapping] = React.useState({});
  const [fullfillmentType, setFullfillmentType] = React.useState("shipping");


  // step 4
  const [orderId, setOrderId] = React.useState(null);
  const [orderCreated, setOrderCreated] = React.useState(false);

  useEffect(() => {
    console.log("pickup", activeStep);
  }, [activeStep]);

  const steps = [
    'Select Customer',
    'Billing Address',
    'Add Products',
    'Create Cart',
    'Create Order',
    'Add Payment',
  ];

  const handleShippingCart = async () => {
    if (fullfillmentType === "shipping") {
      await createShippingCart();

    } else {
      await createPickupCart();
    }
  }

  const createPickupCart = async () => {
    try {
      setAlertMessage(null);
      setCheckoutId(null);
      setAPIConsignments([]);

      if (pickupConsignment.items.length === 0) {
        setAlertMessage({message: "Invalid consignments. check items.", severity: "error"});
        return
      }

      const cart = await createCart({
        customerId: selectedCustomer.id,
        items: pickupConsignment.items
      });
      const checkoutId = cart.data.id;
      dispatch(setCart(cart.data));


      const consignmentResponse = await createPickupConsignments({
        checkoutId,
        lineItems: cart.data.line_items
      });

      setAlertMessage({message: "Cart Created!", severity: "success"});

      dispatch(setCheckout(consignmentResponse.data));

      // consignmentResponse.data.consignments.
      setAPIConsignments(consignmentResponse.data.consignments);

      setCheckoutId(checkoutId);
      setActiveStep(4)

    } catch (error) {
      const data = error.response.data;
      setAlertMessage({message: JSON.stringify(data?.title), severity: "error"});
    }
  }

  const createShippingCart = async () => {

    try {
      setAlertMessage(null);

      setCheckoutId(null);
      setAPIConsignments([]);

      if (consignments.some((consignment) => !consignment.address || consignment.items.length === 0)) {
        setAlertMessage({message: "Invalid consignments. check address and items.", severity: "error"});
        return
      }



      // Create Cart
      const cart = await createCart({
        customerId: selectedCustomer.id,
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
    }
  }

  const handleCreateOrder = async () => {

    try {
      setAlertMessage(null);

      if (orderId) {
        setAlertMessage({message: "Order already created!", severity: "error"});
        return;
      }


      let checkout = await addCheckoutBillingAddress({checkoutId, billingAddress: selectedBillingAddress});
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
      setActiveStep(5)


    } catch (error) {
      console.log(error);
      const data = error.response.data;
      setAlertMessage({message: JSON.stringify(data?.title), severity: "error"});
    }

  }

  const handlePayment = async (paymentInfo) => {
    try {
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
      resetPage();

    } catch (error) {
      const data = error.response.data;
      setAlertMessage({message: JSON.stringify(data?.title), severity: "error"});
    }
  }

  const resetPage = () => {
    setAlertMessage(null);
    setSelectedCustomer(null);
    setSelectedBillingAddress(null);
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
    setActiveStep(0);
    setAlertMessage({severity: "success", message: "Page Reset!"})
  }


  const setShippingOption = (consignmentId, shippingOptionId) => {
    setConsignmentToShippingMapping({...consignmentToShippingMapping, [consignmentId]: shippingOptionId});
  }
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <SelectOrCreateCustomer
            customers={customers}
            selectedCustomer={selectedCustomer}
            setSelectedCustomer={setSelectedCustomer}
            setSelectedBillingAddress={setSelectedBillingAddress}
          />
        );
      case 1:
        return <SelectOrCreateBillingAddress
          selectedCustomer={selectedCustomer}
          selectedBillingAddress={selectedBillingAddress}
          setSelectedBillingAddress={setSelectedBillingAddress}
        />;
      case 2:
        return <AddConsignments
          products={products}
          pickupConsignment={pickupConsignment}
          setPickupConsignment={setPickupConsignment}
          consignments={consignments}
          setConsignments={setConsignments}
          customer={selectedCustomer}
          fullfillmentType={fullfillmentType}
          setFullfillmentType={setFullfillmentType}
        />;
      case 3:
        return <CreateCartAndShowShippingOptions
          createShippingCart={handleShippingCart}
          APIConsignments={APIConsignments}
          setShippingOption={setShippingOption}
          fullfillmentType={fullfillmentType}
        />;
      case 4:
        return <CreateOrder
          handleCreateOrder={handleCreateOrder}
        />;
      case 5:
        return <AddPayment
          order={order}
          handleSubmitPayment={handlePayment}
        />;
      default:
        return 'Unknown step';
    }
  };

  const handleNext = () => {
    if (activeStep === 0 && selectedCustomer === null) {
      setAlertMessage({severity: "error", message: "Please select a customer"});
    }
    else if (activeStep === 1 && selectedBillingAddress === null) {
      setAlertMessage({severity: "error", message: "Please select a billing address"});
    } else if (activeStep === 2 && (consignments.length === 0 && pickupConsignment.items.length === 0)) {
      setAlertMessage({severity: "error", message: "Please add products to consignment"});
    } else if (activeStep === 3 && (!checkoutId || !consignmentToShippingMapping)) {
      setAlertMessage({severity: "error", message: "Please create cart and select shipping options"});
    } else if (activeStep === 4 && !orderId) {
      setAlertMessage({severity: "error", message: "Please create order"});
    } else {
      setAlertMessage(null);
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    console.log(activeStep, checkoutId);
    if (activeStep === 3 && checkoutId) {
      setAlertMessage({severity: "warning", message: "Checkout was cancelled. Create Cart again after making changes!"})
      setCheckoutId(null);
      setAPIConsignments([]);
      setOrderId(null);
    }
    setActiveStep((prevActiveStep) => prevActiveStep - 1);

  };

  return (
    <Box>
      {alertMessage && (
        <CustomAlert
          severity={alertMessage.severity}
          message={alertMessage.message}
          onClose={() => setAlertMessage(null)}
        />
      )}
      <Box
        sx={{ border: '1px solid black', padding: 2, marginBottom: 2, display: 'flex', justifyContent: 'flex-end'}}
      >
        <Button
          sx={{ backgroundColor: 'red', color: 'white' }}
          variant={"contained"}
          onClick={resetPage}
        >RESET</Button>
      </Box>
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        gap: "100px",
        padding: "20px",
        border: "1px solid black",
      }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {getStepContent(activeStep)}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
          <Button variant="contained" color="secondary" onClick={handleBack} disabled={activeStep === 0}>
            Back
          </Button>
          <Button variant="contained" color="primary" onClick={handleNext} disabled={activeStep === 5}>
            Next
          </Button>
        </Box>
      </Box>
      {/*<Box*/}
      {/*  sx={{*/}
      {/*    display: 'flex',*/}
      {/*    flexDirection: 'row',*/}
      {/*    gap: 2,*/}
      {/*    padding: 2,*/}
      {/*    border: '1px solid black',*/}
      {/*    marginTop: 2,*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <Box*/}
      {/*    sx={{*/}
      {/*      borderRight: '1px solid gray',*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    {selectedCustomer && (*/}
      {/*      <Box>*/}
      {/*        <Typography variant="subtitle1">Selected Customer: </Typography>*/}
      {/*        <Typography sx={{fontSize: '1rem'}}>{selectedCustomer.first_name} {selectedCustomer.last_name}</Typography>*/}
      {/*        <Typography sx={{fontSize: '1rem'}}>{selectedCustomer.email}</Typography>*/}
      {/*      </Box>*/}
      {/*    )}*/}
      {/*    {selectedBillingAddress && (*/}
      {/*      <Box>*/}
      {/*        <Typography variant="subtitle1">Billing Address</Typography>*/}
      {/*        <Typography sx={{fontSize: '1rem'}}  >{selectedBillingAddress.address1}</Typography>*/}
      {/*        <Typography sx={{fontSize: '1rem'}}  >{selectedBillingAddress.address2}</Typography>*/}
      {/*        <Typography sx={{fontSize: '1rem'}} >{selectedBillingAddress.city}, {selectedBillingAddress.state_or_province} {selectedBillingAddress.postal_code}</Typography>*/}
      {/*      </Box>*/}
      {/*    )}*/}
      {/*  </Box>*/}
      {/*  <Box*/}
      {/*    sx={{*/}
      {/*      borderRight: '1px solid gray',*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    {fullfillmentType === "pickup" && pickupConsignment.items?.length > 0 && (*/}
      {/*      <Box>*/}
      {/*        <Typography variant="subtitle1">Pickup Products</Typography>*/}
      {/*        {pickupConsignment.items.map((item, index) => (*/}
      {/*          <Box key={index} sx={{borderBottom: '1px solid gray',}}>*/}
      {/*            <Typography sx={{fontSize: '1rem'}}>{index+1}. {item.name}, {item.sku}, #{item.quantity}, ${item.total}</Typography>*/}
      {/*          </Box>*/}
      {/*        ))}*/}
      {/*      </Box>*/}
      {/*    )}*/}
      {/*    {fullfillmentType === "shipping" && consignments?.length > 0 && (*/}
      {/*      consignments.map((consignment, index) => (*/}
      {/*        <Box key={index}>*/}
      {/*          <Typography variant="subtitle1">Shipping Products</Typography>*/}
      {/*          {consignment.items.map((item, index) => (*/}
      {/*            <Box key={index}>*/}
      {/*              <Typography sx={{fontSize: '1rem'}}>{index} {item.name}, {item.sku} {item.quantity} {item.total}</Typography>*/}
      {/*            </Box>*/}
      {/*          ))}*/}
      {/*          <Typography variant="subtitle1">Shipping Address</Typography>*/}
      {/*          <Typography sx={{fontSize: '1rem'}}>{consignment?.address?.address1}</Typography>*/}
      {/*          <Typography sx={{fontSize: '1rem'}}>{consignment?.address?.city}, {consignment?.address?.state_or_province} {consignment?.address?.postal_code}</Typography>*/}
      {/*        </Box>*/}
      {/*      ))*/}
      {/*    )}*/}
      {/*  </Box>*/}
      {/*</Box>*/}
    </Box>
  );
}