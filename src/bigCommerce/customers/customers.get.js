import { api_bigCommerce } from '../api/api.bigCommerce';

export const searchCustomers = async (params) => {
  const response = await api_bigCommerce.get('/v3/customers/addresses', {
    params,
  });
  return response.data;
};

export const getCustomers = async (params) => {
  const response = await api_bigCommerce.get('/v3/customers', {
    params,
  });
  return response.data;
};

export const getCustomerById = async (id) => {

  let result = {
    customer: null,
    error: null,
  };

  try {
    const response = await api_bigCommerce.get('/v3/customers', {
      params: {
        "id:in": id,
        include: 'addresses',
      },
    });
    result.customer = response.data.data[0];
  } catch (error) {
    result.error = JSON.stringify(error.response.data.errors);
  }
  return result;
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
  const response = await api_bigCommerce.get('/v3/customers/addresses', {
    params,
  });
  return response.data;
};
