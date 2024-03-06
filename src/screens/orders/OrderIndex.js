import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import StartEndTimePicker from '../../componants/StartEndTimePicker';
import { getOrderStatus } from '../../bigCommerce/orders/orders.get';
import { setOrderStatuses } from '../../redux/bigCommerce/ordersSlice';
import {
  Grid,
  TableCell,
  Button,
  TextField,
  Accordion, AccordionSummary, AccordionDetails, Box, Typography, Divider
} from '@mui/material';
import moment from 'moment';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PrintPreview from '../../componants/PrintPreview';
import { getOrders } from '../../bigCommerce/orders/orders.get';

export default function OrderIndex() {
  const dispatch = useDispatch();

  const [orders, setOrders] = useState([]);

  const [expanded, setExpanded] = useState(null);
  const [preview, setPreview] = useState(false);
  const [message, setMessage] = useState('');


  const [orderFilters, setOrderFilters] = useState({});


  useEffect(() => {
    handleGetOrderStatus();
  }, []);

  useEffect(() => {
    const getOrdersfromAPI = async () => {
      const orders = await getOrders(orderFilters);
      setOrders(orders);
    }
    getOrdersfromAPI();
  }, [orderFilters]);

  const handleGetOrderStatus = async () => {
    const orderStatus = await getOrderStatus();
    dispatch(setOrderStatuses(orderStatus));
  };

  const getShipping = (order) =>  {
    const shipping = order.consignments.map((consignment) => {
      if (consignment?.shipping && consignment.shipping.length > 0) {
        return consignment.shipping;
      }
    }).filter((item) => item !== undefined).flat();
    return shipping;
  }

  const handleFilterChange = (data) => {
    if (data.startDate && data.endDate) {
      setOrderFilters({...orderFilters, min_date_created: data.startDate, max_date_created: data.endDate});
    }
  };

  const printOrder = async (text) => {
    setPreview(true);
    setMessage(text);
  };

  const closePreviewModal = () => {
    setPreview(false);
    setMessage(null);
  }

  return (
    <div>
      <Box sx={{ margin: 2, flexDirection: { xs: 'column', sm: 'row' }, display: 'flex', gap: 2 }}>
        <Box sx={{ width: '100%', maxWidth: { sm: 'none', xs: '100%' } }}>
          <StartEndTimePicker handleDateChange={handleFilterChange} />
        </Box>
      </Box>
      <Divider />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          paddingLeft: 2,
          '& .MuiAccordionSummary-content': {
            justifyContent: 'space-between',
          },
          '& .MuiTableCell-root': {
            fontSize: { xs: '0.75rem', sm: '1rem' }, // smaller font size on xs screens
            padding: '6px 8px', // reduced padding
          },
        }}
      >
        {orders && orders?.map((order) => (
          <Accordion key={order.id} expanded={expanded === order.id} onChange={() => setExpanded(order.id)}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'space-between',
                  alignItems: { sm: 'center' },
                  gap: { xs: 0.5, sm: 2, md: 5 },
                }}
              >
                <Typography>{order.id}</Typography>
                <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
                <Typography noWrap>
                  {order.billing_address.first_name} {order.billing_address.last_name}
                </Typography>
                <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
                <Typography>${order.total_inc_tax}</Typography>
                <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
                <Typography>{order.status}</Typography>
                <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
                <Typography>{moment(order.date_created).format('MM/DD/YYYY')}</Typography>
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
                      sx={{
                        color: 'Black',
                        fontWeight: 'bold',
                      }}
                      size={"small"}
                      variant="contained"
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
                            sx={{
                              color: 'Black',
                              fontWeight: 'bold',
                            }}
                            size={"small"}
                            variant="contained"
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
                          sx={{
                            color: 'Black',
                            fontWeight: 'bold',
                          }}
                            size={"small"}
                            variant="contained"
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
      {preview && <PrintPreview text={message} closePreview={closePreviewModal} />}
    </div>
  );
}
