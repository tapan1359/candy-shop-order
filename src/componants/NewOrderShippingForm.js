import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box, Button, Grid, TextField, Paper, Typography, Select, MenuItem, FormControl, InputLabel, Input, Autocomplete,
} from '@mui/material';
import { getCustomerAddresses, getCustomers } from '../bigCommerce/customers/customers.get';
import {
  setCustomers, setBillingInfo, setAddressBook, setShippingInfo,
} from '../redux/bigCommerce/newOrderSlice';

const shippingInfoEmpty = {
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

export default function NewOrderShippingForm({ addresses, setShipping }) {
  const dispatch = useDispatch();
  const [localShipping, setLocalShipping] = useState(shippingInfoEmpty);

  const handleUpdateField = (e) => {
    setLocalShipping({ ...localShipping, [e.target.name]: e.target.value });
    setShipping({ ...localShipping, [e.target.name]: e.target.value });
  }

  const handleSelectShipping = async (address) => {
    if (address) {
      setLocalShipping({
        first_name: address.first_name,
        last_name: address.last_name,
        address1: address.address1,
        address2: address.address2,
        city: address.city,
        state: address.state_or_province,
        zip: address.postal_code,
        country: address.country,
        phone: address.phone,
      });
      setShipping({
        first_name: address.first_name,
        last_name: address.last_name,
        address1: address.address1,
        address2: address.address2,
        city: address.city,
        state: address.state_or_province,
        zip: address.postal_code,
        country: address.country,
        phone: address.phone,
      });
    } else {
      setLocalShipping(shippingInfoEmpty);
      setShipping(shippingInfoEmpty);
    }
  };

  return (
    <Grid container spacing={2} margin={2}>
      <Grid item xs={12}>
        <Typography variant="h6">Shipping Address</Typography>
      </Grid>
      <Grid item xs={12}>
        <Autocomplete
          disabled={!addresses}
          id="combo-box-demo"
          options={addresses?.length > 0 ? addresses : []}
          getOptionLabel={(option) => `${option.first_name}, ${option.last_name}`}
          renderInput={(params) => <TextField {...params} label="Select an Address" />}
          onChange={(event, newValue) => handleSelectShipping(newValue)}
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
          value={localShipping.first_name}
          onChange={handleUpdateField}
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
          value={localShipping.last_name}
          onChange={handleUpdateField}
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
          value={localShipping.address1}
          onChange={handleUpdateField}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          id="address2"
          name="address2"
          label="Address line 2"
          fullWidth
          autoComplete="shipping address-line2"
          value={localShipping.address2}
          onChange={handleUpdateField}
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
          value={localShipping.city}
          onChange={handleUpdateField}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          id="state"
          name="state"
          label="State/Province/Region"
          fullWidth
          value={localShipping.state}
          onChange={handleUpdateField}
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
          value={localShipping.zip}
          onChange={handleUpdateField}
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
          value={localShipping.country}
          onChange={handleUpdateField}
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
          value={localShipping.phone}
          onChange={handleUpdateField}
        />
      </Grid>
    </Grid>
  );
}
