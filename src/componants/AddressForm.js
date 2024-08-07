// src/componants/AddressForm.js

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box, TextField, Typography, FormControl, Autocomplete, Button, Modal, Divider,
} from '@mui/material';
import { STATES } from '../../src/constants';

const billingInfoEmpty = {
  first_name: '',
  last_name: '',
  address1: '',
  address2: '',
  city: '',
  state_or_province: '',
  postal_code: '',
  country: '',
  country_code: '',
  phone: '',
  giftMessage: '',
};

export default function AddressForm({ title, customerId, address, setAddress }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [tempAddress, setTempAddress] = useState(address);

  const addresses = useSelector((state) => state.data.customers.find((c) => c.id === customerId)?.addresses);

  const handleSelectBilling = async (newAddress) => {
    if (newAddress) {
      setAddress({
        id: newAddress.id,
        first_name: newAddress.first_name,
        last_name: newAddress.last_name,
        address1: newAddress.address1,
        address2: newAddress.address2,
        city: newAddress.city,
        state_or_province: newAddress.state_or_province,
        postal_code: newAddress.postal_code,
        country: newAddress.country,
        country_code: newAddress.country_code,
        phone: newAddress.phone,
        giftMessage: newAddress.giftMessage,
      });
    } else {
      setAddress(billingInfoEmpty);
    }
  };

  const handleUpdateField = (e) => {
    setTempAddress({ ...tempAddress, [e.target.name]: e.target.value });
  };

  const handleUpdateState = (_, newValue) => {
    setTempAddress({ ...tempAddress, state_or_province: newValue.label });
  };

  const handleSave = () => {
    setAddress(tempAddress);
    setModalOpen(false);
  };

  return (
    <Box
      component="form"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        p: 1
      }}
    >
      <Typography variant="subtitle1">{title}</Typography>

      <Autocomplete
        disabled={!addresses}
        id="combo-box-demo"
        options={addresses?.length > 0 ? addresses : []}
        getOptionLabel={(option) => `${option.first_name}, ${option.last_name}`}
        getOptionKey={(option) => option.id}
        renderOption={(props, option) => (
          <Box key={option.id} component="li" {...props}>
            <Typography variant="subtitle1">{`${option.first_name}, ${option.last_name}`}</Typography>
            <Typography variant="subtitle2">{`${option.address1}, ${option.city}, ${option.state_or_province}, ${option.postal_code}, ${option.country}`}</Typography>
            <Typography variant="subtitle2">{`${option.phone}`}</Typography>
          </Box>
        )}
        renderInput={(params) => <TextField {...params} label="Select an Address" />}
        onChange={(event, newValue) => handleSelectBilling(newValue)}
        margin="normal"
        size={"small"}
        value={address}
        sx={{ width: '100%', maxWidth: '400px' }}
        isOptionEqualToValue={(option, value) => option.id === value.id}
      />

      {(address && address.first_name !== '') && (
        <Box>
          <Typography variant="subtitle1">Selected Address:</Typography>
          <Typography variant="subtitle2">{`${address.first_name}, ${address.last_name}`}</Typography>
          <Typography variant="subtitle2">{`${address.address1}, ${address.city}, ${address.state_or_province}, ${address.postal_code}, ${address.country}`}</Typography>
          <Typography variant="subtitle2">{`${address.phone}`}</Typography>
          <Typography variant="subtitle2">{`Gift Message: ${address.giftMessage}`}</Typography>
          <Button
            onClick={() => {
              setTempAddress(address);
              setModalOpen(true);
            }}
            disabled={address === billingInfoEmpty}
            size={"small"}
            variant={"outlined"}
          >
            Update
          </Button>
        </Box>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 400 }, // Responsive width
            bgcolor: 'background.paper',
            borderRadius: '8px',
            boxShadow: 24,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FormControl fullWidth margin="normal">
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
                value={tempAddress?.first_name}
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
                value={tempAddress?.last_name}
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
              value={tempAddress?.address1}
              onChange={handleUpdateField}
              margin="normal"
              size={"small"}
            />

            <TextField
              id="address2"
              name="address2"
              label="Address line 2"
              fullWidth
              value={tempAddress?.address2}
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
                value={tempAddress?.city}
                onChange={handleUpdateField}
                margin="normal"
                size={"small"}
              />

              <Autocomplete
                id="state_or_province"
                options={STATES}
                getOptionLabel={(option) => option.code}
                renderInput={(params) => <TextField {...params} label="State" margin="normal" size={"small"} />}
                onChange={handleUpdateState}
                value={tempAddress?.state_or_province ? STATES.find(state => state.label === tempAddress.state_or_province) : null}
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
                id="postal_code"
                name="postal_code"
                label="Zip / Postal code"
                fullWidth
                value={tempAddress?.postal_code}
                onChange={handleUpdateField}
                margin="normal"
              />

              <TextField
                required
                id="country"
                name="country"
                label="Country"
                fullWidth
                value={tempAddress?.country}
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
              value={tempAddress?.phone}
              onChange={handleUpdateField}
              margin="normal"
              size={"small"}
            />
            <TextField
              id="giftMessage"
              name="giftMessage"
              label="Gift Message"
              fullWidth
              value={tempAddress?.giftMessage}
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
                marginTop: '10px',
              }}
            >
              <Button
                onClick={() => setModalOpen(false)}
                size={"small"}
                variant={"outlined"}
              >
                Close
              </Button>
              <Button
                onClick={handleSave}
                size={"small"}
                variant={"contained"}
              >
                Save
              </Button>
            </div>
          </FormControl>
        </Box>
      </Modal>
    </Box>
  );
}