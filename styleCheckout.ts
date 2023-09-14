import { shopifyGraphql } from './app/graphqlclient';

const graphqlClient = shopifyGraphql({
  url: 'https://petsdeli-dev.myshopify.com/admin/api/unstable/graphql.json',
});

async function readCheckoutProfiles() {
  return await graphqlClient(
    `
        query checkoutProfiles {
            checkoutProfiles(first: 10) {
                nodes {
                    id
                    
                }
            }
        }
    `
  );
}

async function styleCheckout(checkoutProfileId: string) {
  return await graphqlClient(
    `
    mutation checkoutBrandingUpsert($checkoutBrandingInput: CheckoutBrandingInput!, $checkoutProfileId: ID!) {
        checkoutBrandingUpsert(checkoutBrandingInput: $checkoutBrandingInput, checkoutProfileId: $checkoutProfileId) {
          checkoutBranding {
            designSystem {
              # This property group applies to global corner radius token values
              cornerRadius {
                small
                base
                large
              }
              colorPalette {
                # This property group applies to the body background
                # (For example, the checkout loading page or payment processing page)
                canvas {
                  background
                  foreground
                }
                # This property group applies to the main checkout form
                color1 {
                  background
                  foreground
                }
                # This property group applies to the order summary
                color2 {
                  background
                  foreground
                }
                # This property group applies to the primary button
                primary {
                  accent
                  foreground
                  background
                }
                # This property group applies to the color of links and interactive components
                interactive {
                  accent
                  foreground
                  background
                }
              }
              # This property group applies to global typography font faces, sizes, and weights
              typography {
                size {
                  base
                  ratio
                }
                primary {
                  base {
                    sources
                    weight
                  }
                }
                secondary {
                  base {
                    sources
                    weight
                  }
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }      
    `,
    {
      checkoutProfileId,
      checkoutBrandingInput: {
        designSystem: {
          cornerRadius: {
            large: 30,
          },
          colorPalette: {
            canvas: {
              background: '#FFE926',
              foreground: '#D10088',
            },
            color1: {
              background: '#FFFAFD',
              foreground: '#2E001E',
            },
            color2: {
              background: '#FFF5FB',
              foreground: '#2E001E',
            },
            primary: {
              accent: '#1773B0',
              background: '#FF9CDD',
              foreground: '#2E001E',
            },
            interactive: {
              accent: '#D10088',
              foreground: '#D10088',
              background: null,
            },
          },
          typography: {
            size: {
              base: 16.0,
              ratio: 1.4,
            },
            primary: {
              shopifyFontGroup: {
                name: 'Sans-serif',
              },
            },
            secondary: {
              shopifyFontGroup: {
                name: 'Oswald',
              },
            },
          },
        },
      },
    }
  );
}

async function main() {
  const checkoutProfiles = await readCheckoutProfiles();
  console.log(JSON.stringify(checkoutProfiles, null, 2));
  await styleCheckout('gid://shopify/CheckoutProfile/29262107');
}

void main();
