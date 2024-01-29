import axios from 'axios';
// import axios from electron main process and not render process

// export const api_bigCommerce = axios.create({
//   baseURL: `https://api.bigcommerce.com/stores/${process.env.REACT_APP_BIGCOMMERCE_STORE_HASH}`,
//   headers: {
//     'X-Auth-Token': process.env.REACT_APP_BIGCOMMERCE_ACCESS_TOKEN,
//     Accept: 'application/json',
//     'Content-Type': 'application/json',
//   },
// });

export const api_bigCommerce = axios.create({
  baseURL: 'http://localhost:6868/bigcommerce',
});
