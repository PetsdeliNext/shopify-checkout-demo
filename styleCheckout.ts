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
            customizations {
              
              secondaryButton{
                background
              }
            }
            
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
                critical {
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
        customizations: {
          secondaryButton: {
            background: 'SOLID',
          },
          // header: {
          //   logo: {
          //     image: {
          //       mediaImageId: 'gid://shopify/ProductVariant/46267474411803',
          //     },
          //     maxWidth: 1,
          //   },
          // },
        },
        designSystem: {
          cornerRadius: {
            large: 50,
          },
          colorPalette: {
            canvas: {
              background: '#545454',
              foreground: '#506482',
            },
            //main content
            color1: {
              background: '#fafafa',
              foreground: '#19335a',
            },
            //secondary content
            color2: {
              background: '#fafafa',
              foreground: '#19335a',
            },
            critical: {
              accent: '#ff5768',
              background: '#ff5768',
              foreground: '#ffffff',
            },
            //primary action buttons
            primary: {
              accent: '#1773B0',
              background: '#19335a',
              foreground: '#ffffff',
            },
            interactive: {
              accent: '#a6a6a6',
              foreground: '#19335a',
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
