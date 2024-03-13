import { api_bigCommerce, paymentapi_bigCommerce } from '../api/api.bigCommerce';


  
export const processOrderPayment = async ({orderId, paymentInfo}) => {
  try {
    if (typeof orderId === 'string') {
      orderId = parseInt(orderId);
    }

    const response = await api_bigCommerce.post('/v3/payments/access_tokens', {"order": {"id": orderId}})

    let paymentAccessToken = response.data.data.id;

    const paymentResponse = await paymentapi_bigCommerce.post('/payments', {
      "payment": {
        "instrument": {
          "type": "card",
          "cardholder_name": paymentInfo.nameOnCard,
          "number": paymentInfo.cardNumber,
          "expiry_month": Number(paymentInfo.expiryMonth),
          "expiry_year": Number(paymentInfo.expiryYear),
          "verification_value": paymentInfo.cvv
        },
        "payment_method_id": "authorizenet.card",
      }
    }, {
      headers: {
        "Authorization": `PAT ${paymentAccessToken}`
      }
    });

  } catch (error) {
    console.log('error in payment', error);
    throw error;
  }
}