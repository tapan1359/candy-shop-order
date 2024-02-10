import React, { useState } from 'react';
import {
  Box, TextField, Typography, FormControl, Autocomplete, Button, Modal,
} from '@mui/material';

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

export default function AddressFormOld({ title, addresses, setAddress }) {
  const [localBilling, setLocalBilling] = useState(billingInfoEmpty);

  const handleSelectBilling = async (address) => {
    if (address) {
      setLocalBilling({
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
      setAddress({
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
      setLocalBilling(billingInfoEmpty);
      setAddress(billingInfoEmpty);
    }
  }

  const handleUpdateField = (e) => {
    setLocalBilling({ ...localBilling, [e.target.name]: e.target.value });
    setAddress({ ...localBilling, [e.target.name]: e.target.value });
  }


  return (
    <Box
      component="form"
      sx={{
        width: 500,
      }}
    >
      <FormControl fullWidth margin="normal">
        <Typography variant="h6">{title}</Typography>

        <Autocomplete
          disabled={!addresses}
          id="combo-box-demo"
          options={addresses?.length > 0 ? addresses : []}
          getOptionLabel={(option) => (
            <Box>
              <Typography variant="subtitle1">{`${option.first_name}, ${option.last_name}`}</Typography>
              <Typography variant="subtitle2">{`${option.address1}, ${option.city}, ${option.state_or_province}, ${option.postal_code}, ${option.country}`}</Typography>
              <Typography variant="subtitle2">{`${option.phone}`}</Typography>
            </Box>
          )}
          renderInput={(params) => <TextField {...params} label="Select an Address"/>}
          onChange={(event, newValue) => handleSelectBilling(newValue)}
          fullWidth
          margin="normal"
          size={"small"}
        />

        <Typography variant="h6">Selected Address</Typography>
        {localBilling.first_name !== '' && (
          <Box>
            <Typography variant="subtitle1">{`${localBilling.first_name}, ${localBilling.last_name}`}</Typography>
            <Typography variant="subtitle2">{`${localBilling.address1}, ${localBilling.city}, ${localBilling.state}, ${localBilling.zip}, ${localBilling.country}`}</Typography>
            <Typography variant="subtitle2">{`${localBilling.phone}`}</Typography>
          </Box>
        )}

        <Button>Updated</Button>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: '10px',
          }}
        >
          <TextField
            required
            id="first_name"
            name="first_name"
            label="First name"
            fullWidth
            autoComplete="given-name"
            value={localBilling.first_name}
            onChange={handleUpdateField}
            margin="normal"
            size={"small"}
          />

          <TextField
            required
            id="last_name"
            name="last_name"
            label="Last name"
            fullWidth
            autoComplete="family-name"
            value={localBilling.last_name}
            onChange={handleUpdateField}
            margin="normal"
            size={"small"}
          />
        </div>

        <TextField
          required
          id="address1"
          name="address1"
          label="Address line 1"
          fullWidth
          autoComplete="shipping address-line1"
          value={localBilling.address1}
          onChange={handleUpdateField}
          margin="normal"
          size={"small"}
        />

        <TextField
          id="address2"
          name="address2"
          label="Address line 2"
          fullWidth
          autoComplete="shipping address-line2"
          value={localBilling.address2}
          onChange={handleUpdateField}
          margin="normal"
          size={"small"}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: '10px',
          }}
        >
          <TextField
            required
            id="city"
            name="city"
            label="City"
            fullWidth
            autoComplete="shipping address-level2"
            value={localBilling.city}
            onChange={handleUpdateField}
            margin="normal"
            size={"small"}
          />

          <TextField
            id="state"
            name="state"
            label="State/Province/Region"
            fullWidth
            value={localBilling.state}
            onChange={handleUpdateField}
            margin="normal"
            size={"small"}
          />
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: '10px',
          }}
        >
          <TextField
            size={"small"}
            required
            id="zip"
            name="zip"
            label="Zip / Postal code"
            fullWidth
            autoComplete="shipping postal-code"
            value={localBilling.zip}
            onChange={handleUpdateField}
            margin="normal"
            size={"small"}
          />

          <TextField
            required
            id="country"
            name="country"
            label="Country"
            fullWidth
            autoComplete="shipping country"
            value={localBilling.country}
            onChange={handleUpdateField}
            margin="normal"
            size={"small"}
          />
          </div>

          <TextField
            required
            id="phone"
            name="phone"
            label="Phone Number"
            fullWidth
            autoComplete="shipping phone"
            value={localBilling.phone}
            onChange={handleUpdateField}
            margin="normal"
            size={"small"}
          />
      </FormControl>
    </Box>
);
}
