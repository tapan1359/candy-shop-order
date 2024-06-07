import SelectCustomer from "../SelectCustomer";
import CreateAddress from "../CreateAddress";
import CreateCustomer from "../CreateCustomer";

export default function SelectOrCreateCustomer({
  customers,
  selectedCustomer,
  setSelectedCustomer,
  setSelectedBillingAddress,
}) {
  return (
    <div>
      <SelectCustomer customers={customers} customer={selectedCustomer} setCustomer={setSelectedCustomer} />
      <CreateAddress buttonName={"New Address"} customerId={selectedCustomer?.id} />
      <CreateCustomer setCustomer={setSelectedCustomer} setSelectedBillingAddress={setSelectedBillingAddress}/>
    </div>
  );
}