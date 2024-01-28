import { api_bigCommerce } from '../api/api.bigCommerce';

export const getProducts = async (params) => {
  console.log('getProducts', params);
  const response = await api_bigCommerce.get('/v3/catalog/products', {
    params,
  });
  console.log('getProducts response', response);
  return response.data;
};

export const getAllProducts = async () => {
  let allProducts = [];
  let hasMore = true;
  let currentPage = 1;

  while (hasMore) {
    const response = await api_bigCommerce.get('/v3/catalog/products', {
      params: {
        page: currentPage,
        limit: 250,
        include: 'primary_image',
      },
    });

    allProducts = allProducts.concat(response.data.data);
    const { total_pages } = response.data.meta.pagination;
    if (currentPage === total_pages) {
      console.log('currentPage', currentPage);
      console.log('total_pages', total_pages);
      hasMore = false;
    } else {
      currentPage++;
    }
  }

  return allProducts;
};
