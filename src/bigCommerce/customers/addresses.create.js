import { api_bigCommerce } from '../api/api.bigCommerce';

export const createAddressAPI = async (address, customerId) => {
  console.log('createAddressAPI', address, customerId);
  const result = {
    address: null,
    error: null
  }
  try {
    const apiResponse = await api_bigCommerce.post('/v3/customers/addresses', [{...address, customer_id: customerId}]);
    console.log('createAddressAPI response', apiResponse.data.data[0]);
    result.address = apiResponse.data.data[0];
  } catch (error) {
    result.error = JSON.stringify(error.response.data.errors);
  }
  console.log('createAddressAPI', result);
  return result;
}