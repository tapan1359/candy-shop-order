import { api_bigCommerce } from '../api/api.bigCommerce';

export const getAllProducts = async () => {
  let allProducts = [];
  let hasMore = true;
  let currentPage = 1;

  while (hasMore) {
    const response = await api_bigCommerce.get('/v3/catalog/products', {
      params: {
        // "inventory_level:greater": 0,
        page: currentPage,
        limit: 250,
        include: 'primary_image',
      },
    });

    allProducts = allProducts.concat(response.data.data);
    const { total_pages } = response.data.meta.pagination;
    if (currentPage === total_pages) {
      hasMore = false;
    } else {
      currentPage++;
    }
  }

  console.log(allProducts)

  return allProducts;
};
