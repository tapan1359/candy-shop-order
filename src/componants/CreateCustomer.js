import React, {useState } from 'react';
import {
  Box, TextField, FormControl, Button, Modal, Alert, FormControlLabel, Switch
} from '@mui/material';
import {useDispatch} from 'react-redux';
import {addCustomer} from '../redux/bigCommerce/data';
import {createCustomerAPI} from '../bigCommerce/customers/customers.create';


const createCustomerModel =  () => {
  return {
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
  }
}

const CreateCustomer = ({setCustomer}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = React.useState(createCustomerModel());
  const [alertMessage, setAlertMessage] = React.useState(null);
  const [defaultAddressSwitchChecked, setDefaultAddressSwitchChecked] = React.useState(false);
  const dispatch = useDispatch();
  
  const handleCreateNewCustomer = (e) => {
    setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value });
  }

  const createNewCustomer = async () => {
    if (newCustomer.first_name === '' || newCustomer.last_name === '' || newCustomer.phone === '') {
      setAlertMessage({severity: "error", message: "Please fill in all required fields - firstname, lastname, phone"});
      return;
    }
    let email = newCustomer.email;
    if (email === '') {
      const randomString = Math.random().toString(36).substring(2, 10);
      const randomDate = Math.floor(Math.random() * 31) + 1;
      email = `test${randomDate}${randomString}@test.com`;
    }

    let updatedCustomer = { ...newCustomer, email};

    if (defaultAddressSwitchChecked) {
      updatedCustomer.addresses = [
        {
          first_name: newCustomer.first_name,
          last_name: newCustomer.last_name,
          address1: '123 Main St',
          city: 'Baltimore',
          state_or_province: 'Maryland',
          postal_code: '21201',
          country_code: 'US',
        }
      ]
    }

    let {customer, error} = await createCustomerAPI(updatedCustomer);
    if (customer) {
      setCustomer(customer);
      dispatch(addCustomer(customer));
      setModalOpen(false);
      setNewCustomer(createCustomerModel());
      setAlertMessage({severity: "success", message: "Customer created successfully!"});
    } else if (error) {
      setAlertMessage({severity: "error", message: JSON.stringify(error)});
    } else {
      setAlertMessage({severity: "error", message: "Unknown error!"});
    }
  }

  const toggleDefaultAddressSwitch = () => {
    setDefaultAddressSwitchChecked(!defaultAddressSwitchChecked);
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
      >
        Add New Customer
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
                value={newCustomer.first_name}
                onChange={handleCreateNewCustomer}
                margin="normal"
                size={"small"}
              />

              <TextField
                required
                id="last_name"
                name="last_name"
                label="Last name"
                fullWidth
                value={newCustomer.last_name}
                onChange={handleCreateNewCustomer}
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
              value={newCustomer.phone}
              onChange={handleCreateNewCustomer}
              margin="normal"
              size={"small"}
            />
            <TextField
              id="email"
              name="email"
              label="Email"
              fullWidth
              value={newCustomer.email}
              onChange={handleCreateNewCustomer}
              margin="normal"
              size={"small"}
            />
            <FormControlLabel 
              control={
                <Switch 
                  checked={defaultAddressSwitchChecked}
                  onChange={toggleDefaultAddressSwitch}
                />
              } 
              label="Create Default Address" 
            />
            <Button
              onClick={() => createNewCustomer()}
              size={"small"}
              variant={"outlined"}
            >
              Create New customer
            </Button>
          </FormControl>
        </Box>
      </Modal>
    </Box>
    </>
  )
}

export default CreateCustomer;