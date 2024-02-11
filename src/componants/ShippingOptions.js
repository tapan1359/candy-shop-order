import {Box, Divider, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Typography} from "@mui/material";
import React from "react";

export const ShippingOptions = ({APIConsignments, setConsignmentIdToShippingMapping}) => {

  const handleShippingOptionChange = (consignmentId, shippingOptionId) => {
    console.log('e.target.value', consignmentId, shippingOptionId);
  }

  return (APIConsignments.length > 0 && (
    <>
      <Typography variant="h6">Shipping Options</Typography>
      <Divider />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          '& > :not(style)': { m: 1 },
        }}
      >
        {APIConsignments.map((consignment, i) => (
          <Box
            component="form"
            sx={{
              width: 500,
            }}
          >
            <Typography variant="subtitle1">{`${consignment.shipping_address.first_name}, ${consignment.shipping_address.last_name}`}</Typography>
            <Typography variant="subtitle2">{`${consignment.shipping_address.address1}, ${consignment.shipping_address.city}, ${consignment.shipping_address.state_or_province}, ${consignment.shipping_address.postal_code}, ${consignment.shipping_address.country}`}</Typography>
            <Typography variant="subtitle2">{`${consignment.shipping_address.phone}`}</Typography>
            <FormControl>
              <FormLabel id="demo-controlled-radio-buttons-group">Shipping Options</FormLabel>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                onChange={(e) => handleShippingOptionChange(consignment.id, e.target.value)}
              >
                {consignment.available_shipping_options.map((option) => (
                  <FormControlLabel key={option.id} value={option.id} control={<Radio />} label={`${option.description} - Cost ${option.cost}`} />
                ))}
              </RadioGroup>
            </FormControl>
          </Box>
        ))}
      </Box>
    </>
  ))
}