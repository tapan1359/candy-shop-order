import { api_bigCommerce } from "../api/api.bigCommerce";


export const searchCustomers = async (params) => {
    console.log('searchCustomers', params);
    const response = await api_bigCommerce.get('/v3/customers/addresses', {
        params: params
    });
    console.log('searchCustomers response', response);
    return response.data;
}


export const getCustomers = async (params) => {
    console.log('searchCustomers', params);
    const response = await api_bigCommerce.get('/v3/customers', {
        params: params
    });
    console.log('searchCustomers response', response);
    return response.data;
}

export const getCustomerAddresses = async (params) => {
    console.log('searchCustomers', params);
    const response = await api_bigCommerce.get('/v3/customers/addresses', {
        params: params
    });
    console.log('getCustomerAddresses response', response);
    return response.data;
}



