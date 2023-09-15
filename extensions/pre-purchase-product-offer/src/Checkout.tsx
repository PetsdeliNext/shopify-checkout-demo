import React, { useEffect, useState } from "react";
import {
  reactExtension,
  Divider,
  Image,
  Banner,
  Heading,
  Button,
  InlineLayout,
  BlockStack,
  Text,
  SkeletonText,
  SkeletonImage,
  useCartLines,
  useApplyCartLinesChange,
  useApi,
} from "@shopify/ui-extensions-react/checkout";

export default reactExtension("purchase.checkout.block.render", () => <App />);

interface Product {
  id: string;
  title: string;
  images: {
    nodes: Array<{
      url: string;
    }>;
  };
  variants: {
    nodes: Array<{
      id: string;
      price: {
        amount: number;
      };
    }>;
  };
}

interface LineItem {
  merchandise: {
    id: string;
  };
}

interface ProductOfferProps {
  product: Product;
  i18n: any;
  adding: boolean;
  handleAddToCart: (variantId: string) => void;
  showError: boolean;
}

const App: React.FC = () => {
  const { query, i18n } = useApi();
  const applyCartLinesChange = useApplyCartLinesChange();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [adding, setAdding] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const lines = useCartLines();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => setShowError(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showError]);

  async function handleAddToCart(variantId: string) {
    setAdding(true);
    const result = await applyCartLinesChange({
      type: 'addCartLine',
      merchandiseId: variantId,
      quantity: 1,
    });
    setAdding(false);
    if (result.type === 'error') {
      setShowError(true);
      console.error(result.message);
    }
  }

  async function fetchProducts() {
    setLoading(true);
    try {
      const { data } = await query(
        `query ($first: Int!) {
          products(first: $first) {
            nodes {
              id
              title
              images(first:1){
                nodes {
                  url
                }
              }
              variants(first: 1) {
                nodes {
                  id
                  price {
                    amount
                  }
                }
              }
            }
          }
        }`,
        {
          variables: { first: 5 },
        }
      );
      setProducts(data.products.nodes);
      console.log('data.products', data.products);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!loading && products.length === 0) {
    return null;
  }

  const productsOnOffer = getProductsOnOffer(lines, products);

  if (!productsOnOffer.length) {
    return null;
  }

  return (
    <ProductOffer
      product={productsOnOffer[0]}
      i18n={i18n}
      adding={adding}
      handleAddToCart={handleAddToCart}
      showError={showError}
    />
  );
};

const LoadingSkeleton: React.FC = () => {
  return (
    <BlockStack spacing="loose">
      <Divider />
      <Heading level={2}>You might also like</Heading>
      <BlockStack spacing="loose">
        <InlineLayout spacing="base" columns={[64, 'fill', 'auto']} blockAlignment="center">
          <SkeletonImage aspectRatio={1} />
          <BlockStack spacing="none">
            <SkeletonText inlineSize="large" />
            <SkeletonText inlineSize="small" />
          </BlockStack>
          <Button kind="secondary" disabled={true}>
            Button
          </Button>
        </InlineLayout>
      </BlockStack>
    </BlockStack>
  );
};

const getProductsOnOffer = (lines: LineItem[], products: Product[]): Product[] => {
  const cartLineProductVariantIds = lines.map((item) => item.merchandise.id);
  return products.filter((product) => {
    const isProductVariantInCart = product.variants.nodes.some(({ id }) => cartLineProductVariantIds.includes(id));
    return !isProductVariantInCart;
  });
};

const ProductOffer: React.FC<ProductOfferProps> = ({
  product,
  i18n,
  adding,
  handleAddToCart,
  showError
}) => {
  const { images, title, variants } = product;
  const renderPrice = i18n.formatCurrency(variants.nodes[0].price.amount);
  const imageUrl =
    images.nodes[0]?.url ||
    'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_medium.png?format=webp&v=1530129081';

  return (
    <BlockStack spacing="loose">
      <Divider />
      <Heading level={2}>You might also like</Heading>
      <BlockStack spacing="loose">
        <InlineLayout spacing="base" columns={[64, 'fill', 'auto']} blockAlignment="center">
          <Image border="base" borderWidth="base" borderRadius="loose" source={imageUrl} description={title} aspectRatio={1} />
          <BlockStack spacing="none">
            <Text size="medium" emphasis="strong">
              {title}
            </Text>
            <Text appearance="subdued">{renderPrice}</Text>
          </BlockStack>
          <Button kind="secondary" loading={adding} accessibilityLabel={`Add ${title} to cart`} onPress={() => handleAddToCart(variants.nodes[0].id)}>
            Add
          </Button>
        </InlineLayout>
      </BlockStack>
      {showError && <ErrorBanner />}
    </BlockStack>
  );
};

const ErrorBanner: React.FC = () => {
  return (
    <Banner status="critical">There was an issue adding this product. Please try again.</Banner>
  );
};
