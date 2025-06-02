export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', 
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getShippingCost = (deliveryType: string) => {
  return deliveryType.toLowerCase() === 'standard' ? 20000 : 50000;
};

export const getSubtotal = (products: Array<{ price: number; quantity: number }>) => {
  return products.reduce((acc, p) => acc + (p.price * p.quantity), 0);
};