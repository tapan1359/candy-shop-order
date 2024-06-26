import {Box, Button} from "@mui/material";
import React from "react";

export default function CreateOrder({
  handleCreateOrder,
}) {
  const [loading, setLoading] = React.useState(false);

  const handleCreateOrderLocally = async () => {
    setLoading(true);
    await handleCreateOrder();
    setLoading(false);
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        padding: 2,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Button
        size={"large"}
        onClick={handleCreateOrderLocally}
        variant={"contained"}
        disabled={loading}
        color={"red"}
        sx={{
          backgroundColor: 'red',
          width: '20%',
        }}
      >
        {loading ? "Loading..." : "Create Order"}
      </Button>
    </Box>
  );
}