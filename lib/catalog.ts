export type CatalogProduct = {
  key: string;
  title: string;
  priceInPaise: number;
  priceLabel: string;
  originalPrice: string;
  file: string;
};

export const catalogProducts: CatalogProduct[] = [
  {
    key: "math",
    title: "SpeedMath: Calculate Faster",
    priceInPaise: 2900,
    priceLabel: "₹29",
    originalPrice: "₹99",
    file: "MATH%20MAGIC.pdf",
  },
  {
    key: "english",
    title: "Speak English with Confidence",
    priceInPaise: 2900,
    priceLabel: "₹29",
    originalPrice: "₹99",
    file: "Speak%20English.pdf",
  },
  {
    key: "bundle",
    title: "Math + English PDF Bundle",
    priceInPaise: 2900,
    priceLabel: "₹29",
    originalPrice: "₹198",
    file: "MATH%20MAGIC.pdf",
  },
];

export function getProduct(productKey: string) {
  return catalogProducts.find((product) => product.key === productKey);
}
