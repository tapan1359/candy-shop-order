import React, { useEffect } from 'react';
import {
  Alert, Button, Grid, TextField,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import NewOrderBillingForm from '../../componants/NewOrderBillingForm';
import NewOrderShippingForm from '../../componants/NewOrderShippingForm';
import NewOrderLineItems from '../../componants/NewOrderLineItems';
import { setShippingInfo } from '../../redux/bigCommerce/newOrderSlice';
import { newOrder } from '../../bigCommerce/orders/orders.post';
import SelectCustomer from '../../componants/SelectCustomer';

export default function NewOrderIndex() {

  const customers = useSelector((state) => state.data.customers);
  const products = useSelector((state) => state.data.products);

  const cart = useSelector((state) => state.newOrders.cart);
  const [customer_message, setCustomerMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const [customer, setCustomer] = React.useState();
  const [billing, setBilling] = React.useState();
  const [shipping, setShipping] = React.useState();

  useEffect(() => {
    console.log('customer_message', customer_message);
  }, [customer_message]);

  const handleCustomerMessageChange = (e) => {
    setCustomerMessage(e.target.value);
  };

  const handleSubmit = async () => {
    console.log('customer', customer);
    console.log('billing', billing);
    console.log('shipping', shipping);
    // try {
    //   setLoading(true);
    //   setError(null);
    //   await new Promise((resolve, reject) => { setTimeout(resolve, 2000); });
    //   const order = await newOrder({ shippingInfo, cartInfo: cart, giftMessage: customer_message });
    //   console.log('order', order);
    //   if (order.error) {
    //     setError(order.error);
    //     setLoading(false);
    //     console.log('error creating order', order.error);
    //   }
    // } catch (error) {
    //   setError(error);
    //   setLoading(false);
    //   console.log('error creating order', error);
    // } finally {
    //   setLoading(false);
    // }
  };
  return (
    <div>
      <Grid container spacing={3} direction="row" marginBottom={10} width={"90%"}>
        <Grid item xs={12}>
          <SelectCustomer customers={customers} setCustomer={setCustomer} />
        </Grid>
        <Grid item xs={6}>
          <NewOrderBillingForm addresses={customer?.addresses} setBilling={setBilling} />
        </Grid>
        <Grid item xs={6}>
          <NewOrderShippingForm addresses={customer?.addresses} setShipping={setShipping} />
        </Grid>
        <Grid item xs={12}>
          <NewOrderLineItems products={products} />
        </Grid>
        <Grid item xs={12}>
          <TextField label="Gift Message" fullWidth multiline rows={4} value={customer_message} onChange={handleCustomerMessageChange} />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Loading...' : 'Submit'}
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
