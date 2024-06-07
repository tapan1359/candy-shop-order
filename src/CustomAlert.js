import {useEffect} from "react";
import {Alert} from "@mui/material";

export default function CustomAlert({ message, severity, duration = 3000, onClose }) {
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
        top: '16px',
        right: '16px',
        zIndex: 9999,
      }}
    >
      {message}
    </Alert>
  );
}