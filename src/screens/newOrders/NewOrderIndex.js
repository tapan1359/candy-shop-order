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
import {addCheckoutBillingAddress, createCart, createShippingConsignments} from "../../bigCommerce/orders/orders";


const createDefaultConsignment = (id) => {
  return {
    "internalId": id,
    "address": {},
    "lineItems": []
  }
}


export default function NewOrderIndex() {

  let consignmentInteralId = 0

  const customers = useSelector((state) => state.data.customers);
  const products = useSelector((state) => state.data.products);

  const cart = useSelector((state) => state.newOrders.cart);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [customer_message, setCustomerMessage] = React.useState('');
  const [customer, setCustomer] = React.useState();
  const [billing, setBilling] = React.useState();
  const [shipping, setShipping] = React.useState();
  const [selectedProducts, setSelectedProducts] = React.useState([]);
  const [consignments, setConsignments] = React.useState([]);

  useEffect(() => {
    console.log('customer_message', customer_message);
  }, [customer_message]);


  const disabledSubmit = () => {
    return loading || !customer || !billing || !shipping || selectedProducts.length === 0;
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

    console.log(consignments)

    try {
      setLoading(true);
      setError(null);

      // Create Cart
      const cart = await createCart({
        customerId: customer.id,
        lineItems: consignments.flatMap((consignment) => consignment.lineItems)
      });

      const checkoutId = cart.data.id;

      await addCheckoutBillingAddress({checkoutId, billing});

      // Create Consignments
      const consignmentResponse = await createShippingConsignments({
        checkoutId,
        consignments,
        cartLineItems: cart.data.line_items
      });

      // consignmentResponse.data.consignments.

    } catch (error) {

      const data = error.response.data;
      setError(JSON.stringify(data?.title));
      setLoading(false);
      console.log('error creating order', error);
    } finally {
      setLoading(false);
    }
  }

  const createOrder = async () => {}

  return (
    <>
      {error && <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh'
        }}
      >
        <SelectCustomer customers={customers} setCustomer={setCustomer} />
        <AddressForm title={"Billing"} addresses={customer?.addresses} setAddress={setBilling} />
        <FormControl>
          <FormLabel id="demo-controlled-radio-buttons-group">Fulfillment Method</FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
          >
            <FormControlLabel value="shipping" control={<Radio />} label="Shipping" />
            <FormControlLabel value="pickup" control={<Radio />} label="Pickup" />
          </RadioGroup>
        </FormControl>

        <Typography variant="h6">Consignments</Typography>
        <Divider />
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
        <Button
          size={"large"}
          onClick={createOrder}
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
