import {api_bigCommerce} from "../api/api.bigCommerce";

export const postNewProduct = async ({name, type, price, weight}) => {

  try {
    const data = {
      name,
      type,
      price,
      weight,
      categories: [34]
    }
    const response = await api_bigCommerce.post('/v3/catalog/products', data);
    return response.data;
  } catch (error) {
    console.log('error creating new product', error);
    throw error;
  }
}