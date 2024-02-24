import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import StartEndTimePicker from '../../componants/StartEndTimePicker';
import OrderLineItem from './OrderLineItem';
import { getOrderStatus } from '../../bigCommerce/orders/orders.get';
import { setOrderStatuses } from '../../redux/bigCommerce/ordersSlice';
import { getPrinters, printPDF } from '../../print';
import {
  Autocomplete,
  TextField,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Accordion, AccordionSummary, AccordionDetails, Box, Typography
} from '@mui/material';
import moment from 'moment';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function OrderIndex() {
  const orders = useSelector((state) => state.orders.orders);
  const dispatch = useDispatch();
  const [selectedPrinter, setSelectedPrinter] = useState('');
  const [printers, setPrinters] = useState([]);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    handleGetOrderStatus();
    handleGetPrinters();
  }, []);

  const handleGetOrderStatus = async () => {
    const orderStatus = await getOrderStatus();
    dispatch(setOrderStatuses(orderStatus));
  };

  const handleGetPrinters = async () => {
    const fetchedPrinters = await getPrinters();
    const printersWithName = fetchedPrinters.map((printer) => printer.name);
    setPrinters(printersWithName);
  };

  const getShipping = (order) =>  {
    const shipping = order.consignments.map((consignment) => {
      if (consignment?.shipping && consignment.shipping.length > 0) {
        return consignment.shipping;
      }
    }).filter((item) => item !== undefined).flat();
    return shipping;
  }

  const printOrder = async (text) => {
    await printPDF(text, selectedPrinter, 100, 100);
  };

  return (
    <div>
      <Grid container spacing={2} margin={2}>
        <Grid item xs={6}>
          <StartEndTimePicker />
        </Grid>
        <Grid item xs={6}>
        <div style={{ width: '300px' }}>
            <Autocomplete
              options={printers}
              renderInput={(params) => <TextField {...params} label="Select a Printer" />}
              onChange={(e, newValue) => setSelectedPrinter(newValue)}
            />
          </div>
        </Grid>
      </Grid>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          paddingLeft: 2,
        }}
      >
        {orders && orders?.map((order) => (
          <Accordion key={order.id} expanded={expanded === order.id} onChange={() => setExpanded(order.id)}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <TableCell>{order.id}</TableCell>
                <TableCell>
                  {order.billing_address.first_name} {order.billing_address.last_name}
                </TableCell>
                <TableCell>${order.total_inc_tax}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{moment(order.date_created).format('MM/DD/YYYY')}</TableCell>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 2,
                  paddingLeft: 2,
                  justifyContent: 'space-between',
                }}
              >
                {order.customer_message && (
                  <Box>
                    <Typography variant={"subtitle1"}>Customer Message</Typography>
                    <Typography variant={"subtitle2"}>{order.customer_message}</Typography>
                    <Button
                      size={"small"}
                      variant={"outlined"}
                      onClick={() => printOrder(order.customer_message)}
                    >
                      Print</Button>
                  </Box>
                )}
                {order.billing_address && (
                  <Box>
                    <Typography variant={"subtitle1"}>Billing Address</Typography>
                    <Typography variant={"subtitle2"}>{order.billing_address.first_name} {order.billing_address.last_name}</Typography>
                    <Typography variant={"subtitle2"}>{order.billing_address.street_1}</Typography>
                    <Typography variant={"subtitle2"}>{order.billing_address.city}, {order.billing_address.state} {order.billing_address.zip}</Typography>
                    {order.billing_address.form_fields && order.billing_address.form_fields.map((field) => (
                      field.name === 'Gift Message' && (
                        <div key={field.name}>
                          <Typography variant={"subtitle2"}>Gift Message: {field.value}</Typography>
                          <Button
                            size={"small"}
                            variant={"outlined"}
                            onClick={() => printOrder(field.value)}
                          >
                            Print</Button>
                        </div>
                      )
                    ))}
                  </Box>
                )}


                {getShipping(order)?.map((shipping, index) => (
                  <Box key={shipping.id}>
                    <Typography variant={"subtitle1"}>Shipping Address {index + 1}</Typography>
                    <Typography variant={"subtitle2"}>{order.billing_address.first_name} {order.billing_address.last_name}</Typography>
                    <Typography variant={"subtitle2"}>{order.billing_address.street_1}</Typography>
                    <Typography variant={"subtitle2"}>{order.billing_address.city}, {order.billing_address.state} {order.billing_address.zip}</Typography>
                    {shipping.form_fields && shipping.form_fields.map((field) => (
                      field.name === 'Gift Message' && (
                        <div key={field.name}>
                          <Typography variant={"subtitle2"}>Gift Message: {field.value}</Typography>
                          <Button
                            size={"small"}
                            variant={"outlined"}
                            onClick={() => printOrder(field.value)}
                          >
                            Print</Button>
                        </div>
                      )
                    ))}
                  </Box>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </div>
  );
}
