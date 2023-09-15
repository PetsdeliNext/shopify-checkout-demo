import {
  InputQuery,
  FunctionResult,
  FunctionError,
} from "../generated/api";

export default (input: InputQuery): FunctionResult => {
  const GermanIslandsPostcodes = [
    '18565',
    '25846-25847',
    '25849',
    '25859',
    '25863',
    '25869',
    '25929-25933',
    '25938-25942',
    '25946-25949',
    '25952-25955',
    '25961-25970',
    '25980',
    '25985-25986',
    '25988-25990',
    '25992-25994',
    '25996-25999',
    '26465',
    '26474',
    '26486',
    '26548',
    '26571',
    '26579',
    '26757',
    '27498',
    '83256',
  ];
  const errors: FunctionError[] = input.cart.deliveryGroups
    .filter(({ deliveryAddress }) => GermanIslandsPostcodes.includes(deliveryAddress?.zip!))
    .map(() => ({
      localizedMessage: "We can't deliver to german islands",
      target: "cart",
    }));

  return {
    errors
  }
};