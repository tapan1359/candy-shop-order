import {Box, Button, Divider, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup} from "@mui/material";
import React from "react";
import Pickup from "../Pickup";
import Shipping from "../Shipping";
import {ShippingOptions} from "../ShippingOptions";

const createDefaultConsignment = (id) => {
  return {
    "internalId": id,
    "address": null,
    "items": []
  }
}

let consignmentInteralId = 0

export default function AddConsignments({
  products,
  pickupConsignment,
  setPickupConsignment,
  consignments,
  setConsignments,
  customer,
  fullfillmentType,
  setFullfillmentType,
}) {

  const addConsignment = () => {
    setConsignments([...consignments, createDefaultConsignment(consignmentInteralId)]);
    consignmentInteralId++;
  }

  const removeConsignment = (internalId) => {
    setConsignments(consignments.filter((consignment) => consignment.internalId !== internalId));
  }

  const updateConsignmentShippingAddress = (internalId, address) => {
    setConsignments(consignments.map((consignment) => {
      if (consignment.internalId === internalId) {
        return {...consignment, address};
      }
      return consignment;
    }));
  }

  const updateConsignmentItems = (internalId, items) => {
    setConsignments(consignments.map((consignment) => {
      if (consignment.internalId === internalId) {
        return {...consignment, items};
      }
      return consignment;
    }));
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      padding: 2,
      borderRadius: 2,

    }}>
      <FormControl>
        <FormLabel>Select Fulfillment Type</FormLabel>
        <RadioGroup
          row
          value={fullfillmentType}
          onChange={(event) => setFullfillmentType(event.target.value)}
        >
          <FormControlLabel value="shipping" control={<Radio />} label="Shipping" />
          <FormControlLabel value="pickup" control={<Radio />} label="Pickup" />
        </RadioGroup>
      </FormControl>
      {fullfillmentType === "pickup" && (
        <>
          <Pickup
            products={products}
            consignment={pickupConsignment}
            updateConsignmentItems={setPickupConsignment}
          />
        </>
      )}
      {fullfillmentType === "shipping" && (
        <>
          {consignments.map((consignment) => (
            <Box
              key={consignment.internalId}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                padding: 2,
                borderRadius: 2,
              }}
            >
              <Shipping
                key={consignment.internalId}
                customerId={customer?.id}
                products={products}
                consignment={consignment}
                updateConsignmentShippingAddress={updateConsignmentShippingAddress}
                updateConsignmentItems={updateConsignmentItems}
                removeConsignment={removeConsignment}
              />
            </Box>
          ))}
          <Button
            onClick={addConsignment}
            variant={"contained"}
            sx={{
              backgroundColor: 'red',
              width: '40%',
            }}
          >
            ADD ADDITIONAL SHIPPING ADDRESS AND PRODUCTS
          </Button>
        </>
      )}
    </Box>
  );
}