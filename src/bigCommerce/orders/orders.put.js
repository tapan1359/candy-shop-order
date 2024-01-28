import { api_bigCommerce } from '../api/api.bigCommerce';

// update a order
export const updateOrder = async ({ order, update_fields }) => {
  console.log('updateOrder', order, update_fields);
  try {
    // Create the Axios config object
    const response = await api_bigCommerce({
      method: 'PUT',
      url: `/v2/orders/${order.id}`,
      data: JSON.stringify({
        status_id: update_fields.status_id,
      }),
    });
    return response.data;
  } catch (error) {
    console.error('Error in updateOrder:', error);
  }
};
