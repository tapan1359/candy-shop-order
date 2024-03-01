import axios from 'axios';

export const api_bigCommerce = axios.create({
  baseURL: '/api',
});


export const paymentapi_bigCommerce = axios.create({
  baseURL: '/payments',
});