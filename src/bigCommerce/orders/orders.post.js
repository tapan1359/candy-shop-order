import axios from 'axios';
import { api_bigCommerce } from '../api/api.bigCommerce';

export async function newOrder({
  billingInfo,
  shippingInfo,
  cartInfo,
  giftMessage,
  cart,
}) {
  console.log('billingInfo.customer_id', billingInfo.customer_id, 'shippingInfo.customer_id', shippingInfo.customer_id);
  const { customer_id: _, ...billingInfoWithoutCustomerId } = billingInfo;
  const { customer_id: __, ...shippingInfoWithoutCustomerId } = shippingInfo;

  const newCart = cartInfo.map((item) => {
    if (item.sku) {
      return {
        product_id: item.id,
        quantity: item.quantity,
        price_inc_tax: Number(item.price) + Number(item.tax),
        price_ex_tax: item.price,
      };
    }
    return {
      name: item.name,
      quantity: item.quantity,
      price_inc_tax: Number(item.price) + Number(item.tax),
      price_ex_tax: item.price,
    };
  });

  console.log('newOrder', billingInfo, shippingInfo, cartInfo, giftMessage);

  try {
    const data = {
      billing_address: billingInfoWithoutCustomerId,
      shipping_addresses: [shippingInfoWithoutCustomerId],
      products: newCart,
      customer_message: giftMessage,
      cart,
    };

    if (billingInfo.customer_id) {
      data.customer_id = billingInfo.customer_id;
    }

    console.log('newOrder data', data);
    const { ipcRenderer } = window.require('electron');

    // Create Promises to wait for newOrderResponse and newOrderError events
    const responsePromise = new Promise((resolve, reject) => {
      ipcRenderer.once('newOrderResponse', (event, arg) => {
        console.log('newOrderResponse', arg);
        resolve(arg);
      });
    });

    const errorPromise = new Promise((resolve, reject) => {
      ipcRenderer.once('newOrderError', (event, arg) => {
        console.log('Error in newOrder:', JSON.parse(arg));
        resolve({ error: JSON.parse(arg) });
      });
    });

    // Send the 'newOrder' event
    ipcRenderer.send('newOrder', data);

    // Wait for either response or error
    const result = await Promise.race([responsePromise, errorPromise]);

    // Return the result
    return result;
  } catch (error) {
    console.error('Error in newOrder:', error);
    throw error;
  }
}
