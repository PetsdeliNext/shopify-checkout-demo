import { shopifyGraphql } from './app/graphqlclient';

const graphqlClient = shopifyGraphql({
  url: 'https://petsdeli-dev.myshopify.com/api/2023-07/graphql.json',
});

const createCheckout = async () => {
  return await graphqlClient(
    `
    mutation checkoutCreate($input: CheckoutCreateInput!) {
        checkoutCreate(input: $input) {
          checkout {
            id
            webUrl
          }
          checkoutUserErrors {
            code
            field
            message
          }
        }
      }
      `,
    {
      input: {
        allowPartialAddresses: true,
        lineItems: [
          {
            quantity: 2,
            variantId: 'gid://shopify/ProductVariant/46267474411803',
            // sellingPlanId: 'gid://shopify/SellingPlanGroup/77000376603',
            // merchandiseId: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zOTMyNzU3NjMyNjMzMg==',
          },
        ],
      },
    }
  );
};

const applyDiscountCodeToCheckout = async (checkoutId: string) => {
  return await graphqlClient(
    `
    mutation applyDiscountCodeToCheckout($checkoutId: ID!, $discountCode: String!) {
      checkoutDiscountCodeApplyV2(checkoutId: $checkoutId, discountCode: $discountCode) {
        checkout {
          discountApplications(first: 10) {
            edges {
              node {
                allocationMethod
                targetSelection
                targetType
              }
            }
          }
        }
        checkoutUserErrors {
          message
          code
          field
        }
      }
    }
    `,
    {
      checkoutId: checkoutId,
      discountCode: 'STOREFRONT_API_TEST_CODE',
    }
  );
};

const applyDiscountCodeToCart = async (checkoutId: string) => {
  return await graphqlClient(
    `
    mutation applyDiscountCodeToCheckout($checkoutId: ID!, $discountCode: String!) {
      checkoutDiscountCodeApplyV2(checkoutId: $checkoutId, discountCode: $discountCode) {
        checkout {
          discountApplications(first: 10) {
            edges {
              node {
                allocationMethod
                targetSelection
                targetType
              }
            }
          }
        }
        checkoutUserErrors {
          message
          code
          field
        }
      }
    }
    `,
    {
      checkoutId: checkoutId,
      discountCode: 'STOREFRONT_API_TEST_CODE',
    }
  );
};

const createCart = async () => {
  return await graphqlClient(
    `
    mutation cartCreate {
      cartCreate {
        cart {
          checkoutUrl
        }
        userErrors {
          field
          message
        }
      }
    }
  `,
    {
      input: {
        attributes: [
          {
            key: '',
            value: '',
          },
        ],
        buyerIdentity: {
          // countryCode: '',
          // customerAccessToken: '',
          // deliveryAddressPreferences: [
          //   {
          //     customerAddressId: '',
          //     deliveryAddress: {
          //       address1: '',
          //       address2: '',
          //       city: '',
          //       company: '',
          //       country: '',
          //       firstName: '',
          //       lastName: '',
          //       phone: '',
          //       province: '',
          //       zip: '',
          //     },
          //   },
          // ],
          email: 'camille.feghali@petsdeli.de',
          phone: '',
          walletPreferences: [''],
        },
        discountCodes: [''],
        lines: [
          {
            attributes: [
              {
                key: '',
                value: '',
              },
            ],
            merchandiseId: 'gid://shopify/ProductVariant/46267474411803',
            quantity: 2,
            sellingPlanId: 'gid://shopify/SellingPlanGroup/77000376603',
          },
        ],
        metafields: [
          {
            key: '',
            type: '',
            value: '',
          },
        ],
        note: '',
      },
    }
  );
};

async function main() {
  let checkoutCreateResp = (await createCheckout()) as {
    data: { checkoutCreate: { checkout: { id: string } } };
  };
  console.log('_________ checkout response __________');
  console.log(JSON.stringify(checkoutCreateResp, null, 2));

  let checkoutId = checkoutCreateResp.data.checkoutCreate.checkout.id;
  // await applyDiscountCodeToCheckout(checkoutId);

  const cart = await createCart();
  console.log('_________ cart response __________');
  console.log(JSON.stringify(cart, null, 2));
}

void main();
