export const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0'); 
  const y = date.getFullYear();
  const h = date.getHours().toString().padStart(2, '0');
  const min = date.getMinutes().toString().padStart(2, '0');
  return `${d}/${m}/${y} ${h}:${min}`;
};

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

export const getTotalStock = (variants: Variant[]) => {
  return variants.reduce((total: number, variant: Variant) => {
    return total + variant.sizes.reduce((sizeTotal: number, size: Size) => sizeTotal + size.stock, 0);
  }, 0);
};

export const getTotalVariants = (products: ProductWithIndex[]) => {
  return products.reduce((total: number, product: ProductWithIndex) => 
    total + product.variants.length, 0
  );
};