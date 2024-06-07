import {Box, Button} from "@mui/material";
import React from "react";
import {ShippingOptions} from "../ShippingOptions";

export default function CreateCartAndShowShippingOptions({
  createShippingCart,
  APIConsignments,
  setShippingOption,
  fullfillmentType
}) {
  const [loading, setLoading] = React.useState(false);

  const handleCreateShippingCart = async () => {
    setLoading(true);
    await createShippingCart();
    setLoading(false);
  }

  const buttonTitle = fullfillmentType === "shipping" ? "Create Cart and Get Shipping Options" : "Create Cart";

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        padding: 2,
      }}
    >
      <Button
        size={"large"}
        onClick={handleCreateShippingCart}
        variant={"contained"}
        disabled={loading}
      >
        {loading ? "Loading..." : buttonTitle}
      </Button>
      {fullfillmentType === "shipping" && <ShippingOptions APIConsignments={APIConsignments} setShippingOption={setShippingOption} />}
    </Box>
  );
}