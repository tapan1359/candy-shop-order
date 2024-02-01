import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import StartEndTimePicker from '../../componants/StartEndTimePicker';
import OrderLineItem from './OrderLineItem';
import { getOrderStatus } from '../../bigCommerce/orders/orders.get';
import { setOrderStatuses } from '../../redux/bigCommerce/ordersSlice';
import { getPrinters, printPDF } from '../../print';
import { Autocomplete, TextField, Grid } from '@mui/material';


export default function OrderIndex() {
  const orders = useSelector((state) => state.orders.orders);
  const dispatch = useDispatch();
  const [selectedPrinter, setSelectedPrinter] = useState('');
  const [printers, setPrinters] = useState([]);

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
    console.log('printersWithName', printersWithName);
    setPrinters(printersWithName);
  };


  const printOrder = async (order) => {
    console.log('printing order', order);
    console.log('selectedPrinter', selectedPrinter);
    await printPDF(order.customer_message, selectedPrinter, 100, 100);
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
      {/* for each order make a nice row displaying info for that order using mui */}
      {orders && orders.map((order) => (
        <OrderLineItem order={order} key={order.id} printOrder={printOrder} />
      ))}

    </div>
  );
}
