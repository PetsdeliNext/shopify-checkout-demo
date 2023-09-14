import { GraphQLFulfilled, GraphQLReject } from './types.js';

type Response<T> = GraphQLFulfilled<T> | GraphQLReject;

type Variables = Record<
  string,
  number | string | boolean | null | undefined | object
>;
type GraphQLInterface = <T>(
  query: string,
  variables?: Variables
) => Promise<GraphQLFulfilled<T>>;

export function shopifyGraphql(config: { url: string }): GraphQLInterface {
  const { url } = config;

  return async function <T>(query: string, variables?: Variables) {
    console.log(url);
    const fetched = await fetch(url, {
      method: 'post',
      body: JSON.stringify({ query, variables }),
      headers: {
        'Content-Type': 'application/json',
        'x-shopify-storefront-access-token': '276c1f0c8c9f44e26dda783ada632cb2',
        'X-Shopify-Access-Token': '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',
      },
    });
    const response = (await fetched.json()) as Response<T>;
    if ('errors' in response) {
      console.log(JSON.stringify({ response }, null, 2));
      throw new Error(parseErrors(response.errors));
    }
    //console.info(response.extensions.cost);
    return response;
  };
}

function parseErrors(errors: { message: string }[]) {
  return errors.map((error) => error.message).join(', ');
}

fetch('https://jzk1.myshopify.com/api/2023-04/graphql.json', {
  headers: {
    accept: 'application/json, text/plain, */*',
    'accept-language': 'en-US,en;q=0.9',
    'content-type': 'application/json',
    'sec-ch-ua': '"Chromium";v="115", "Not/A)Brand";v="99"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'cross-site',
    'x-shopify-storefront-access-token': 'a7dbe970b144e21453645a299919b974',
    Referer: 'https://dev.petsdeli.de:3000/',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  },
  body: '{"query":"\\n  mutation checkoutCreate($input: CheckoutCreateInput!) {\\n    checkoutCreate(input: $input) {\\n      checkout {\\n        id\\n        __typename\\n        ...CheckoutFragment\\n      }\\n      checkoutUserErrors {\\n        code\\n        field\\n        message\\n      }\\n    }\\n  }\\n  \\n  fragment CheckoutFragment on Checkout {\\n    id\\n    webUrl\\n    lineItems(first: 250) {\\n      edges {\\n        node {\\n          ...LineItemFragment\\n        }\\n      }\\n    }\\n  }\\n  \\n  fragment LineItemFragment on CheckoutLineItem {\\n    id\\n    title\\n    variant {\\n      ...VariantWithProductFragment\\n    }\\n    quantity\\n    customAttributes {\\n      key\\n      value\\n    }\\n  }\\n  \\n  fragment VariantWithProductFragment on ProductVariant {\\n    ...VariantFragment\\n    product {\\n      tags\\n      productType\\n      id\\n      handle\\n    }\\n  }\\n  \\n  fragment VariantFragment on ProductVariant {\\n    id\\n    title\\n    weight\\n    availableForSale\\n    sku\\n    priceV2 {\\n      amount\\n    }\\n    image {\\n      id\\n      src: originalSrc\\n      altText\\n    }\\n  }\\n\\n\\n\\n\\n","variables":{"input":{"lineItems":[{"customAttributes":[{"key":"interval","value":"4week"},{"key":"sort","value":"0"}],"quantity":1,"variantId":"gid://shopify/ProductVariant/28960273268770"}],"email":"camille.feghali@petsdeli.de"}}}',
  method: 'POST',
});
