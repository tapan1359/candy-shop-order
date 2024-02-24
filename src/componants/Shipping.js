import React, {useState} from 'react';
import AddressForm from "./AddressForm";
import {
  Autocomplete,
  Box,
  Button, Divider,
  Modal, Table, TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';

const DEFAULT_TAX = 6;

const createDefaultLineItem = () => ({
  image: '',
  sku: '',
  name: '',
  price: '',
  quantity: '',
  tax: DEFAULT_TAX,
  total: '',
});

const priceWithTax = (price, quantity, tax) => {
  const totalPrice = quantity * price;
  const calculatedTax = (totalPrice * tax) / 100;
  return (totalPrice + calculatedTax).toFixed(2);
}

export default function Shipping({addresses, products, consignment, updateConsignmentShippingAddress, updateConsignmentItems, removeConsignment}) {

  const [modalOpen, setModalOpen] = useState(false);
  const [modelItem, setModelItem] = useState(createDefaultLineItem());

  const setShippingAddress = (address) => {
    updateConsignmentShippingAddress(consignment.internalId, address);
  }

  const openModal = () => {
    setModalOpen(true);
  }

  const handleSelectModelItem = (item) => {
    if (item) {
      setModelItem({
        id: item.id,
        image: item.primary_image?.url_standard,
        sku: item.sku,
        name: item.name,
        price: item.price,
        quantity: 1,
        tax: DEFAULT_TAX,
        total: priceWithTax(item.price, 1, DEFAULT_TAX),
      });
    }
  }

  const handleModalAddItem = () => {
    if (modelItem) {
      consignment.items = [...consignment.items, modelItem];
    }
    setModalOpen(false);
    setModelItem(createDefaultLineItem());
  }

  const removeLineItem = (index) => {
    consignment.items.splice(index, 1);
    updateConsignmentItems(consignment.internalId, consignment.items);
  }

  const handleUpdateField = (e) => {
    const newItem = {...modelItem, [e.target.name]: e.target.value};

    if (e.target.name === 'price' || e.target.name === 'quantity' || e.target.name === 'tax') {
      newItem.total = priceWithTax(newItem.price, newItem.quantity, newItem.tax);
    }
    setModelItem(newItem);
  }

  const handleManualInputChange = (value) => {
    setModelItem({...modelItem, name: value});
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        boxShadow: 2,
        borderRadius: '8px',
        p: 2,
        gap: 3,
      }}
    >
      <Box>
        <AddressForm title={"Shipping"} addresses={addresses} address={consignment.address} setAddress={setShippingAddress} />
      </Box>
      <Divider orientation={"vertical"} flexItem />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2}}>
          <Typography variant={"h6"}>Products</Typography>
          <IconButton
            onClick={() => removeConsignment(consignment.internalId)}
            size='small'
            color='error'
            >
              <DeleteIcon />
            </IconButton>
        </Box>
        <TableContainer>
          <Table aria-label="simple table">
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
              {consignment?.items.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell><img src={item.image} alt={item.name} width="50" height="50" /></TableCell>
                    <TableCell>{item.sku}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.tax}</TableCell>
                    <TableCell>{item.total}</TableCell>
                    <TableCell>
                      <Button
                        size={"small"}
                        variant={"outlined"}
                        onClick={() => removeLineItem(i)}
                      >Remove</Button>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button
          onClick={openModal}
          size={"small"}
          variant={"outlined"}
        >
          Add Product
        </Button>
      </Box>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
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
            width: 400,
            transform: 'translate(80%, 50%)',
            gap: 2
          }}
        >          
          <Autocomplete
            disabled={!products}
            sx={{ width: 300 }}
            id="combo-box-demo"
            options={products}
            getOptionLabel={(option) => option.name || ''}
            renderInput={(params) => <TextField {...params} label="Products " />}
            onChange={(event, newValue) => handleSelectModelItem(newValue)}
            filterOptions={(options, state) => options.filter((option) => option.name.toLowerCase().includes(state.inputValue.toLowerCase()))}
            freeSolo
            onInputChange={(e, value) => handleManualInputChange(value)}
          />
          <TextField
            sx={{ width: 300 }}
            name="sku"
            value={modelItem?.sku}
            label={"SKU"}
          />
          <TextField
            sx={{ width: 300 }}
            name="price" type="number"
            value={modelItem?.price}
            label={"Price"}
            onChange={handleUpdateField}
          />
          <TextField
            sx={{ width: 300 }}
            name="quantity"
            type="number"
            value={modelItem?.quantity}
            label={"Quantity"}
            onChange={handleUpdateField}
          />
          <TextField
            sx={{ width: 300 }}
            name="tax"
            type="number"
            value={modelItem?.tax}
            label={"Tax"}
            onChange={handleUpdateField}
          />
          <Typography
            variant="h6"
            sx={{ width: 300 }}
          >
            {modelItem?.total}
          </Typography>
          <Button
            onClick={handleModalAddItem}
            size={"small"}
            variant={"outlined"}
          >
            Add
          </Button>
        </Box>
      </Modal>

    </Box>
  );
}