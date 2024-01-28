import { api_bigCommerce } from "../api/api.bigCommerce";



export const getAddresses = async (params) => {
    console.log('searchCustomers', params);
    const response = await api_bigCommerce.get('/v3/customers', {
        params: params
    });
    console.log('searchCustomers response', response);
    return response.data;
}