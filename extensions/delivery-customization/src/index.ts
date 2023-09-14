// @ts-check

// Use JSDoc annotations for type safety
/**
 * @typedef {import("../generated/api").InputQuery} InputQuery
 * @typedef {import("../generated/api").FunctionResult} FunctionResult
 * @typedef {import("../generated/api").Operation} Operation
 */

// The @shopify/shopify_function package will use the default export as your function entrypoint
export default /**
 * @param {InputQuery} input
 * @returns {FunctionResult}
 */
(input) => {
  // The message to be added to the delivery option

  // reduced price if > 60 EUR | FirstOrder

  // DHL Standard 3.90 - 0
  // DPD Standard 3.90 - 0
  // DPD Express  8.90 - 4.90
  // FAIRSENDEN   6.90 - 4.90

  // ETA -> TBD

  const message = 'May be delayed due to weather conditions';

  console.log(JSON.stringify(input, null, 2));

  const customerOrderCount = input.cart.buyerIdentity.numberOfOrders;
  const deliveryGroups = input.cart.deliveryGroups;
  console.log(customerOrderCount);

  let toRename = deliveryGroups
    // Filter for delivery groups with a shipping address containing the affected state or province
    .filter(
      (group) =>
        group.deliveryAddress?.provinceCode &&
        group.deliveryAddress.provinceCode == 'NC'
    )
    // Collect the delivery options from these groups
    .flatMap((group) => group.deliveryOptions)
    // Construct a rename operation for each, adding the message to the option title
    .map((option) => /** @type {Operation} */ ({
      rename: {
        deliveryOptionHandle: option.handle,
        title: option.title ? `${option.title} - ${message}` : message,
      },
    }));

  // The @shopify/shopify_function package applies JSON.stringify() to your function result
  // and writes it to STDOUT
  return {
    operations: [
      ...toRename,
      {
        hide: {
          deliveryOptionHandle:
            'bd4646711e3cb4a6c11935b3a357b80a-746cf5417094dfd5e1321c818df5e7bc', // DHL Standard
        },
      },
    ],
  };
};
