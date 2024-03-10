import React, { useState, useEffect } from "react";
import { Button, Modal, Box, TextField } from "@mui/material";

import { useReactToPrint } from 'react-to-print';
import './PrintPreview.css';

class ComponentToPrint extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editableMessage: this.props.message,
    };
  }


  handleChange = (event) => {
    this.setState({ editableMessage: event.target.value });
    if (this.props.messageChange) {
      this.props.messageChange(event.target.value);
    }
  };

  render() {
    return (
      <div className={'cardPrintComponent'} style={{
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
          top: '0.20in', // Half of the total height reduction to center the content
          left: '0.4in', // Half of the total width reduction to center the content
          height: '3.0in', // Reduced height (2.25in - 0.6in)
          width: '1.65in', // Reduced width (3.5in - 0.5in)
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center', // Align text container vertically in the middle for flex-direction: column
          border: this.props.isPrintMode ? 'none' : '1px solid black',
        }}>
          <textarea
            value={this.state.editableMessage}
            onChange={this.handleChange}
            style={{
              textAlign: 'center',
              verticalAlign: 'middle',
              width: '3.0in',
              height: '1.65in',
              transform: 'rotate(-90deg)',
              transformOrigin: 'center center',
              backgroundColor: 'transparent',
              resize: 'none',
              // border: 'none',
              fontSize: `${this.props.fz}px`,
              lineHeight: `${this.props.lineHeight}`,
              overflow: 'hidden',
              padding: 0,
              margin: 0,
              whiteSpace: 'pre-wrap',
              wordSpacing: '0.0em',
              fontFamily: 'arial',
            }}
          />
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
    console.log(string.length);
    if (string.length <= 35) {
      setFz(47);
    } else if (string.length > 35 && string.length < 90) {
      setFz(30);
    } else if (string.length >= 90 && string.length < 130) {
      setFz(25);
    } else if (string.length >= 130 && string.length < 190) {
      setFz(20);
    } else {
      setFz(16);
    }
  };

  return (
    <div>
      <Modal open onClose={() => closePreview()}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 300 },
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
          <ComponentToPrint 
            ref={componentRef} 
            message={text} 
            fz={fz}
            isPrintMode={isPrintMode}
            lineHeight={lineHeight}
            messageChange={(message) => CheckStringLength(message)}
          />

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
