import React, { useEffect, useState } from 'react';
import {
  Box, TextField, Typography, FormControl, Autocomplete, Button, Modal, Divider,
} from '@mui/material';

const billingInfoEmpty = {
  first_name: '',
  last_name: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  postal_code: '',
  country: '',
  country_code: '',
  phone: '',
  giftMessage: '',
};

export default function AddressForm({ title, addresses, address, setAddress }) {
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setAddress(null);
  }, [addresses]);


  const handleSelectBilling = async (address) => {
    if (address) {
      setAddress({
        first_name: address.first_name,
        last_name: address.last_name,
        address1: address.address1,
        address2: address.address2,
        city: address.city,
        state: address.state_or_province,
        postal_code: address.postal_code,
        country: address.country,
        country_code: address.country_code,
        phone: address.phone,
        giftMessage: address.giftMessage,
      });
    } else {
      setAddress(billingInfoEmpty);
    }
  }

  const handleUpdateField = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  }


  return (
    <Box
      component="form"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}
    >
        <Typography variant="subtitle1">{title}</Typography>

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
          margin="normal"
          size={"small"}
          value={address}
          sx={{ width: 400 }}
        />
        
        {(address && address.first_name !== '') && (
          <Box>
            <Typography variant="subtitle1">Selected Address:</Typography>
            <Typography variant="subtitle2">{`${address.first_name}, ${address.last_name}`}</Typography>
            <Typography variant="subtitle2">{`${address.address1}, ${address.city}, ${address.state}, ${address.postal_code}, ${address.country}`}</Typography>
            <Typography variant="subtitle2">{`${address.phone}`}</Typography>
            <Typography variant="subtitle2">{`Gift Message: ${address.giftMessage}`}</Typography>
            <Button
              onClick={() => setModalOpen(true)}
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
            transform: 'translate(80%, 30%)',
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
                value={address?.first_name}
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
                value={address?.last_name}
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
              value={address?.address1}
              onChange={handleUpdateField}
              margin="normal"
              size={"small"}
            />

            <TextField
              id="address2"
              name="address2"
              label="Address line 2"
              fullWidth
              value={address?.address2}
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
                value={address?.city}
                onChange={handleUpdateField}
                margin="normal"
                size={"small"}
              />

              <TextField
                id="state"
                name="state"
                label="State/Province/Region"
                fullWidth
                value={address?.state}
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
                id="postal_code"
                name="postal_code"
                label="Zip / Postal code"
                fullWidth
                value={address?.postal_code}
                onChange={handleUpdateField}
                margin="normal"
              />

              <TextField
                required
                id="country"
                name="country"
                label="Country"
                fullWidth
                value={address?.country}
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
              value={address?.phone}
              onChange={handleUpdateField}
              margin="normal"
              size={"small"}
            />
            <TextField
              id="giftMessage"
              name="giftMessage"
              label="Gift Message"
              fullWidth
              value={address?.giftMessage}
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
