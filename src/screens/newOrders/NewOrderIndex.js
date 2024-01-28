import React, { useEffect } from 'react'
import NewOrderBillingForm from '../../componants/NewOrderBillingForm'
import NewOrderShippingForm from '../../componants/NewOrderShippingForm'
import NewOrderLineItems from '../../componants/NewOrderLineItems'
import { Alert, Button, Grid, TextField } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { setShippingInfo } from '../../redux/bigCommerce/newOrderSlice'
import { newOrder } from '../../bigCommerce/orders/orders.post' 



export default function NewOrderIndex() {
  // const customer_message = useSelector((state) => state.newOrders.shippingInfo.customer_message || '');
  const billingInfo = useSelector((state) => state.newOrders.billingInfo);
  const shippingInfo = useSelector((state) => state.newOrders.shippingInfo);
  const cart = useSelector((state) => state.newOrders.cart);
  const [customer_message, setCustomerMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const dispatch = useDispatch();


  useEffect(() => {
    console.log('customer_message', customer_message);
  }, [customer_message]);


  const handleCustomerMessageChange = (e) => {
    // dispatch(setShippingInfo({ ...shippingInfo, customer_message: e.target.value }));
    setCustomerMessage(e.target.value);
  }

  const handleSubmit = async () => {
    console.log('billingInfo', billingInfo);
    console.log('shippingInfo', shippingInfo);
    console.log('cart', cart);
    try {
      setLoading(true);
      setError(null);
      await new Promise((resolve, reject) => { setTimeout(resolve, 2000) });
      var order = await newOrder({ billingInfo, shippingInfo, cartInfo: cart, giftMessage: customer_message });
      console.log('order', order);
     if (order.error){
      setError(order.error);
      setLoading(false);
      console.log('error creating order', order.error);
     }
    } catch (error) {
      setError(error);  
      setLoading(false);
      console.log('error creating order', error);
    }finally{
      setLoading(false);
    }

  }
  return (
    <div>
      <Alert severity="error" onClose={() => setError(null)}>{error?.message}</Alert>
    <Grid container spacing={3} direction={'row'} marginBottom={10}>
      <Grid item xs={6}>
        <NewOrderBillingForm />
      </Grid>
      <Grid item xs={6}>
        <NewOrderShippingForm />
      </Grid>
      <Grid item xs={12}>
        <NewOrderLineItems />
      </Grid>
      <Grid item xs={12}>
        <TextField label="Notes" fullWidth multiline rows={4} value={customer_message} onChange={handleCustomerMessageChange} />
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
          {loading? 'Loading...' : 'Submit'}
        </Button>
      </Grid>
      {/* {JSON.stringify(billingInfo)}
      {JSON.stringify(shippingInfo)}
      {JSON.stringify(cart)} */}
    </Grid>
    </div>
  )
}
