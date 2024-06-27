import {useState} from "react";
import {Box, Button, Modal, Typography} from "@mui/material";

const PaymentSuccessFull = ({onStartNewOrder}) => {
  const [modalOpen, setModalOpen] = useState(true);
  return (
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
        <Typography variant="h4" align="center" gutterBottom>
          Payment Successful
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={onStartNewOrder}
        >
          Start New Order
        </Button>
      </Box>
    </Modal>
  )
}

export default PaymentSuccessFull;