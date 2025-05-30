// components/ProductStockStats.tsx
import React from 'react';
import { HiOutlineCube } from 'react-icons/hi2';

interface ProductStockStatsProps {
  totalStock: number;
  totalVariants: number;
}

const ProductStockStats: React.FC<ProductStockStatsProps> = ({ 
  totalStock, 
  totalVariants 
}) => {
  const getStockStatusColor = (stock: number) => {
    if (stock === 0) return 'text-error';
    if (stock < 5) return 'text-warning';
    return 'text-success';
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h3 className="card-title flex items-center gap-2 mb-4">
          <HiOutlineCube size={20} />
          Stock Statistics
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="stat bg-primary/10 rounded-lg p-4">
            <div className="stat-title text-sm">Total Stock</div>
            <div className={`stat-value text-2xl ${getStockStatusColor(totalStock)}`}>
              {totalStock}
            </div>
          </div>
          <div className="stat bg-secondary/10 rounded-lg p-4">
            <div className="stat-title text-sm">Variants</div>
            <div className="stat-value text-2xl text-secondary">
              {totalVariants}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductStockStats;