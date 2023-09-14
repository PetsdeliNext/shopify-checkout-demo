import { shopifyGraphql } from './app/graphqlclient';

const graphqlClient = shopifyGraphql({
  url: 'https://petsdeli-dev.myshopify.com/admin/api/unstable/graphql.json',
});

async function orderEditBegin() {
  let resp = await graphqlClient(
    `
    mutation beginEdit{
        orderEditBegin(id: "gid://shopify/Order/5490688688411"){
           calculatedOrder{
             id
           }
         }
       }`,
    {}
  );
  //@ts-ignore
  return resp.data.orderEditBegin.calculatedOrder.id;
}

async function editOrder(calculatedOrderId: string) {
  let resp = await graphqlClient(
    `
    mutation orderEditAddVariant($id: ID!, $quantity: Int!, $variantId: ID!) {
        orderEditAddVariant(id: $id, quantity: $quantity, variantId: $variantId) {
            
          userErrors {
            field
            message
          }
        }
      }
    `,
    {
      allowDuplicates: true,
      id: calculatedOrderId,
      quantity: 14,
      variantId: 'gid://shopify/ProductVariant/46470350569755',
    }
  );
}

async function commitOrderEdits(calculatedOrderId: string) {
  return await graphqlClient(
    `
    mutation commitEdit {
        orderEditCommit(id: "${calculatedOrderId}", notifyCustomer: false, staffNote: "I edited the order! It was me!") {
          order {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
      
    `,
    {}
  );
}

async function main() {
  let calculatedOrder = await orderEditBegin();
  await editOrder(calculatedOrder);
  await commitOrderEdits(calculatedOrder);
}

void main();
