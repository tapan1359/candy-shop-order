import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import {Box, Button, Grid, TextField, Paper, Typography, Select, MenuItem, FormControl, InputLabel, Input, Autocomplete} from '@mui/material';
import { getCustomerAddresses, getCustomers } from '../bigCommerce/customers/customers.get';
import { setCustomers, setBillingInfo } from './../redux/bigCommerce/newOrderSlice';



export default function NewOrderBillingForm() {
  const customers = useSelector((state) => state.newOrders.customers);
  const dispatch = useDispatch();
  const billingInfo = useSelector((state) => state.newOrders.billingInfo);
  const [billing, setBilling] = useState(billingInfo);

  useEffect(() => {
    handleSearchCustomers();
  }, []);

  useEffect(() => {
    console.log('billingInfo', billing);
  }, [billing]);
 
  const handleSearchCustomers = async (params) => {
    const response = await getCustomers(params);
    dispatch(setCustomers(response.data));
  
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
    if (customer) {
        const addresses = await getCustomerAddresses({'customer_id:in': customer.id});
        if(addresses.data.length > 0) {
            customer = addresses.data[0];
        }
        console.log('addresses', addresses);
    }
    setBilling({
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
    dispatch(setBillingInfo({
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
    setBilling({
      ...billing,
      [event.target.name]: event.target.value,
    });
    dispatch(setBillingInfo({
      ...billing,
      [event.target.name]: event.target.value,
    }));
    // handleSearchCustomers({search: event.target.value});
  }

  return (
      <Grid container spacing={2} margin={2}>
          <Grid item xs={12}>
            < Typography variant="h6">Biiling Address</Typography>
          </Grid>
        <Grid item xs={12}>
            <Autocomplete
            id="combo-box-demo"
            options={customers}
            getOptionLabel={(option) => option.first_name +'' + option.last_name}
            // sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Combo box" />}
            onChange={(event, newValue) => handleBillingIdChange(newValue)} 
            //when user types then search customer
            onInputChange={(event, newInputValue) => handleSearchCustomers({'name:like': newInputValue})}
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
            value={billing?.first_name || ''}
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
            value={billing?.last_name || ''}
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
            value={billing?.address1 || ''}
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
            value={billing?.address2 || ''}
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
            value={billing?.city || ''}
            onChange={handleBillingInfoChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="state"
            name="state"
            label="State/Province/Region"
            fullWidth
            value={billing?.state || ''}
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
            value={billing?.zip || ''}
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
            value={billing?.country || ''}
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
            value={billing?.phone || ''}
            onChange={handleBillingInfoChange}
          />
        </Grid>
      </Grid>
  )
}

