import React, {useEffect, useState } from 'react';
import {
  Box, TextField, FormControl, Button, Modal, Alert, FormControlLabel, Switch, Autocomplete
} from '@mui/material';
import { useDispatch } from 'react-redux';
import {createAddressAPI} from '../bigCommerce/customers/addresses.create';
import {getCustomerById} from '../bigCommerce/customers/customers.get';
import {updateCustomerById} from '../redux/bigCommerce/data';
import {STATES} from '../../src/constants'


const billingInfoEmpty = {
  first_name: '',
  last_name: '',
  address1: '',
  address2: '',
  city: '',
  state: {code: 'MD', value: 'Maryland'},
  postal_code: '',
  phone: '',
};

export default function CreateAddress({buttonName, customerId, setParentAddress = null}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [address, setAddress] = useState(billingInfoEmpty);
  const [alertMessage, setAlertMessage] = React.useState(null);
  const [localDelivery, setLocalDelivery] = React.useState(false);
  const dispatch = useDispatch();

  const handleUpdateField = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  }

  useEffect(() => {
    console.log(address);
  }, [address]);


  const handleUpdateState = (_, state) => {
    console.log(state?.value);
    if (state) setAddress({ ...address, state });
  }

  const handleCreateAddress = async () => {
    setAlertMessage(null);

    let localCopyAddress = {...address};
    
    localCopyAddress.country_code = "US";
    localCopyAddress.state_or_province = address.state.value;

    if (localDelivery) {
      localCopyAddress.city = 'Baltimore';
      localCopyAddress.state_or_province = 'Maryland';
      localCopyAddress.postal_code = '21201';
    }

    if (localCopyAddress.first_name === '' || localCopyAddress.last_name === '' || localCopyAddress.address1 === '' || localCopyAddress.city === '') {
      setAlertMessage({severity: "error", message: "Please fill in all required fields - firstname, lastname, address1, city"});
      return;
    }


    let result = await createAddressAPI(localCopyAddress, customerId);
    if (result.address) {
      let r = await getCustomerById(customerId);
      dispatch(updateCustomerById(r.customer));
      if (setParentAddress) {
        setParentAddress(result.address);
      }
      setAddress(null);
      setModalOpen(false);
      setAlertMessage({severity: "success", message: "Address created successfully!"});
    } else if (result.error) {
      setAlertMessage({severity: "error", message: JSON.stringify(result.error)});
    } else {
      setAlertMessage({severity: "error", message: "Unknown error!"});
    }
  }

  return (
    <>
      {alertMessage && (
        <Alert
          severity={alertMessage.severity}
          onClose={() => setAlertMessage(null)}
          sx={{
            position: 'fixed',
            top: '16px',
            right: '16px',
            zIndex: 9999,
          }}
        >
          {alertMessage.message}
        </Alert>
      )}
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
      <Button
        onClick={() => setModalOpen(true)}
        size={"small"}
        variant={"outlined"}
        disabled={!customerId}
      >
        {buttonName}
      </Button>
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

              <Autocomplete
                id="state"
                options={STATES}
                getOptionLabel={(option) => option.code}
                renderInput={(params) => <TextField {...params} label="State" margin="normal" size={"small"} />}
                onChange={handleUpdateState}
                value={address?.state}
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
                id="postal_code"
                name="postal_code"
                label="Zip / Postal code"
                fullWidth
                value={address?.postal_code}
                onChange={handleUpdateField}
                margin="normal"
              />
            </div>

            <TextField
              id="phone"
              name="phone"
              label="Phone Number"
              fullWidth
              value={address?.phone}
              onChange={handleUpdateField}
              margin="normal"
              size={"small"}
            />
            <FormControlLabel 
              control={
                <Switch 
                  checked={localDelivery}
                  onChange={() => setLocalDelivery(!localDelivery)}
                />
              } 
              label="Local Delivery" 
            />
            <Button
              onClick={handleCreateAddress}
              size={"small"}
              variant={"outlined"}
            >
              Create Address
            </Button>
          </FormControl>
        </Box>
      </Modal>
    </Box>
    </>
  );
}
