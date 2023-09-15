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
  // const message = 'May be delayed due to weather conditions';

  // let toRename = input.cart.deliveryGroups
  //   .flatMap((group) => group.deliveryOptions)
  //   // Construct a rename operation for each, adding the message to the option title
  //   .map((option) => /** @type {Operation} */ ({
  //     rename: {
  //       deliveryOptionHandle: option.handle,
  //       title: option.title ? `${option.title} - ${message}` : message,
  //     },
  //   }));
  const hide = input.cart.cost.subtotalAmount.amount > 1000;

  // The @shopify/shopify_function package applies JSON.stringify() to your function result
  // and writes it to STDOUT
  return {
    operations: [
      // hide
      //   ? {
      //       hide: {
      //         deliveryOptionHandle:
      //           '69eded6677a47c0274852c8234fa68d6-746cf5417094dfd5e1321c818df5e7bc', // DHL Standard
      //       },
      //     }
      //   : {},
    ],
  };
};
