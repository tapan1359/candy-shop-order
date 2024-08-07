import React, { useEffect } from 'react';
import {
  TextField, Button, Box, Table, TableBody, TableCell, MenuItem, TableContainer, TableHead, TableRow, Select, Autocomplete,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';

const createDefaultLineItem = () => ({
  image: '',
  sku: '',
  name: '',
  price: '',
  quantity: '',
  tax: 6,
  total: '',
});

export default function NewOrderLineItems({ products, setSelectedProducts }) {
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [blankItems, setBlankItems] = React.useState([]);
  const dispatch = useDispatch();

  const addNewLineItem = () => {
    setBlankItems([...blankItems, createDefaultLineItem()]);
  };

  const addLineItem = (index) => {
    const item = blankItems[index];
    setSelectedItems([...selectedItems, item]);
    setSelectedProducts([...selectedItems, item]);
    setBlankItems(blankItems.filter((_, i) => i !== index));
  };

  const handleChange = (event, index) => {
    const { name, value } = event.target;
    const updatedItem = { ...blankItems[index], [name]: value };
    setBlankItems([...blankItems.slice(0, index), updatedItem, ...blankItems.slice(index + 1)]);
  };

  const handleProductSelect = (index, newValue) => {
    let item = blankItems[index];
    if (!newValue) {
      item = createDefaultLineItem();
    } else {
      item.id = newValue.id;
      item.image = newValue.primary_image?.url_standard;
      item.sku = newValue.sku;
      item.name = newValue.name;
      item.price = newValue.price;
      item.quantity = 1;
      item.tax = 0;
      item.total = newValue.price;
    }
    setBlankItems([...blankItems.slice(0, index), item, ...blankItems.slice(index + 1)]);
  };

  const calculateTotal = (item) => {
    const totalWithOutTax = item.price * item.quantity;
    const tax = (totalWithOutTax * item.tax) / 100;
    const total = totalWithOutTax + tax;
    return total.toFixed(2);
  }

  const handleQuantityChange = (event, index) => {
    const { value } = event.target;
    const item = blankItems[index];
    item.quantity = value;
    item.total = calculateTotal(item);
    setBlankItems([...blankItems.slice(0, index), item, ...blankItems.slice(index + 1)]);
  };

  const handleTaxChange = (event, index) => {
    const { value } = event.target;
    const item = blankItems[index];
    item.tax = value;
    item.total = calculateTotal(item);
    setBlankItems([...blankItems.slice(0, index), item, ...blankItems.slice(index + 1)]);
  };

  const removeLineItem = (index) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  // make a componant for the render input that has a small image and a text next to it on one line
  function RenderInput(params) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {/* <img src={params.option.image_url} alt={params.option.name} width="50" height="50" /> */}
        {/* <span>{params.option.name}</span> */}
      </Box>
    );
  }
  return (
    <Box>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Tax</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Existing Line Items */}
            {selectedItems.map((item, index) => (
              console.log('item', item),
                <TableRow key={index}>
                  <TableCell><img src={item.image} alt={item.name} width="50" height="50" /></TableCell>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.price}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.tax}</TableCell>
                  <TableCell>{item.total}</TableCell>
                  <TableCell>
                    <Button onClick={() => removeLineItem(index)}>Remove</Button>
                  </TableCell>
                </TableRow>
            ))}
            {/* New Line Item */}
            {blankItems.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.sku && <img src={item.image} alt={item.name} width="50" height="50" />}</TableCell>
                <TableCell>
                  <TextField name="sku" value={item.sku} />
                </TableCell>
                <TableCell>
                  <Autocomplete
                    freeSolo
                    sx={{ width: 300 }}
                    id="combo-box-demo"
                    options={products}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => <TextField {...params} label="Products " />}
                    onChange={(event, newValue) => handleProductSelect(index, newValue)}
                    filterOptions={(options, state) => options.filter((option) => option.name.toLowerCase().includes(state.inputValue.toLowerCase()))}
                  />
                </TableCell>
                <TableCell>
                  <TextField name="price" type="number" value={item.price} onChange={(event) => handleChange(event, index)} />
                </TableCell>
                <TableCell>
                  <TextField name="quantity" type="number" value={item.quantity} onChange={(event) => handleQuantityChange(event, index)} />
                </TableCell>
                <TableCell>
                  <TextField name="tax" type="number" value={item.tax} onChange={(event) => handleTaxChange(event, index)} />
                </TableCell>
                <TableCell>{item.total}</TableCell>
                <TableCell>
                  <Button onClick={() => addLineItem(index)} disabled={item.name === ''}>Add</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" color="primary" onClick={addNewLineItem}>
        Add Item
      </Button>
    </Box>
  );
}
