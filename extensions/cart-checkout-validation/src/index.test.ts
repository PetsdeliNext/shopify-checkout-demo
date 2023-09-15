import { describe, it, expect } from 'vitest';
import validateCart from './index';
import { FunctionResult } from "../generated/api";

describe('cart checkout validation function', () => {
  it('returns an error when quantity exceeds one', () => {
    const result = validateCart({
      cart: {
        lines: [
          {
            quantity: 3
          }
        ]
      }
    });
    const expected: FunctionResult = { errors: [
      {
        localizedMessage: "Not possible to order more than one of each",
        target: "cart"
      }
    ] };

    expect(result).toEqual(expected);
  });

  it('returns no errors when quantity is one', () => {
    const result = validateCart({
      cart: {
        lines: [
          {
            quantity: 1
          }
        ]
      }
    });
    const expected: FunctionResult = { errors: [] };

    expect(result).toEqual(expected);
  });
});