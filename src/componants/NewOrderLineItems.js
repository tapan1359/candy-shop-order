import React, { useEffect } from 'react'
import { TextField, Button, Box, Table, TableBody, TableCell, MenuItem, TableContainer, TableHead, TableRow, Select, Autocomplete } from '@mui/material'
import { getProducts } from '../bigCommerce/products/products.get'
import { useSelector, useDispatch } from 'react-redux'
import { setCart } from '../redux/bigCommerce/newOrderSlice'


export default function NewOrderLineItems() {
  const lineItems = useSelector((state) => state.newOrders.cart || []);
  const [products, setProducts] = React.useState([])
  const [lineItem, setLineItem] = React.useState({
    image: '',
    sku: '',
    name: '',
    price: '',
    quantity: '',
    tax: '',
    total: ''
  })
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('lineItems', lineItems);
  }, [lineItems]);

  const addLineItem = () => {
    // Add the current line item to the list
    dispatch(setCart([...lineItems, lineItem]))
    // Reset the input fields for the next line item
    setLineItem({
      image: '',
      sku: '',
      name: '',
      price: '',
      quantity: '',
      tax: '',
      total: ''
    })

  }

  const handleChange = (e, index = null) => {
    if (index != null) {
      // Handle change for existing line item
      const updatedLineItems = [...lineItems];
      updatedLineItems[index][e.target.name] = e.target.value;
      dispatch(setCart(updatedLineItems));
    } else {
      // Handle change for new line item
      //if the target changed is total or qty or tax then update the total
      if(e.target.name === 'quantity'){
        setLineItem({ ...lineItem, [e.target.name]: e.target.value, total: ((lineItem.price * e.target.value) + (lineItem.tax * e.target.value)).toFixed(2) })
      }else if(e.target.name === 'tax'){
        setLineItem({ ...lineItem, [e.target.name]: e.target.value, total: ((lineItem.price * lineItem.quantity) + (e.target.value * lineItem.quantity)).toFixed(2) })
      }else if(e.target.name === 'total'){
        setLineItem({ ...lineItem, [e.target.name]: e.target.value, total: e.target.value })
      }else if(e.target.name === 'price'){
        setLineItem({ ...lineItem, [e.target.name]: e.target.value, total: ((e.target.value * lineItem.quantity) + (lineItem.tax * lineItem.quantity)).toFixed(2) })
      }
      else{
        setLineItem({ ...lineItem, [e.target.name]: e.target.value })
      }
    }

  }

  const removeLineItem = (index) => {
    const newLineItems = [...lineItems];
    newLineItems.splice(index, 1);
    dispatch(setCart(newLineItems));
  }

  const SearchProducts = async (params) => {
    setLineItem({
      ...lineItem,
      name: params.keyword
  
    })
    try{
    const response = await getProducts(params);
    setProducts(response.data);
    console.log('response', response);
    }catch(error){
    }
  }

  const handleProductSelect = (event, newValue) => {
    console.log('handleProductSelect', newValue);
    if(!newValue){
      setLineItem({
        ...lineItem,
        image: '',
        sku: '',
        name: '',
        price: '',
        quantity: '',
        tax: '',
        total: ''
      })
      return;
    }
    setLineItem({
      ...lineItem,
      image: newValue.primary_image?.url_standard,
      sku: newValue.sku,
      name: newValue.name,
      price: newValue.price,
      quantity: 1,
      tax: 0,
      total: newValue.price,
      id: newValue.id
    })
    setProducts([]);
  }

  //make a componant for the render input that has a small image and a text next to it on one line
const RenderInput = (params) => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {/* <img src={params.option.image_url} alt={params.option.name} width="50" height="50" /> */}
        {/* <span>{params.option.name}</span> */}
      </Box>
    )
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
            {lineItems.map((item, index) => (
              console.log('item', item.primary_image?.url_standard, item.name),
              <TableRow key={index}>
                <TableCell><img src={item.image} alt={item.name} width="50" height="50" /></TableCell>
                <TableCell>{item.sku}
                  {/* <TextField name="sku" value={item.sku} /> */}
                </TableCell>
                <TableCell>{item.name}
                  {/* <TextField name="name" value={item.name} /> */}
                </TableCell>
                <TableCell>{item.price}
                  {/* <TextField name="price" value={item.price} /> */}
                </TableCell>
                <TableCell>{item.quantity}
                  {/* <TextField name="quantity" value={item.quantity} /> */}
                </TableCell>
                <TableCell>{item.tax}
                  {/* <TextField name="tax" value={item.tax} /> */}
                </TableCell>
                <TableCell>{item.total}
                  {/* <TextField name="total" value={item.total} /> */}
                </TableCell>
                <TableCell>
                  <Button onClick={() => removeLineItem(index)}>Remove</Button>
                </TableCell>
              </TableRow>
            ))}

            {/* New Line Item */}
            <TableRow>
              <TableCell>{lineItem.sku && <img src={lineItem.image} alt={lineItem.name} width="50" height="50" />}</TableCell>
              <TableCell>
                <TextField name="sku" value={lineItem.sku} onChange={handleChange} />
              </TableCell>
              <TableCell>
                <Autocomplete 
                freeSolo
                  sx={{ width: 300 }}
                  id="combo-box-demo"
                  options={products}
                  getOptionLabel={(option) => option.name}
                  // sx={{ width: 300 }}
                  renderInput={(params) => <TextField {...params} label="Combo box" />}
                  onChange={(event, newValue) => handleProductSelect(event, newValue)}
                  onInputChange={(event, newValue) => SearchProducts({'keyword': newValue, 'include': 'primary_image'})}
                  onOpen={() => SearchProducts({'include': 'primary_image'})}
                />
                </TableCell>
              <TableCell>
                <TextField name="price" value={lineItem.price} onChange={handleChange} />
              </TableCell>
              <TableCell>
                <TextField name="quantity" value={lineItem.quantity} onChange={handleChange} />
              </TableCell>
              <TableCell>
                <TextField name="tax" value={lineItem.tax} onChange={handleChange} />
              </TableCell>
              <TableCell>{((lineItem.price * lineItem.quantity) + (lineItem.tax * lineItem.quantity)).toFixed(2)}
                {/* <TextField name="total" value={lineItem.total} onChange={handleChange} /> */}
              </TableCell>
              <TableCell>
                <Button onClick={addLineItem} disabled={lineItem.name === ''}>Add</Button>
                </TableCell>

            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" color="primary" onClick={addLineItem}>
        Add Item
      </Button>
    </Box>
  )
}
