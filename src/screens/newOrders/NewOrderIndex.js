import React, { useEffect } from 'react';
import {
  Alert,
  Box,
  Button, Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid, Paper,
  Radio,
  RadioGroup, Table, TableCell,
  TableContainer, TableHead, TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import NewOrderBillingForm from '../../componants/NewOrderBillingForm';
import NewOrderShippingForm from '../../componants/NewOrderShippingForm';
import NewOrderLineItems from '../../componants/NewOrderLineItems';
import { setShippingInfo } from '../../redux/bigCommerce/newOrderSlice';
import { newOrder } from '../../bigCommerce/orders/orders.post';
import SelectCustomer from '../../componants/SelectCustomer';
import AddressFormOld from "../../componants/AddressFormOld";
import Shipping from "../../componants/Shipping";
import AddressForm from "../../componants/AddressForm";
import {
  addCheckoutBillingAddress,
  addShippingOption,
  createCart, createOrder,
  createShippingConsignments
} from "../../bigCommerce/orders/orders";
import {ShippingOptions} from "../../componants/ShippingOptions";


const createDefaultConsignment = (id) => {
  return {
    "internalId": id,
    "address": {},
    "lineItems": []
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



  const resetPage = () => {
    setError(null);
    setCustomer(null);
    setBilling(null);
    setConsignments([]);
    setAPIConsignments([]);
    setConsignmentToShippingMapping({});
    setCheckoutId(null);
  }

  const addConsignment = () => {
    setConsignments([...consignments, createDefaultConsignment(consignmentInteralId)]);
    consignmentInteralId++;
  }

  const removeConsignment = (internalId) => {
    setConsignments(consignments.filter((consignment) => consignment.internalId !== internalId));
  }

  useEffect(() => {
    console.log('consignments', consignments);
  }, [consignments]);


  const handleSubmit = async () => {

    try {
      setLoading(true);
      setError(null);

      // Create Cart
      const cart = await createCart({
        customerId: customer.id,
        lineItems: consignments.flatMap((consignment) => consignment.lineItems)
      });
      console.log("cart", cart)
      const checkoutId = cart.data.id;

      await addCheckoutBillingAddress({checkoutId, billingAddress: billing});

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

    consignmentToShippingMapping.forEach(async (consignmentId, shippingOptionId) => {
      await addShippingOption({checkoutId, consignmentId, shippingOptionId});
    });

    await createOrder({checkoutId});

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
        <Button
          size={"large"}
          onClick={handleSubmit}
        >
          Create Cart and Get Shipping Options
        </Button>
        <ShippingOptions APIConsignments={APIConsignments} setConsignmentIdToShippingMapping={setConsignmentToShippingMapping} />
        <Button
          size={"large"}
          onClick={handleCreateOrder}
          sx={{
            backgroundColor: 'green',
            color: 'white'
          }}
        >
          Create Order
        </Button>
      </Box>

    </>
  )
}
