import { api_bigCommerce } from "../api/api.bigCommerce";




export const getProducts = async (params) => {
    console.log('getProducts', params);
    const response = await api_bigCommerce.get('/v3/catalog/products', {
        params: params
    });
    console.log('getProducts response', response);
    return response.data;
}