import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box, Button, Grid, TextField, Paper, Typography, Select, MenuItem, FormControl, InputLabel, Input, Autocomplete,
} from '@mui/material';
import { getCustomerAddresses, getCustomers } from '../bigCommerce/customers/customers.get';
import { setCustomers, setBillingInfo } from '../redux/bigCommerce/newOrderSlice';

const billingInfoEmpty = {
  first_name: '',
  last_name: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  zip: '',
  country: '',
  phone: '',
};

export default function NewOrderBillingForm({ customers, setCustomer }) {
  const dispatch = useDispatch();
  const [billing, setBilling] = useState(billingInfoEmpty);

  useEffect(() => {
    console.log('billingInfo', billing);
  }, [billing]);

  const handleBillingIdChange = async (customer) => {
    if (customer) {
      console.log('cus', customer);
      const address = customer.addresses[0];
      console.log('aadd', address);
      setBilling({
        first_name: customer.first_name,
        last_name: customer.last_name,
        address1: address.address1,
        address2: address.address2,
        city: address.city,
        state: address.state_or_province,
        zip: address.postal_code,
        country: address.country,
        phone: customer.phone,
      });
      setCustomer(customer);
    }
  };

  return (
    <Grid container spacing={2} margin={2}>
      <Grid item xs={12}>
        <Typography variant="h6">Biiling Address</Typography>
      </Grid>
      <Grid item xs={12}>
        <Autocomplete
          id="combo-box-demo"
          options={customers}
          getOptionLabel={(option) => `${option.first_name}${option.last_name}`}
            // sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Search by customer Name/Phone Number" />}
          onChange={(event, newValue) => handleBillingIdChange(newValue)}
          filterOptions={(options, state) => options.filter((option) => option.first_name.toLowerCase().includes(state.inputValue.toLowerCase()) || option.last_name.toLowerCase().includes(state.inputValue.toLowerCase()) || option.phone.toLowerCase().includes(state.inputValue.toLowerCase()) || option.email.toLowerCase().includes(state.inputValue.toLowerCase()))}
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
          value={billing.first_name}
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
          value={billing.last_name}
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
          value={billing.address1}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          id="address2"
          name="address2"
          label="Address line 2"
          fullWidth
          autoComplete="shipping address-line2"
          value={billing.address2}
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
          value={billing.city}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          id="state"
          name="state"
          label="State/Province/Region"
          fullWidth
          value={billing.state}
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
          value={billing.zip}
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
          value={billing.country}
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
          value={billing.phone}
        />
      </Grid>
    </Grid>
  );
}
