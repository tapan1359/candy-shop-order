import {PaymentFormNew} from "../PaymentFormNew";
import React from "react";

export default function AddPayment({
  order,
  customerName,
  billingZipCode,
  handleSubmitPayment,
}) {

  return (
    <div>
      <PaymentFormNew order={order} customerName={customerName} billingZipCode={billingZipCode} submitPayment={handleSubmitPayment} />
    </div>
  );
}