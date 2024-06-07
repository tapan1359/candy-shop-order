import AddressForm from "../AddressForm";
import React from "react";
import CreateAddress from "../CreateAddress";

export default function SelectOrCreateBillingAddress({
  selectedCustomer,
  selectedBillingAddress,
  setSelectedBillingAddress
}) {
  return (
    <div>
      <AddressForm title={"Billing Address"} customerId={selectedCustomer?.id} address={selectedBillingAddress} setAddress={setSelectedBillingAddress} />
      <CreateAddress buttonName={"New Address"} customerId={selectedCustomer?.id} />
    </div>
  );
}