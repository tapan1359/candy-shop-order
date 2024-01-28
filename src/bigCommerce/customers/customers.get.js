import { api_bigCommerce } from '../api/api.bigCommerce';

export const searchCustomers = async (params) => {
  console.log('searchCustomers', params);
  const response = await api_bigCommerce.get('/v3/customers/addresses', {
    params,
  });
  console.log('searchCustomers response', response);
  return response.data;
};

export const getCustomers = async (params) => {
  console.log('getCustomers', params);
  const response = await api_bigCommerce.get('/v3/customers', {
    params,
  });
  console.log('getCustomers response', response);
  return response.data;
};

export const getAllCustomers = async () => {
  let allCustomers = [];
  let hasMore = true;
  let currentPage = 1;

  while (hasMore) {
    const response = await api_bigCommerce.get('/v3/customers', {
      params: {
        page: currentPage,
        limit: 250,
        include: 'addresses',
      },
    });

    allCustomers = allCustomers.concat(response.data.data);
    const { total_pages } = response.data.meta.pagination;
    if (currentPage === total_pages) {
      console.log('currentPage', currentPage);
      console.log('total_pages', total_pages);
      hasMore = false;
    } else {
      currentPage++;
    }
  }

  return allCustomers;
};

export const getCustomerAddresses = async (params) => {
  console.log('searchCustomers', params);
  const response = await api_bigCommerce.get('/v3/customers/addresses', {
    params,
  });
  console.log('getCustomerAddresses response', response);
  return response.data;
};
