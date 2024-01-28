import React, { useEffect, useState } from 'react';
import StartEndTimePicker from '../../componants/StartEndTimePicker';
import { useSelector, useDispatch } from 'react-redux';
import OrderLineItem from './OrderLineItem';
import { getOrderStatus } from '../../bigCommerce/orders/orders.get';
import { setOrderStatuses } from '../../redux/bigCommerce/ordersSlice';



export default function OrderIndex() {
    const orders = useSelector((state) => state.orders.orders);
    const dispatch = useDispatch();

    useEffect(() => {
        handleGetOrderStatus();
    }, []);

    const handleGetOrderStatus = async () => {
        const orderStatus = await getOrderStatus();
        dispatch(setOrderStatuses(orderStatus));
    }


  return (
    <div>
        <StartEndTimePicker />
        {/* for each order make a nice row displaying info for that order using mui */}
        {orders && orders.map((order) => {
            return (
              <OrderLineItem order={order} key={order.id} />
            )
        })}

    </div>
  )
}
