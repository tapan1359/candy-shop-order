import { api_bigCommerce } from '../api/api.bigCommerce';

export const createCustomerAPI = async (customer) => {
  const result = {
    customer: null,
    error: null
  }
  try {
    const response = await api_bigCommerce.post('/v3/customers', [customer]);
    result.customer = response.data.data[0];
  } catch (error) {
    result.error = JSON.stringify(error.response.data.errors);
  }
  return result;
}
