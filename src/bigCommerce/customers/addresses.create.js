import { api_bigCommerce } from '../api/api.bigCommerce';

export const createAddressAPI = async (address, customerId) => {
  const result = {
    address: null,
    error: null
  }
  try {
    const apiResponse = await api_bigCommerce.post('/v3/customers/addresses', [{...address, customer_id: customerId}]);
    result.address = apiResponse.data.data[0];
  } catch (error) {
    result.error = JSON.stringify(error.response.data.errors);
  }
  return result;
}