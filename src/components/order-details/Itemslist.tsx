import React from 'react';
import { HiCube } from 'react-icons/hi2';
import { OrderProduct } from 'types/Order';
import { formatCurrency } from '@utils/orderHelper';

interface OrderItemsProps {
  products: OrderProduct[];
}

const OrderItems: React.FC<OrderItemsProps> = ({ products }) => {
  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <h2 className="card-title text-xl mb-4">
          <HiCube className="w-5 h-5" />
          Order Items
        </h2>
        
        <div className="space-y-4">
          {products.map((product, index) => (
            <div key={`${product.productId}-${index}`} className="flex items-center gap-4 p-4 border border-base-300 rounded-lg">
              <div className="avatar">
                <div className="w-16 h-16 rounded">
                  <img 
                    src={product.image || '/placeholder-product.png'} 
                    alt={product.name}
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-product.png';
                    }}
                  />
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <div className="text-sm text-base-content/70 space-y-1">
                  <p><span className="font-medium">Producer:</span> {product.producer}</p>
                  <p><span className="font-medium">Type:</span> {product.type}</p>
                  <p><span className="font-medium">Material:</span> {product.material}</p>
                  <div className="flex gap-4">
                    <span><span className="font-medium">Color:</span> {product.color}</span>
                    <span><span className="font-medium">Size:</span> {product.size}</span>
                  </div>
                  {product.description && (
                    <p><span className="font-medium">Description:</span> {product.description}</p>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-lg font-semibold">{formatCurrency(product.price)}</p>
                <p className="text-sm text-base-content/70">Qty: {product.quantity}</p>
                <p className="text-sm font-medium text-primary">
                  Total: {formatCurrency(product.price * product.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderItems;