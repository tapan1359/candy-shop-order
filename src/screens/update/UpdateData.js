import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { getAllCustomers } from '../../bigCommerce/customers/customers.get';
import { getAllProducts } from '../../bigCommerce/products/products.get';
import { setCustomers, setProducts } from '../../redux/bigCommerce/data';
import LoadItem from '../../componants/LoadItem';

function UpdateDataScreen() {
  const dispatch = useDispatch();

  const handleUpdateCustomers = async () => {
    const customers = await getAllCustomers();
    dispatch(setCustomers(customers));
  };

  const handleUpdateProducts = async () => {
    const customers = await getAllProducts();
    dispatch(setProducts(customers));
  };

  return (
    <div>
      <LoadItem buttonTitle="Update Customers" fetchDataFunc={handleUpdateCustomers} />
      <LoadItem buttonTitle="Update Products" fetchDataFunc={handleUpdateProducts} />
    </div>

  );
}

export default UpdateDataScreen;
