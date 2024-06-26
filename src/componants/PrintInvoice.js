import React, {useState} from "react";
import { Typography, 
  Divider, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Modal,
  Box,
  Button
} from '@mui/material';
import { useReactToPrint } from 'react-to-print';
import moment from "moment";


class ComponentToPrint extends React.Component {

  renderPickups(consignments) {
    return consignments.map((consignment, consignmentIndex) => (
      <React.Fragment key={consignmentIndex}>
        {(consignment.pickups && consignment.pickups.length > 0) && <Typography>Pickups</Typography>}
        {consignment.pickups && consignment.pickups.length > 0 ? (
          <TableContainer sx={{ my: 2 }}>
            <Table aria-label="pickup details">
              <TableHead>
                <TableRow>
                  <TableCell>Address</TableCell>
                  <TableCell align="right">Qty</TableCell>
                  <TableCell align="right">SKU</TableCell>
                  <TableCell align="right">Product</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {consignment.pickups.map((pickup, pickupIndex) => (
                <React.Fragment key={pickupIndex}>
                  {pickup.line_items.map((lineItem, lineItemIndex) => (
                    <TableRow key={`pickup-item-${pickupIndex}-${lineItemIndex}`}>
                      {lineItemIndex === 0 && (
                        <TableCell component="th" scope="row" rowSpan={pickup.line_items.length}>
                          <Typography variant="subtitle2">{pickup.location.name}</Typography>
                          <Typography variant="subtitle2">{pickup.location.address_line_1}</Typography>
                          <Typography variant="subtitle2">{`${pickup.location.city}, ${pickup.location.state}, ${pickup.location.postal_code}`}</Typography>
                          <Typography variant="subtitle2">{`Method: ${pickup.pickup_method_display_name}`}</Typography>
                          {pickup.form_fields.map((field, fieldIndex) => (
                            <Typography variant="subtitle2" key={fieldIndex}>{`${field.name}: ${field.value}`}</Typography>
                          ))}
                        </TableCell>
                      )}
                      <TableCell align="right" sx={{color: 'red', fontSize: '1.5em'}}>{lineItem.quantity}</TableCell>
                      <TableCell align="right">{lineItem.sku}</TableCell>
                      <TableCell align="right">{lineItem.name}</TableCell>
                      <TableCell align="right">${parseFloat(lineItem.price_ex_tax).toFixed(2)}</TableCell>
                      <TableCell align="right">${parseFloat(lineItem.total_ex_tax).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ): null}
        
      </React.Fragment>
    ));
  }


  renderShipping(consignments) {
    return consignments.map((consignment, consignmentIndex) => (
      <React.Fragment key={consignmentIndex}>
        {(consignment.shipping && consignment.shipping.length > 0) && <Typography>Shipping</Typography>}
        {consignment.shipping && consignment.shipping.length > 0 ? (
          <TableContainer>
            <Table aria-label="shipping details">
              <TableHead>
                <TableRow>
                  <TableCell>Address</TableCell>
                  <TableCell align="right">Qty</TableCell>
                  <TableCell align="right">SKU</TableCell>
                  <TableCell align="right">Product</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {consignment.shipping.map((shippingItem, shippingIndex) => (
                  <React.Fragment key={shippingIndex}>
                  {shippingItem.line_items.map((lineItem, lineIndex) => (
                    <TableRow key={`item-${shippingIndex}-${lineIndex}`}>
                      {lineIndex === 0 && (
                        // For the first line item, render the address cell
                        <TableCell component="th" scope="row" rowSpan={shippingItem.line_items.length}>
                          <Typography variant="body1">{`${shippingItem.first_name} ${shippingItem.last_name}`}</Typography>
                          <Typography variant="subtitle2">{shippingItem.street_1}</Typography>
                          <Typography variant="subtitle2">{`${shippingItem.city}, ${shippingItem.state}, ${shippingItem.zip}`}</Typography>
                          <Typography variant="subtitle2">{`Method: ${shippingItem.shipping_method}`}</Typography>
                          {shippingItem.form_fields.map((field, fieldIndex) => (
                            <Typography variant="subtitle2" key={fieldIndex}>{`${field.name}: ${field.value}`}</Typography>
                          ))}
                        </TableCell>
                      )}
                      <TableCell align="right" sx={{color: 'red', fontSize: '1.5em'}}>{lineItem.quantity}</TableCell>
                      <TableCell align="right">{lineItem.sku}</TableCell>
                      <TableCell align="right">{lineItem.name}</TableCell>
                      <TableCell align="right">${parseFloat(lineItem.price_ex_tax).toFixed(2)}</TableCell>
                      <TableCell align="right">${parseFloat(lineItem.total_ex_tax).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ): null}
        
      </React.Fragment>
    ));
  } 

  render() {
    let order = this.props.order;
    let billingAddress = order.billing_address;
    let consignments = order.consignments || [];

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h4">Invoice</Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            width: '100%',
            mb: 3, // Adding space between sections
            borderBottom: 3,
            borderColor: 'gray',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left', gap: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
              <Typography variant="body1" sx={{ color: 'gray' }}>Order Number:</Typography>
              <Typography variant="body1" sx={{ color: 'black' }}>{order.id}</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
              <Typography variant="body1" sx={{ color: 'gray' }}>Order Date:</Typography>
              <Typography variant="body1" sx={{ color: 'black' }}>{moment(order.date_created).format("Do MMM YYYY")}</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
              <Typography variant="body1" sx={{ color: 'gray' }}>Status:</Typography>
              <Typography variant="body1" sx={{ color: 'red' }}>{order.status}</Typography>
            </Box>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'gray' }}>Billing Address</Typography>
            <Typography variant="subtitle2">{billingAddress.first_name} {billingAddress.last_name}</Typography>
            <Typography variant="subtitle2">{billingAddress.street_1}</Typography>
            <Typography variant="subtitle2">{billingAddress.city}, {billingAddress.state}, {billingAddress.zip}</Typography>
            <Typography variant="subtitle2">Phone: {billingAddress.phone}</Typography>
            <Typography variant="subtitle2">Email: {billingAddress.email}</Typography>
            {billingAddress.form_fields.map((field, fieldIndex) => (
              <Typography variant="subtitle2" key={fieldIndex}>{`${field.name}: ${field.value}`}</Typography>
            ))}
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: 3,
            borderColor: 'gray',
            mb: 3,
          }}
        >
          {this.renderShipping(consignments)}
          {this.renderPickups(consignments)}
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end', // Align to the right
            justifyContent: 'center',
            width: '100%', // Ensuring full width
            p: 2, // Adding padding
          }}
        >
          <Box>
          <TableContainer>
            <Table aria-label="invoice totals">
              <TableBody>
                <TableRow sx={{ '& > *': { py: '3px' } }}>
                  <TableCell>Subtotal:</TableCell>
                  <TableCell align="right">{`$${parseFloat(order.subtotal_ex_tax).toFixed(2)}`}</TableCell>
                </TableRow>
                {consignments.map((consignment, index) => (
                  consignment.shipping.map((shipItem, shipIndex) => (
                    <TableRow sx={{ '& > *': { py: '3px' } }} key={`ship-${index}-${shipIndex}`}>
                      <TableCell>{`Shipping - Destination #${index + 1}${consignment.shipping.length > 1 ? ` (Item ${shipIndex + 1})` : ''}:`}</TableCell>
                      <TableCell align="right">{`$${parseFloat(shipItem.cost_inc_tax).toFixed(2)}`}</TableCell>
                    </TableRow>
                  ))
                ))}
                <TableRow sx={{ '& > *': { py: '3px' } }}>
                  <TableCell>Tax:</TableCell>
                  <TableCell align="right">{`$${parseFloat(order.total_tax).toFixed(2)}`}</TableCell>
                </TableRow>
                <TableRow sx={{ '& > *': { py: '3px' } }}>
                  <TableCell>Grand total:</TableCell>
                  <TableCell align="right">{`$${parseFloat(order.total_inc_tax).toFixed(2)}`}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        </Box>

      </Box>
    );
  }
}

const ComponentToPrintWithRef = React.forwardRef((props, ref) => (
  <div ref={ref}>
    <ComponentToPrint {...props} />
  </div>
));


const PrintInvoice = ({order=null}) => {

  const [modalOpen, setModalOpen] = useState(false);
  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () => {
      const component = componentRef.current;
      return component;
    },
  });

  return (
    <div>
      <Button
        onClick={() => setModalOpen(true)}
        size={"small"}
        variant={"outlined"}
      >
        Print Invoice</Button>
      <Modal 
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: '80%' },
            bgcolor: 'background.paper',
            borderRadius: '8px',
            boxShadow: 24,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start', // Changed from center to flex-start
            overflowY: 'auto', // Added to ensure vertical scroll
            height: "90vh",
            maxHeight: "90vh", // Ensuring the modal doesn't exceed viewport height
          }}
        >
            <div>
              <ComponentToPrintWithRef 
                ref={componentRef}
                order={order}
              />
            </div>

          <Box
            sx={{
              position: 'sticky',
              bottom: 0,
              // This ensures that the action area doesn't overlap the content
              paddingBottom: '16px',
              backgroundColor: 'background.paper',
              display: 'flex',
              justifyContent: 'flex-end',
              paddingRight: 4,
              width: '100%', // Ensures full width for the button section
            }}
          >
            <Button size={'large'} variant="contained" onClick={handlePrint}>Print</Button>
          </Box>

        </Box>
      </Modal>
    </div>
  );
}

export default PrintInvoice;
    