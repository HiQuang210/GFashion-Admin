import React from 'react';
import { formatDate } from '../../utils/productHelper';
import { HiOutlineCalendar } from 'react-icons/hi2';

interface ProductAdditionalInfoProps {
  product: Product;
}

const ProductAdditionalInfo: React.FC<ProductAdditionalInfoProps> = ({ product }) => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h3 className="card-title flex items-center gap-2 mb-4">
          <HiOutlineCalendar size={20} />
          Additional Information
        </h3>
        
        <div className="space-y-3">
          {product.description && (
            <div>
              <label className="text-sm font-medium text-base-content/70">Description</label>
              <p className="text-sm mt-1">{product.description}</p>
            </div>
          )}
          
          <div>
            <label className="text-sm font-medium text-base-content/70">Created At</label>
            <p className="text-sm">{formatDate(product.createdAt)}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-base-content/70">Last Updated</label>
            <p className="text-sm">{formatDate(product.updatedAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductAdditionalInfo;