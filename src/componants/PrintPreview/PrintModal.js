import React, { useState, useEffect } from "react";
import { Button, Modal, Box, TextField, Tabs, Tab } from "@mui/material";
import { useReactToPrint } from 'react-to-print';
import Preview from './Preview';
import PreviewV1 from './PreviewV1';

const PrintPreview = ({text, closePreview}) => {

    const [fz, setFz] = useState(10);
    const [isPrintMode, setIsPrintMode] = useState(false);
    const [lineHeight, setLineHeight] = useState(1);
    const [activeTab, setActiveTab] = useState(0);
   
    useEffect(() => {
      CheckStringLength(text);
    }, [text]);
  
    const togglePrintMode = () => {
      setIsPrintMode(!isPrintMode);
    }

    const handleTabChange = (event, newValue) => {
      setActiveTab(newValue);
    };
  
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
        <Modal open onClose={() => closePreview()}>
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
            <Tabs value={activeTab} onChange={handleTabChange} aria-label="Preview Tabs">
              <Tab label="Preview" />
              <Tab label="Preview V1" />
            </Tabs>
            {activeTab === 0 && (
              <Preview
                ref={componentRef}
                message={text}
                fz={fz}
                isPrintMode={isPrintMode}
                lineHeight={lineHeight}
              />
            )}
            {activeTab === 1 && (
              <PreviewV1
                ref={componentRef}
                message={text}
                fz={fz}
                isPrintMode={isPrintMode}
                lineHeight={lineHeight}
                messageChange={(message) => CheckStringLength(message)}
              />
            )}
  
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
  