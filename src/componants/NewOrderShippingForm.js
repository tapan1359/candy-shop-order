import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import {Box, Button, Grid, TextField, Paper, Typography, Select, MenuItem, FormControl, InputLabel, Input, Autocomplete} from '@mui/material';
import { getCustomerAddresses, getCustomers } from '../bigCommerce/customers/customers.get';
import { setCustomers, setBillingInfo, setAddressBook, setShippingInfo } from './../redux/bigCommerce/newOrderSlice';



export default function NewOrderShippingForm() {
  const addressBook = useSelector((state) => state.newOrders.addressBook);
  const dispatch = useDispatch();
  const shipppingInfo = useSelector((state) => state.newOrders.shipppingInfo);
  const [shipping, setShipping] = useState(shipppingInfo);
  const billingInfo = useSelector((state) => state.newOrders.billingInfo);

  useEffect(() => {
    if (billingInfo?.customer_id) {
        handleSearchAddresses({'customer_id:in': billingInfo.customer_id});
    }else{
      handleBillingIdChange()
    }
  }, [billingInfo]);

  useEffect(() => {
    console.log('shipppingInfo', shipping);
  }, [shipping]);
 
  const handleSearchAddresses = async (params) => {
    const response = await getCustomerAddresses(params);
    dispatch(setAddressBook(response.data));
  
  }
  // {
//     "id": 1,
//     "address1": "789 Elm Street",
//     "address2": "",
//     "address_type": "residential",
//     "city": "San Francisco",
//     "company": "Tech Solutions",
//     "country": "United States",
//     "country_code": "US",
//     "customer_id": 1,
//     "first_name": "Alexander",
//     "last_name": "Wilson",
//     "phone": "555-222-3333",
//     "postal_code": "94111",
//     "state_or_province": "California"
// }
  const handleBillingIdChange = async (customer) => {  
    
    setShipping({
      first_name: customer?.first_name || '',
      last_name: customer?.last_name || '',
      address1: customer?.address1 || '',
      address2: customer?.address2 || '',
      city: customer?.city || '',
      state: customer?.state_or_province || '',
      zip: customer?.postal_code || '',
      country: customer?.country || 'United States',
      phone: customer?.phone || '',
      customer_id: customer?.customer_id || '',
    });
    dispatch(setShippingInfo({
      first_name: customer?.first_name || '',
      last_name: customer?.last_name || '',
      street_1: customer?.address1 || '',
      street_2: customer?.address2 || '',
      city: customer?.city || '',
      state: customer?.state_or_province || '',
      zip: customer?.postal_code || '',
      country: customer?.country || 'United States',
      phone: customer?.phone || '',
      customer_id: customer?.customer_id || '',
    }));
  }

  const handleBillingInfoChange = (event) => {
    console.log('event.target.name', event.target.name);  
    setShipping({
      ...shipping,
      [event.target.name]: event.target.value,
    });
    dispatch(setShippingInfo({
      ...shipping,
      [event.target.name]: event.target.value,
    }));
    // handleSearchCustomers({search: event.target.value});
  }

  return (
      <Grid container spacing={2} margin={2}>
        {/* Shipping Form Label */}
        <Grid item xs={12}>
          <Typography variant="h6">Shipping Address</Typography>
        </Grid>
        <Grid item xs={12}>
            <Autocomplete
            disabled={billingInfo?.customer_id? false : true}
            id="combo-box-demo"
            options={addressBook}
            // value={'Select a Address'}
            
            getOptionLabel={(option) => option.first_name +'' + option.last_name}
            // sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Select a Address" />}
            onChange={(event, newValue) => handleBillingIdChange(newValue)} 
            //when user types then search customer
            // onInputChange={(event, newInputValue) => handleSearchAddresses({'name:in': newInputValue})}
            />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="first_name"
            name="first_name"
            label="First name"
            fullWidth
            autoComplete="given-name"
            value={shipping?.first_name || ''}
            onChange={handleBillingInfoChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="last_name"
            name="last_name"
            label="Last name"
            fullWidth
            autoComplete="family-name"
            value={shipping?.last_name || ''}
            onChange={handleBillingInfoChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="address1"
            name="address1"
            label="Address line 1"
            fullWidth
            autoComplete="shipping address-line1"
            value={shipping?.address1 || ''}
            onChange={handleBillingInfoChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="address2"
            name="address2"
            label="Address line 2"
            fullWidth
            autoComplete="shipping address-line2"
            value={shipping?.address2 || ''}
            onChange={handleBillingInfoChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="city"
            name="city"
            label="City"
            fullWidth
            autoComplete="shipping address-level2"
            value={shipping?.city || ''}
            onChange={handleBillingInfoChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="state"
            name="state"
            label="State/Province/Region"
            fullWidth
            value={shipping?.state || ''}
            onChange={handleBillingInfoChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="zip"
            name="zip"
            label="Zip / Postal code"
            fullWidth
            autoComplete="shipping postal-code"
            value={shipping?.zip || ''}
            onChange={handleBillingInfoChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="country"
            name="country"
            label="country"
            fullWidth
            autoComplete="shipping country"
            value={shipping?.country || ''}
            onChange={handleBillingInfoChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="phone"
            name="phone"
            label="Phone Number"
            fullWidth
            autoComplete="shipping phone"
            value={shipping?.phone || ''}
            onChange={handleBillingInfoChange}
          />
        </Grid>
      </Grid>
  )
}

