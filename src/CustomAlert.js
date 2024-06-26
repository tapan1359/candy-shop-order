import {useEffect} from "react";
import {Alert, Typography} from "@mui/material";

export default function CustomAlert({ message, severity, duration = 5000, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [message, duration, onClose]);

  return (
    <Alert
      severity={severity}
      onClose={onClose}
      sx={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999,
        width: '70%', // adjust as needed
        height: '30%', // adjust as needed
        alignItems: 'center',
      }}
    >
      <Typography sx={{fontSize: '3rem', textAlign: 'center'}}>
        {message}
      </Typography>
    </Alert>
  );
}