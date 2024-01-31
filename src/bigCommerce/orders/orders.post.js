import axios from 'axios';
import { api_bigCommerce } from '../api/api.bigCommerce';


const createProductsforAPI = (products) => {
  console.log('createProductsforAPI', products);
  return products.map((product) => {
    return {
      product_id: product.id,
      quantity: product.quantity,
      price_inc_tax: product.price,
      price_ex_tax: product.price,
    };
  });
};

const createBillingForAPI = (billing) => {
  if (billing) {
    if (billing.address1) {
      billing.street_1 = billing.address1;
      delete billing.address1;
    }
    if (billing.address2) {
      billing.street_2 = billing.address2;
      delete billing.address2;
    }
  }

  return billing;
}

const createShippingForAPI = (shipping) => {
  if (shipping) {
    if (shipping.address1) {
      shipping.street_1 = shipping.address1;
      delete shipping.address1;
    }
    if (shipping.address2) {
      shipping.street_2 = shipping.address2;
      delete shipping.address2;
    }
  }

  return shipping;
}

export async function newOrder({
  customerId,
  billling,
  shipping,
  products,
  customerMessage,
}) {


  console.log('newOrder', customerId, billling, shipping, products, customerMessage);

  const productsForAPI = createProductsforAPI(products);
  const billingForAPI = createBillingForAPI(billling);
  const shippingForAPI = createShippingForAPI(shipping);

  try {
    const data = {
      customer_id: customerId,
      billing_address: billingForAPI,
      shipping_addresses: [shippingForAPI],
      products: productsForAPI,
      customer_message: customerMessage,
    };

    console.log('newOrder data', data);

    const response = await api_bigCommerce.post('/v2/orders', data);
    return response.data;

    // const { ipcRenderer } = window.require('electron');

    // // Create Promises to wait for newOrderResponse and newOrderError events
    // const responsePromise = new Promise((resolve, reject) => {
    //   ipcRenderer.once('newOrderResponse', (event, arg) => {
    //     console.log('newOrderResponse', arg);
    //     resolve(arg);
    //   });
    // });

    // const errorPromise = new Promise((resolve, reject) => {
    //   ipcRenderer.once('newOrderError', (event, arg) => {
    //     console.log('Error in newOrder:', JSON.parse(arg));
    //     resolve({ error: JSON.parse(arg) });
    //   });
    // });

    // // Send the 'newOrder' event
    // ipcRenderer.send('newOrder', data);

    // // Wait for either response or error
    // const result = await Promise.race([responsePromise, errorPromise]);

    // // Return the result
    // return result;
  } catch (error) {
    console.error('Error in newOrder:', error);
    throw error;
  }
}
