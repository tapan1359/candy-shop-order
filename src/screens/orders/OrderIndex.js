import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Grid,
  FormControl, InputLabel, Select, MenuItem,
  Button,
  TextField,
  Accordion, AccordionSummary, AccordionDetails, Box, Typography, Divider,
  CircularProgress,
} from '@mui/material';
import moment from 'moment';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PrintPreview from '../../componants/PrintPreview';
import { getOrders } from '../../bigCommerce/orders/orders.get';
import FilterListIcon from '@mui/icons-material/FilterList';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'

export default function OrderIndex() {

  const [orders, setOrders] = useState([]);

  const [expanded, setExpanded] = useState(null);
  const [preview, setPreview] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [filterParams, setFilterParams] = useState({
    startDate: moment().subtract(1, 'week'),
    endDate: moment(),
    status: '',
    email: '',
    minId: '',
    maxId: '',
    page: 1,
    limit: 50,
    sort: 'date_created:desc'
  });
  const [orderFilters, setOrderFilters] = useState({});


  useEffect(() => {
    const getOrdersfromAPI = async () => {
      try {
        setLoading(true);
        const orders = await getOrders({ params: orderFilters });
        setOrders(orders);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getOrdersfromAPI();
  }, [orderFilters]);

  useEffect(() => {
    applyFilters();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filterParams.page, filterParams.limit]);

  const getShipping = (order) =>  {
    const shipping = order.consignments.map((consignment) => {
      if (consignment?.shipping && consignment.shipping.length > 0) {
        return consignment.shipping;
      }
    }).filter((item) => item !== undefined).flat();
    return shipping;
  }

  const printOrder = async (text) => {
    setPreview(true);
    setMessage(text);
  };

  const closePreviewModal = () => {
    setPreview(false);
    setMessage(null);
  }

  const handleDateChange = (value, name) => {
    setFilterParams({ ...filterParams, [name]: value });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterParams(prev => ({ ...prev, [name]: value }));
  };

  // Function to apply the filters
  const applyFilters = () => {
    const filters = {
      ...(filterParams.startDate && { min_date_created: filterParams.startDate instanceof moment ? filterParams.startDate.toISOString() : filterParams.startDate }),
      ...(filterParams.endDate && { max_date_created: filterParams.endDate instanceof moment ? filterParams.endDate.toISOString() : filterParams.endDate }),
      ...(filterParams.status && { status_id: filterParams.status }),
      ...(filterParams.email && { email: filterParams.email }),
      ...(filterParams.minId && { min_id: filterParams.minId }),
      ...(filterParams.maxId && { max_id: filterParams.maxId }),
      page: filterParams.page,
      limit: filterParams.limit,
      sort: filterParams.sort,
    };
    setOrderFilters(filters);
  };

  const resetFilters = () => {
    setFilterParams({
      startDate: moment().subtract(1, 'week'),
      endDate: moment(),
      status: '',
      email: '',
      minId: '',
      maxId: '',
      page: 1,
      limit: 50,
      sort: 'date_created:desc'
    });
  }

  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<FilterListIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Filter Orders</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  label="Start Date"
                  value={filterParams.startDate}
                  onChange={(newValue) => handleDateChange(newValue, 'startDate')}
                  renderInput={(params) => <TextField {...params} fullWidth size='small' />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  label="End Date"
                  value={filterParams.endDate}
                  onChange={(newValue) => handleDateChange(newValue, 'endDate')}
                  renderInput={(params) => <TextField {...params} fullWidth size='small' />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  id="status"
                  value={filterParams.status}
                  onChange={handleFilterChange}
                  label="Status"
                  name="status"
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  <MenuItem value="0">Incomplete</MenuItem>
                  <MenuItem value="1">Pending</MenuItem>
                  <MenuItem value="2">Shipped</MenuItem>
                  <MenuItem value="3">Partially Shipped</MenuItem>
                  <MenuItem value="4">Refunded</MenuItem>
                  <MenuItem value="5">Cancelled</MenuItem>
                  <MenuItem value="6">Declined</MenuItem>
                  <MenuItem value="7">Awaiting Payment</MenuItem>
                  <MenuItem value="8">Awaiting Pickup</MenuItem>
                  <MenuItem value="9">Awaiting Shipment</MenuItem>
                  <MenuItem value="10">Completed</MenuItem>
                  <MenuItem value="11">Awaiting Fulfillment</MenuItem>
                  <MenuItem value="12">Manual Verification Required</MenuItem>
                  <MenuItem value="13">Disputed</MenuItem>
                  <MenuItem value="14">Partially Refunded</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                size="small"
                name="email"
                value={filterParams.email}
                onChange={handleFilterChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Min ID"
                variant="outlined"
                size="small"
                name="minId"
                value={filterParams.minId}
                onChange={handleFilterChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Max ID"
                variant="outlined"
                size="small"
                name="maxId"
                value={filterParams.maxId}
                onChange={handleFilterChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button 
                variant="contained" 
                onClick={applyFilters} 
                size="small"
                fullWidth
              >
                Apply Filters
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button 
                variant="contained" 
                onClick={resetFilters} 
                size="small"
                fullWidth
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      <Divider />
      {loading ? <CircularProgress /> : (
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
        
        <Grid container spacing={2} justifyContent="center" sx={{ marginTop: 2 }}>
          <Button onClick={() => setFilterParams(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))} disabled={filterParams.page === 1}>
            Previous
          </Button>
          <Typography>Page {filterParams.page}</Typography>
          <Button onClick={() => setFilterParams(prev => ({ ...prev, page: prev.page + 1 }))}>
            Next
          </Button>
        </Grid>
      </Box>
      )}
      {preview && <PrintPreview text={message} closePreview={closePreviewModal} />}
    </div>
  );
}
