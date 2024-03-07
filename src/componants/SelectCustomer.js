import React from 'react';
import {TextField, Autocomplete, Button, Modal, Box, FormControl, Alert} from '@mui/material';
import {createCustomerAPI} from '../bigCommerce/customers/customers.create';
import {useDispatch} from 'react-redux';
import {addCustomer} from '../redux/bigCommerce/data';


const createCustomerModel =  () => {
  return {
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
  }
}


export default function SelectCustomer({customers, customer, setCustomer}) {

  const [modalOpen, setModalOpen] = React.useState(false);
  const [newCustomer, setNewCustomer] = React.useState(createCustomerModel());
  const [error, setError] = React.useState(null);
  const dispatch = useDispatch();

  const handleCustomerSelect = (customer) => {
    setCustomer(customer);
  }

  const handleCreateNewCustomer = (e) => {
    setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value });
  }

  const createNewCustomer = async () => {
    if (newCustomer.first_name === '' || newCustomer.last_name === '' || newCustomer.phone === '') {
      return;
    }
    let email = newCustomer.email;
    if (email === '') {
      const randomString = Math.random().toString(36).substring(2, 10);
      const randomDate = Math.floor(Math.random() * 31) + 1;
      email = `test${randomDate}${randomString}@test.com`;
    }

    let updatedCustomer = { ...newCustomer, email};

    let {customer, error} = await createCustomerAPI(updatedCustomer);
    if (customer) {
      setCustomer(customer);
      dispatch(addCustomer(customer));
      setModalOpen(false);
    } else if (error) {
      setError(error);
    } else {
      setError("Unknown error!")
    }
  }

  return (
    <>
      {error && (
        <Alert
          severity="error"
          onClose={() => setError(null)}
          sx={{
            position: 'fixed',
            top: '16px',
            right: '16px',
            zIndex: 9999,
          }}
        >
          {error}
        </Alert>
      )}
      <Autocomplete
        fullWidth
        id="combo-box-demo"
        options={customers}
        value={customer}
        getOptionLabel={(option) => `${option.first_name}, ${option.last_name}`}
        renderInput={(params) => <TextField {...params} label="Search by customer Name/Phone Number" />}
        onChange={(event, newValue) => handleCustomerSelect(newValue)}
        renderOption={(props, option) => (
          // Here you need to ensure the key is unique for each option
          <li {...props} key={option.id}>
            {option.first_name}, {option.last_name}
          </li>
        )}
        filterOptions={(options, state) => options.filter((option) => option.first_name.toLowerCase().includes(state.inputValue.toLowerCase()) || option.last_name.toLowerCase().includes(state.inputValue.toLowerCase()) || option.phone.toLowerCase().includes(state.inputValue.toLowerCase()) || option.email.toLowerCase().includes(state.inputValue.toLowerCase()))}
        noOptionsText={
          <Button color="primary" onClick={() => setModalOpen(true)}>
            Not Found. Add New Customer
          </Button>
        }
      />
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
              required
              id="email"
              name="email"
              label="Email"
              fullWidth
              value={newCustomer.email}
              onChange={handleCreateNewCustomer}
              margin="normal"
              size={"small"}
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
    </>
  )
}
