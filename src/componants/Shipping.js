import React, {useState} from 'react';
import {useSelector} from 'react-redux';
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
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';
import CreateAddress from "./CreateAddress";
import CustomAlert from "../CustomAlert";

const DEFAULT_TAX = 6;

const createDefaultLineItem = () => ({
  image: '',
  sku: '',
  name: '',
  price: '',
  quantity: 1,
  tax: DEFAULT_TAX,
  total: '',
});

const priceWithTax = (price, quantity, tax) => {
  const totalPrice = quantity * price;
  const calculatedTax = (totalPrice * tax) / 100;
  return (totalPrice + calculatedTax).toFixed(2);
}

export default function Shipping({customerId, products, consignment, updateConsignmentShippingAddress, updateConsignmentItems, removeConsignment}) {

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));
  const [modalOpen, setModalOpen] = useState(false);
  const [modelItem, setModelItem] = useState(createDefaultLineItem());
  const [alertMessage, setAlertMessage] = useState(null);

  const setShippingAddress = (address) => {
    updateConsignmentShippingAddress(consignment.internalId, address);
  }

  const openModal = () => {
    setModelItem(createDefaultLineItem());
    setModalOpen(true);
  }

  const handleSelectModelItem = (item) => {

    if (item?.inventory_level === 0) {
      setAlertMessage({severity: "error", message: "This product is out of stock!"});
      return;
    }

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

  const handleResetModal = () => {
    setModalOpen(false);
    setModelItem(createDefaultLineItem());
  }

  return (
    <>
      {alertMessage && (
        <CustomAlert
          severity={alertMessage.severity}
          message={alertMessage.message}
          onClose={() => setAlertMessage(null)}
        />
      )}
      <Box
        sx={{
          flexDirection: { xs: 'column', md: 'row' }, // Stack vertically on small screens
          boxShadow: 2,
          borderRadius: '8px',
          p: 2,
          gap: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          border: 4,
        }}
      >
        <Box flex={1} sx={{
            width: "100%",
          }} >
          <CreateAddress buttonName="New Shipping Address" customerId={customerId} setParentAddress={setShippingAddress}/>
          <AddressForm title={"Shipping"} customerId={customerId} address={consignment.address} setAddress={setShippingAddress} />
        </Box>
        {matches ? <Divider sx={{ my: 2 }} /> : <Divider orientation="vertical" flexItem />}
        <Box
          flex={2}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
            width: '100%',
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
            style={{ backgroundColor: 'red', color: 'black'}}
          >
            Add PRODUCTS TO LEFT SHIPPING
          </Button>
        </Box>
        <Modal open={modalOpen} onClose={handleResetModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: 400 }, // Responsive width
              bgcolor: 'background.paper',
              borderRadius: '8px',
              boxShadow: 24,
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <Autocomplete
              disabled={!products}
              sx={{ width: 300 }}
              id="combo-box-demo"
              options={products}
              getOptionLabel={(option) => option.name || ''}
              renderInput={(params) => <TextField {...params} label="Products " />}
              renderOption={(props, option) => (
                <li {...props}>
                  <img src={option.primary_image?.url_standard} alt={option.name} width="50" height="50" />
                  {option.name}
                </li>
              )}

              onChange={(event, newValue) => handleSelectModelItem(newValue)}
              filterOptions={(options, state) => options.filter((option) => option.name.toLowerCase().includes(state.inputValue.toLowerCase()) || option.sku.toLowerCase().includes(state.inputValue.toLowerCase()))}
              freeSolo
              // onInputChange={(e, value) => handleManualInputChange(value)}
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
    </>
  );
}