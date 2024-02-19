import axios from 'axios';

export const api_bigCommerce = axios.create({
  baseURL: 'http://localhost:6868/api',
});


export const paymentapi_bigCommerce = axios.create({
  baseURL: 'http://localhost:6868/payments',
});