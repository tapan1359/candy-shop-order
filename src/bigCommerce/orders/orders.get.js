// useing ipcmain on the main proccess to listen a request from this render file
import { api_bigCommerce } from '../api/api.bigCommerce';

// In your renderer file (e.g., a React component)
export const getOrders = async ({ params = {}, order_id = '' }) => {
  console.log('getOrders', params, order_id);
  try {
    // Create the Axios config object
    const response = await api_bigCommerce({
      method: 'get',
      url: `/v2/orders${order_id ? `/${order_id}` : ''}`,
      params,

    });

    // Send the request to the main process and wait for the response
    //   response.data.map(order => console.log(order));
    console.log('getOrders response', response);
    return response.data;
  } catch (error) {
    console.error('Error in getOrders:', error);
  }
};

// api to get all avalable order status's for orders
export const getOrderStatus = async () => {
  try {
    // Create the Axios config object
    const response = await api_bigCommerce({
      method: 'get',
      url: '/v2/order_statuses',
    });

    // Send the request to the main process and wait for the response
    //   response.data.map(order => console.log(order));
    // console.log('getOrderStatus response', response);
    return response.data;
  } catch (error) {
    console.error('Error in getOrderStatus:', error);
  }
};
