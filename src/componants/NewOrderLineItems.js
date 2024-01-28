import React, { useEffect } from 'react';
import {
  TextField, Button, Box, Table, TableBody, TableCell, MenuItem, TableContainer, TableHead, TableRow, Select, Autocomplete,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { getProducts } from '../bigCommerce/products/products.get';
import { setCart } from '../redux/bigCommerce/newOrderSlice';

const createDefaultLineItem = () => ({
  image: '',
  sku: '',
  name: '',
  price: '',
  quantity: '',
  tax: '',
  total: '',
});

export default function NewOrderLineItems({ products }) {
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [blankItems, setBlankItems] = React.useState([]);
  const dispatch = useDispatch();

  const addNewLineItem = () => {
    setBlankItems([...blankItems, createDefaultLineItem()]);
  };

  const addLineItem = (index) => {
    const item = blankItems[index];
    setSelectedItems([...selectedItems, item]);
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
      console.log('newValue', newValue);
      item.image = newValue.primary_image?.url_standard;
      item.sku = newValue.sku;
      item.name = newValue.name;
      item.price = newValue.price;
      item.quantity = 1;
      item.tax = 0;
      item.total = newValue.price;
    }
    console.log('item', item);
    setBlankItems([...blankItems.slice(0, index), item, ...blankItems.slice(index + 1)]);
  };

  const handleQuantityChange = (event, index) => {
    const { value } = event.target;
    const item = blankItems[index];
    item.quantity = value;
    item.total = item.price * value;
    setBlankItems([...blankItems.slice(0, index), item, ...blankItems.slice(index + 1)]);
  };

  const handleTaxChange = (event, index) => {
    const { value } = event.target;
    const item = blankItems[index];
    item.tax = value;
    item.total = item.price * item.quantity + value;
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
                  <TextField name="price" value={item.price} onChange={(event) => handleChange(event, index)} />
                </TableCell>
                <TableCell>
                  <TextField name="quantity" value={item.quantity} onChange={(event) => handleQuantityChange(event, index)} />
                </TableCell>
                <TableCell>
                  <TextField name="tax" value={item.tax} onChange={(event) => handleTaxChange(event, index)} />
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
