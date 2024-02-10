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

export default function Shipping({addresses, products, consignment, removeConsignment}) {

  const [modalOpen, setModalOpen] = useState(false);
  const [modelItem, setModelItem] = useState(createDefaultLineItem());
  const [selectedProducts, setSelectedProducts] = useState([]);
  const setShippingAddress = (address) => {
    consignment.address = address;
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
    setSelectedProducts([...selectedProducts, modelItem]);
    consignment.lineItems = [...consignment.lineItems, modelItem];
    setModalOpen(false);
  }

  const removeLineItem = (index) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
    consignment.lineItems = consignment.lineItems.filter((_, i) => i !== index);
  }

  const handleUpdateField = (e) => {
    const newItem = {...modelItem, [e.target.name]: e.target.value};

    if (e.target.name === 'price' || e.target.name === 'quantity' || e.target.name === 'tax') {
      newItem.total = priceWithTax(newItem.price, newItem.quantity, newItem.tax);
    }
    setModelItem(newItem);
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: 2,
        borderRadius: '8px',
        p: 4,
        gap: 4,
      }}
    >
      <AddressForm title={"Shipping"} addresses={addresses} setAddress={setShippingAddress} />
      <Divider orientation={"vertical"} flexItem />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant={"h6"}>Products</Typography>
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
              {selectedProducts.map((item, i) => (
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
            transform: 'translate(50%, 50%)',
          }}
        >
          <Autocomplete
            disabled={!products}
            sx={{ width: 300 }}
            id="combo-box-demo"
            options={products}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => <TextField {...params} label="Products " />}
            onChange={(event, newValue) => handleSelectModelItem(newValue)}
            filterOptions={(options, state) => options.filter((option) => option.name.toLowerCase().includes(state.inputValue.toLowerCase()))}
          />
          <TextField name="sku" value={modelItem.sku} />
          <TextField name="price" type="number" value={modelItem.price} onChange={handleUpdateField} />
          <TextField name="quantity" type="number" value={modelItem.quantity} onChange={handleUpdateField} />
          <TextField name="tax" type="number" value={modelItem.tax} onChange={handleUpdateField} />
          <Typography
            variant="h6"
          >{modelItem.total}</Typography>
          <Button
            onClick={handleModalAddItem}
            size={"small"}
            variant={"outlined"}
          >
            Add
          </Button>
        </Box>
      </Modal>
      <Button
        onClick={() => removeConsignment(consignment.internalId)}
        size={"small"}
        variant={"outlined"}
      >
        Remove Consignment
      </Button>
    </Box>
  );
}