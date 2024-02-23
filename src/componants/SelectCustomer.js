import React from 'react';
import {TextField, Autocomplete} from '@mui/material';


export default function SelectCustomer({customers, customer, setCustomer}) {

  const handleCustomerSelect = (customer) => {
    setCustomer(customer);
  }

  return (
    <Autocomplete
      fullWidth
      id="combo-box-demo"
      options={customers}
      value={customer}
      getOptionLabel={(option) => `${option.first_name}, ${option.last_name}`}
      renderInput={(params) => <TextField {...params} label="Search by customer Name/Phone Number" />}
      onChange={(event, newValue) => handleCustomerSelect(newValue)}
      filterOptions={(options, state) => options.filter((option) => option.first_name.toLowerCase().includes(state.inputValue.toLowerCase()) || option.last_name.toLowerCase().includes(state.inputValue.toLowerCase()) || option.phone.toLowerCase().includes(state.inputValue.toLowerCase()) || option.email.toLowerCase().includes(state.inputValue.toLowerCase()))}
    />
  )
}
