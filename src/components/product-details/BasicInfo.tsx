import React from 'react';
import { formatPrice } from '@utils/productHelper';
import { 
  HiOutlineInformationCircle, 
  HiOutlineStar, 
  HiOutlineShoppingBag 
} from 'react-icons/hi2';

interface ProductBasicInfoProps {
  product: Product;
  isEditing?: boolean;
  onProductChange?: (field: keyof Product, value: any) => void;
}

const ProductBasicInfo: React.FC<ProductBasicInfoProps> = ({ 
  product, 
  isEditing = false, 
  onProductChange 
}) => {
  const handleInputChange = (field: keyof Product, value: any) => {
    if (onProductChange) {
      onProductChange(field, value);
    }
  };

  const handleNumberChange = (field: keyof Product, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      handleInputChange(field, numValue);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl mb-6">
      <div className="card-body">
        <h2 className="card-title flex items-center gap-2 mb-4">
          <HiOutlineInformationCircle size={20} />
          Basic Information
        </h2>
        
        <div className="space-y-4">
          {/* Product Name */}
          <div>
            <label className="text-sm font-medium text-base-content/70">Product Name</label>
            {isEditing ? (
              <input
                type="text"
                value={product.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="input input-bordered w-full mt-1"
                placeholder="Enter product name"
              />
            ) : (
              <p className="text-lg font-semibold">{product.name}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Price */}
            <div>
              <label className="text-sm font-medium text-base-content/70">Price</label>
              {isEditing ? (
                <input
                  type="number"
                  value={product.price}
                  onChange={(e) => handleNumberChange('price', e.target.value)}
                  className="input input-bordered w-full mt-1"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              ) : (
                <p className="text-xl font-bold text-primary">{formatPrice(product.price)}</p>
              )}
            </div>
            
            {/* Type */}
            <div>
              <label className="text-sm font-medium text-base-content/70">Type</label>
              {isEditing ? (
                <input
                  type="text"
                  value={product.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="input input-bordered w-full mt-1"
                  placeholder="Enter product type"
                />
              ) : (
                <p className="font-medium">{product.type}</p>
              )}
            </div>
          </div>
          
          {/* Producer */}
          <div>
            <label className="text-sm font-medium text-base-content/70">Producer</label>
            {isEditing ? (
              <input
                type="text"
                value={product.producer}
                onChange={(e) => handleInputChange('producer', e.target.value)}
                className="input input-bordered w-full mt-1"
                placeholder="Enter producer name"
              />
            ) : (
              <p className="font-medium">{product.producer}</p>
            )}
          </div>
          
          {/* Material */}
          {(product.material || isEditing) && (
            <div>
              <label className="text-sm font-medium text-base-content/70">Material</label>
              {isEditing ? (
                <input
                  type="text"
                  value={product.material || ''}
                  onChange={(e) => handleInputChange('material', e.target.value)}
                  className="input input-bordered w-full mt-1"
                  placeholder="Enter material (optional)"
                />
              ) : (
                <p className="font-medium">{product.material}</p>
              )}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            {/* Rating - Always display only, never editable */}
            <div>
              <label className="text-sm font-medium text-base-content/70 flex items-center gap-1">
                <HiOutlineStar size={16} />
                Rating
              </label>
              <p className="font-medium">{product.rating}/5</p>
            </div>

            {/* Sold - Always display only */}
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