// components/ProductBasicInfo.tsx
import React from 'react';
import { formatPrice } from '../../utils/productHelper';
import { 
  HiOutlineInformationCircle, 
  HiOutlineStar, 
  HiOutlineShoppingBag 
} from 'react-icons/hi2';

interface ProductBasicInfoProps {
  product: Product;
}

const ProductBasicInfo: React.FC<ProductBasicInfoProps> = ({ product }) => {
  return (
    <div className="card bg-base-100 shadow-xl mb-6">
      <div className="card-body">
        <h2 className="card-title flex items-center gap-2 mb-4">
          <HiOutlineInformationCircle size={20} />
          Basic Information
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-base-content/70">Product Name</label>
            <p className="text-lg font-semibold">{product.name}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-base-content/70">Price</label>
              <p className="text-xl font-bold text-primary">{formatPrice(product.price)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-base-content/70">Type</label>
              <p className="font-medium">{product.type}</p>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-base-content/70">Producer</label>
            <p className="font-medium">{product.producer}</p>
          </div>
          
          {product.material && (
            <div>
              <label className="text-sm font-medium text-base-content/70">Material</label>
              <p className="font-medium">{product.material}</p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-base-content/70 flex items-center gap-1">
                <HiOutlineStar size={16} />
                Rating
              </label>
              <p className="font-medium">{product.rating}/5</p>
            </div>
            <div>
              <label className="text-sm font-medium text-base-content/70 flex items-center gap-1">
                <HiOutlineShoppingBag size={16} />
                Sold
              </label>
              <p className="font-medium">{product.sold} units</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductBasicInfo;