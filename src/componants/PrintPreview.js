import React, { useState, useEffect } from "react";
import { Button, Modal, Box, TextField } from "@mui/material";

import { useReactToPrint } from 'react-to-print';

class ComponentToPrint extends React.Component {
  render() {
    return (
      <div className={'printComponent'} style={{
        height: '3.5in', // Outer box height
        width: '2.25in', // Outer box width
        display: 'flex',
        justifyContent: 'center', // Align text container horizontally in the middle
        alignItems: 'center', // Align text container vertically in the middle
        border: this.props.isPrintMode ? 'none' : '1px solid black', // Optional: adds a border to visualize the container
        position: 'relative', // Needed for absolute positioning of inner content
        margin: 0,
        padding: 0,
      }}>
        <div style={{
          position: 'absolute',
          top: '0.15in', // Half of the total height reduction to center the content
          left: '0.4in', // Half of the total width reduction to center the content
          height: '3.0in', // Reduced height (2.25in - 0.6in)
          width: '1.65in', // Reduced width (3.5in - 0.5in)
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center', // Align text container vertically in the middle for flex-direction: column
          fontSize: `${this.props.fz}px`,
          lineHeight: `${this.props.lineHeight}`,
          border: this.props.isPrintMode ? 'none' : '1px solid black',
          
        }}>
          <span 
            style={{
              textAlign: 'center', 
              width: '3.0in',
              transform: 'rotate(-90deg)',
              transformOrigin: 'center center',
            }}
            >
              {this.props.message}
            </span>
        </div>
      </div>
    );
  }
}

const PrintPreview = ({text, closePreview}) => {

  const [fz, setFz] = useState(10);
  const [isPrintMode, setIsPrintMode] = useState(false);
  const [lineHeight, setLineHeight] = useState(1);
 
  useEffect(() => {
    CheckStringLength(text);
  }, [text]);

  const togglePrintMode = () => {
    setIsPrintMode(!isPrintMode);
  }

  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () => {
      const component = componentRef.current;
      return component;
    },
  });


  const CheckStringLength = (string) => {
    if (string === '') return;
    console.log(string);
    if (string.length <= 50) {
      setFz(37);
      setLineHeight(1.5);
    } else if (string.length > 50 && string.length < 120) {
      setFz(25);
      setLineHeight(1.2);
    } else if (string.length >= 120) {
      setFz(16);
      setLineHeight(1.5);
    }
  };

  return (
    <div>
      <Modal open>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 300 }, // Responsive width
            bgcolor: 'background.paper',
            borderRadius: '8px',
            boxShadow: 24,
            paddingTop: 4,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
            <div>
              <ComponentToPrint 
                ref={componentRef} 
                message={text} 
                fz={fz}
                isPrintMode={isPrintMode}
                lineHeight={lineHeight}
              />
            </div>

            <div style={{ marginTop: '20px' }}>
              <TextField
                  id="fz"
                  type="number"
                  label="Font Size"
                  value={fz}
                  size="small"
                  onChange={(e) => setFz(e.target.value)}
                />
            </div>

          <Button onClick={() => closePreview()}>Close</Button>
          <Button onClick={togglePrintMode}>Toggle Print Mode</Button>
          <Button onClick={handlePrint}>Print</Button>

        </Box>
      </Modal>
    </div>
  );
}

export default PrintPreview;
