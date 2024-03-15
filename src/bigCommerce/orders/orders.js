import { api_bigCommerce } from '../api/api.bigCommerce';


const convertToCartAPIItems = (items) => {

  const lineItems = [];
  const customItems = [];

  items.forEach((item) => {
    if (item.id === undefined) {
      customItems.push({
        "name": item.name,
        "quantity": item.quantity,
        "list_price": item.price,
        "sku": `custom-${item.name}`
      });
    } else {
      lineItems.push({
        "product_id": item.id,
        "quantity": item.quantity,
        "list_price": item.price,
      });
    }
  });

  return {lineItems, customItems};
}


const createBillingForAPI = (billing) => {
  console.log('billing', billing);
  if (billing.giftMessage) {
    billing["custom_fields"] = [
      {
        "field_id": "field_26",
        "field_value": billing.giftMessage
      }
    ]
  }
  if (!billing.state_or_province) {
    billing.state_or_province = billing.state;
  }
  delete billing.giftMessage;
  return billing;
}


const createLineItemsForConsignments = (consignment, cartLineItems) => {
  return consignment.items.map((item) => {
    let itemId;
    if (item.id !== undefined) {
      itemId = cartLineItems.physical_items.find((physicalItem) => physicalItem.product_id === item.id).id;
    } else {
      itemId = cartLineItems.custom_items.find((physicalItem) => physicalItem.name === item.name).id;
    }
    return {
      "quantity": item.quantity,
      "item_id": itemId
    }
  })
}


const createLineItemsForPickup = (lineItems) => {
  let items = [];
  lineItems.physical_items.forEach((item) => {
    items.push({
      "quantity": item.quantity,
      "item_id": item.id
    });
  });

  lineItems.custom_items.forEach((item) => {
    items.push({
      "quantity": item.quantity,
      "item_id": item.id
    });
  });

  return items;
}

export const createCart = async ({customerId, items}) => {
  const {lineItems, customItems} = convertToCartAPIItems(items);
  const response = await api_bigCommerce.post('/v3/carts', {
    "customer_id": customerId,
    "line_items": lineItems,
    "custom_items": customItems
  });
  return response.data;
}

export const addCheckoutBillingAddress = async ({checkoutId, billingAddress}) => {
  const billingAddressForApi = createBillingForAPI(billingAddress);
  const response = await api_bigCommerce.post(
    `/v3/checkouts/${checkoutId}/billing-address`,
    billingAddressForApi
  );

  return response.data;
}

export const createShippingConsignments = async ({checkoutId, consignments, cartLineItems}) => {

  const consignmentAddressForApi = consignments.map((consignment) => {
    return {
      "address": createBillingForAPI(consignment.address),
      "line_items": createLineItemsForConsignments(consignment, cartLineItems)
    }
  });

  const response = await api_bigCommerce.post(
    `/v3/checkouts/${checkoutId}/consignments?include=consignments.available_shipping_options`,
    consignmentAddressForApi
  );

  return response.data;
}

export const createPickupConsignments = async ({checkoutId, lineItems}) => {

  let payload = [
    {
      "pickup_option": {
        "pickup_method_id": 1
      },
      "line_items": createLineItemsForPickup(lineItems)
    }
  ]
  
  const response = await api_bigCommerce.post(
    `/v3/checkouts/${checkoutId}/consignments`, payload
  );

  return response.data;
  }


export const addShippingOptions = async ({ checkoutId, consignmentToShippingMapping }) => {

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const consignmentIds = Object.keys(consignmentToShippingMapping);
  const results = [];

  for (const consignmentId of consignmentIds) {
    try {
      const response = await api_bigCommerce.put(
        `/v3/checkouts/${checkoutId}/consignments/${consignmentId}`,
        { "shipping_option_id": consignmentToShippingMapping[consignmentId] }
      );
      results.push(response);
      await sleep(5000);
    } catch (error) {
      throw error;
    }
  }

  return results;
};


export const createOrder = async ({checkoutId}) => {
  const response = await api_bigCommerce.post(
    `/v3/checkouts/${checkoutId}/orders`
  );
  return response.data.data.id;
}


export const getOrder = async ({orderId}) => {
  const response = await api_bigCommerce.get(
    `/v2/orders/${orderId}`
  );
  return response.data;
}

export const getCheckout = async ({checkoutId}) => {
  const response = await api_bigCommerce.get(
    `/v3/checkouts/${checkoutId}`
  );
  return response.data;
}


export const updateOrderBillingAddressZipCode = async ({orderId, zipCode}) => {
  const response = await api_bigCommerce.put(
    `/v2/orders/${orderId}`,
    { "billing_address": {"zip": zipCode }}
  );

  return response.data;
}