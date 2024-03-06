import React, { useState } from "react";
import { Button, Modal, Box, TextField } from "@mui/material";

import { useReactToPrint } from 'react-to-print';

class ComponentToPrint extends React.Component {
  render() {
    return (
      <div className="printComponent" style={{
        height: '3.5in', // Constant box height
        width: '2.25in', // Constant box width
        display: 'flex',
        justifyContent: 'center', // Align text container horizontally in the middle
        alignItems: 'center', // Align text container vertically in the middle
        border: this.props.isPrintMode ? 'none' : '1px solid black', // Optional: adds a border to visualize the container
        position: 'relative', // Needed for absolute positioning of inner content
      }}>
        {/* Inner container for text to apply padding */}
        <div style={{
          transform: 'rotate(270deg)', // Rotate the text
          transformOrigin: 'center center', // Ensure rotation is centered
          position: 'absolute', // Position absolutely to center in the parent
          width: '100%', // Full width of the parent container
          height: '100%', // Full height of the parent container
          display: 'flex',
          flexDirection: 'column', // Stack children vertically
          justifyContent: 'center', // Center content vertically
          paddingTop: `${this.props.topMargin}in`, // Apply padding to simulate top and bottom margins for the text
          paddingBottom: `${this.props.bottomMargin}in`, // Apply padding to simulate top and bottom margins for the text
          paddingLeft: `${this.props.leftMargin}in`, // Apply padding to simulate left margin for the text
          paddingRight: `${this.props.rightMargin}in`, // Apply padding to simulate right margin for the text
          fontSize: `${this.props.fz}px`, // Adjust text size as needed
        }}>
          <span style={{textAlign: 'center', width: '100%'}}>{this.props.message}</span>
        </div>
      </div>
    );
  }
}

const PrintPreview = ({text, closePreview}) => {

  const [fz, setFz] = useState(10);
  const [leftMargin, setLeftMargin] = useState(0.6);
  const [rightMargin, setRightMargin] = useState(0.6);
  const [topMargin, setTopMargin] = useState(0.9);
  const [bottomMargin, setBottomMargin] = useState(0.4);
  const [isPrintMode, setIsPrintMode] = useState(false);


  const togglePrintMode = () => {
    setIsPrintMode(!isPrintMode);
  }

  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });


  return (
    <div>
      <Modal open>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'background.paper',
            borderRadius: '8px',
            boxShadow: 24,
            p: 4,
            top: '50%',
            left: '50%',
            width: 500,
            height: 600,
            transform: 'translate(80%, 30%)',
          }}
        >
            <div>
              <ComponentToPrint 
                ref={componentRef} 
                message={text} 
                fz={fz}
                leftMargin={leftMargin}
                rightMargin={rightMargin}
                topMargin={topMargin}
                bottomMargin={bottomMargin}
                isPrintMode={isPrintMode}
              />
            </div>

            <div style={{ marginTop: '20px' }}>
              <div>
                <TextField
                  id="leftMargin"
                  type="number"
                  label="Left Margin"
                  value={leftMargin}
                  size="small"
                  inputProps={{ step: 0.1 }}
                  onChange={(e) => setLeftMargin(e.target.value)}
                />
              </div>
              <div>
                <TextField
                  id="rightMargin"
                  type="number"
                  label="Right Margin"
                  value={rightMargin}
                  size="small"
                  inputProps={{ step: 0.1 }}
                  onChange={(e) => setRightMargin(e.target.value)}
                />
              </div>
              <div>
                <TextField
                  id="topMargin"
                  type="number"
                  label="Top Margin"
                  value={topMargin}
                  size="small"
                  inputProps={{ step: 0.1 }}
                  onChange={(e) => setTopMargin(e.target.value)}
                />
              </div>
              <div>
                <TextField
                  id="bottomMargin"
                  type="number"
                  label="Bottom Margin"
                  value={bottomMargin}
                  size="small"
                  inputProps={{ step: 0.1 }}
                  onChange={(e) => setBottomMargin(e.target.value)}
                />
              </div>
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
