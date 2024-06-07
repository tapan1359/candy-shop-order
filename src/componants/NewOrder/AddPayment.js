import {PaymentFormNew} from "../PaymentFormNew";
import React from "react";

export default function AddPayment({
  order,
  handleSubmitPayment,
}) {

  return (
    <div>
      <PaymentFormNew order={order} submitPayment={handleSubmitPayment} />
    </div>
  );
}