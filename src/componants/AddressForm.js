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
  giftMessage: '',
};

export default function AddressForm({ title, addresses, setAddress }) {
  const [localBilling, setLocalBilling] = useState(billingInfoEmpty);
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  }

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
        giftMessage: address.giftMessage,
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
        giftMessage: address.giftMessage,
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
        <Typography variant="h6">{title}</Typography>

        <Autocomplete
          disabled={!addresses}
          id="combo-box-demo"
          options={addresses?.length > 0 ? addresses : []}
          getOptionLabel={(option) => `${option.first_name}, ${option.last_name}`}
          renderOption={(props, option) => (
            <Box component="li" {...props}>
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

        <Button
          onClick={() => setModalOpen(true)}
          size={"small"}
          variant={"outlined"}
        >Update</Button>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'background.paper',
            borderRadius: '8px',
            boxShadow: 24,
            p: 4,
            top: '50%',
            left: '50%',
            width: 400,
            transform: 'translate(50%, 50%)',
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
              value={localBilling.phone}
              onChange={handleUpdateField}
              margin="normal"
              size={"small"}
            />
            <TextField
              id="giftMessage"
              name="giftMessage"
              label="Gift Message"
              fullWidth
              value={localBilling.giftMessage}
              onChange={handleUpdateField}
              margin="normal"
              size={"small"}
            />
            <Button
              onClick={() => setModalOpen(false)}
              size={"small"}
              variant={"outlined"}
            >
              Save
            </Button>
          </FormControl>
        </Box>
      </Modal>
    </Box>
  );
}
