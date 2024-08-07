import { api_bigCommerce } from '../api/api.bigCommerce';

export const getAddresses = async (params) => {
  const response = await api_bigCommerce.get('/v3/customers', {
    params,
  });
  return response.data;
};
