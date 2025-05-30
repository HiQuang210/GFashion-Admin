import React from 'react';
import { HiOutlineSwatch } from 'react-icons/hi2';

interface ProductVariantsProps {
  variants: Variant[];
}

const ProductVariants: React.FC<ProductVariantsProps> = ({ variants }) => {
  const getStockStatusColor = (stock: number) => {
    if (stock === 0) return 'text-error';
    if (stock < 5) return 'text-warning';
    return 'text-success';
  };

  return (
    <div className="card bg-base-100 shadow-xl mb-6">
      <div className="card-body">
        <h3 className="card-title flex items-center gap-2 mb-4">
          <HiOutlineSwatch size={20} />
          Variants & Stock
        </h3>
        
        <div className="space-y-4">
          {variants.map((variant) => (
            <div key={variant._id} className="border border-base-300 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <div 
                  className="w-4 h-4 rounded-full border border-base-300"
                  style={{ backgroundColor: variant.color.toLowerCase() }}
                ></div>
                <h4 className="font-semibold">{variant.color}</h4>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {variant.sizes.map((size) => (
                  <div 
                    key={size._id} 
                    className="text-center p-2 bg-base-200 rounded"
                  >
                    <div className="text-sm font-medium">{size.size}</div>
                    <div className={`text-xs ${getStockStatusColor(size.stock)}`}>
                      {size.stock} units
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductVariants;