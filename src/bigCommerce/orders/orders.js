import { api_bigCommerce } from '../api/api.bigCommerce';


const convertToCartAPILineItems = (lineItems) => {
  return lineItems.map((lineItem) => {
    return {
      "product_id": lineItem.id,
      "quantity": lineItem.quantity,
      "list_price": lineItem.price,
    }
  });
}

const createBillingForAPI = (billing) => {
  console.log('billing', billing)
  if (billing.giftMessage) {
    billing["custom_fields"] = [
      {
        "field_id": "field_26",
        "field_value": billing.giftMessage
      }
    ]
  }
  billing.state_or_province = billing.state;
  delete billing.giftMessage;
  return billing;
}

export const createCart = async ({customerId, lineItems}) => {
  const lineItemsForAPI = convertToCartAPILineItems(lineItems);
  const response = await api_bigCommerce.post('/v3/carts', {
    "customer_id": customerId,
    "line_items": lineItemsForAPI
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
      "line_items": consignment.lineItems.map((lineItem) => {
        const item_id = cartLineItems.physical_items.find((physicalItem) => physicalItem.product_id === lineItem.id).id;
        return {
          "quantity": lineItem.quantity,
          "item_id": item_id
        }
      })
    }
  });

  const response = await api_bigCommerce.post(
    `/v3/checkouts/${checkoutId}/consignments?include=consignments.available_shipping_options`,
    consignmentAddressForApi
  );

  return response.data;
}


export const addShippingOptions = async ({checkoutId, consignmentToShippingMapping}) => {
  console.log("consignmentToShippingMapping", consignmentToShippingMapping)
  return new Promise((resolve, reject) => {
    const consignmentIds = Object.keys(consignmentToShippingMapping);
    const promises = consignmentIds.map((consignmentId) => {
      return api_bigCommerce.put(
        `/v3/checkouts/${checkoutId}/consignments/${consignmentId}`,
        { "shipping_option_id": consignmentToShippingMapping[consignmentId] }
      );
    });

    Promise.all(promises).then((values) => {
      resolve(values);
    }).catch((error) => {
      reject(error);
    });
  });
}

export const createOrder = async ({checkoutId}) => {
  const response = await api_bigCommerce.post(
    `/v3/checkouts/${checkoutId}/orders`
  );
  return response.data;
}