import React from 'react';
import { HiOutlineSwatch, HiOutlinePlus, HiOutlineTrash, HiOutlineXMark } from 'react-icons/hi2';

interface ProductVariantsProps {
  variants: Variant[];
  isEditing?: boolean;
  onVariantsChange?: (variants: Variant[]) => void;
}

const ProductVariants: React.FC<ProductVariantsProps> = ({ 
  variants, 
  isEditing = false, 
  onVariantsChange 
}) => {
  const getStockStatusColor = (stock: number) => {
    if (stock === 0) return 'text-error';
    if (stock < 5) return 'text-warning';
    return 'text-success';
  };

  const handleVariantChange = (variantIndex: number, field: keyof Variant, value: any) => {
    if (!onVariantsChange) return;
    
    const updatedVariants = [...variants];
    updatedVariants[variantIndex] = {
      ...updatedVariants[variantIndex],
      [field]: value
    };
    onVariantsChange(updatedVariants);
  };

  const handleSizeChange = (variantIndex: number, sizeIndex: number, field: keyof Size, value: any) => {
    if (!onVariantsChange) return;
    
    const updatedVariants = [...variants];
    const updatedSizes = [...updatedVariants[variantIndex].sizes];
    updatedSizes[sizeIndex] = {
      ...updatedSizes[sizeIndex],
      [field]: field === 'stock' ? parseInt(value) || 0 : value
    };
    updatedVariants[variantIndex] = {
      ...updatedVariants[variantIndex],
      sizes: updatedSizes
    };
    onVariantsChange(updatedVariants);
  };

  const addNewVariant = () => {
    if (!onVariantsChange) return;
    
    const newVariant: Variant = {
      _id: `temp-variant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      color: '',
      sizes: [
        {
          _id: `temp-size-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          size: '',
          stock: 0
        }
      ]
    };
    onVariantsChange([...variants, newVariant]);
  };

  const removeVariant = (variantIndex: number) => {
    if (!onVariantsChange) return;
    
    const updatedVariants = variants.filter((_, index) => index !== variantIndex);
    onVariantsChange(updatedVariants);
  };

  const addNewSize = (variantIndex: number) => {
    if (!onVariantsChange) return;
    
    const newSize: Size = {
      _id: `temp-size-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      size: '',
      stock: 0
    };
    
    const updatedVariants = [...variants];
    updatedVariants[variantIndex] = {
      ...updatedVariants[variantIndex],
      sizes: [...updatedVariants[variantIndex].sizes, newSize]
    };
    onVariantsChange(updatedVariants);
  };

  const removeSize = (variantIndex: number, sizeIndex: number) => {
    if (!onVariantsChange) return;
    
    const updatedVariants = [...variants];
    updatedVariants[variantIndex] = {
      ...updatedVariants[variantIndex],
      sizes: updatedVariants[variantIndex].sizes.filter((_, index) => index !== sizeIndex)
    };
    onVariantsChange(updatedVariants);
  };

  return (
    <div className="card bg-base-100 shadow-xl mb-6">
      <div className="card-body">
        <div className="flex items-center justify-between mb-4">
          <h3 className="card-title flex items-center gap-2">
            <HiOutlineSwatch size={20} />
            Variants & Stock
          </h3>
          
          {isEditing && (
            <button
              onClick={addNewVariant}
              className="btn btn-sm btn-primary"
            >
              <HiOutlinePlus size={16} />
              Add Variant
            </button>
          )}
        </div>
        
        <div className="space-y-4">
          {variants.map((variant, variantIndex) => (
            <div key={variant._id} className="border border-base-300 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full border border-base-300"
                    style={{ backgroundColor: variant.color.toLowerCase() }}
                  ></div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={variant.color}
                      onChange={(e) => handleVariantChange(variantIndex, 'color', e.target.value)}
                      className="input input-sm input-bordered font-semibold"
                      placeholder="Color name"
                    />
                  ) : (
                    <h4 className="font-semibold">{variant.color}</h4>
                  )}
                </div>
                
                {isEditing && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => addNewSize(variantIndex)}
                      className="btn btn-xs btn-ghost"
                      title="Add Size"
                    >
                      <HiOutlinePlus size={14} />
                    </button>
                    {variants.length > 1 && (
                      <button
                        onClick={() => removeVariant(variantIndex)}
                        className="btn btn-xs btn-error btn-ghost"
                        title="Remove Variant"
                      >
                        <HiOutlineTrash size={14} />
                      </button>
                    )}
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {variant.sizes.map((size, sizeIndex) => (
                  <div 
                    key={size._id} 
                    className={`text-center p-2 bg-base-200 rounded relative ${
                      isEditing ? 'border border-dashed border-base-300' : ''
                    }`}
                  >
                    {isEditing ? (
                      <>
                        {variant.sizes.length > 1 && (
                          <button
                            onClick={() => removeSize(variantIndex, sizeIndex)}
                            className="absolute -top-1 -right-1 btn btn-xs btn-circle btn-error"
                          >
                            <HiOutlineXMark size={12} />
                          </button>
                        )}
                        <input
                          type="text"
                          value={size.size}
                          onChange={(e) => handleSizeChange(variantIndex, sizeIndex, 'size', e.target.value)}
                          className="input input-xs w-full mb-1 text-center font-medium"
                          placeholder="Size"
                        />
                        <input
                          type="number"
                          value={size.stock}
                          onChange={(e) => handleSizeChange(variantIndex, sizeIndex, 'stock', e.target.value)}
                          className="input input-xs w-full text-center"
                          placeholder="Stock"
                          min="0"
                        />
                        <div className="text-xs text-base-content/50 mt-1">units</div>
                      </>
                    ) : (
                      <>
                        <div className="text-sm font-medium">{size.size}</div>
                        <div className={`text-xs ${getStockStatusColor(size.stock)}`}>
                          {size.stock} units
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {variants.length === 0 && isEditing && (
            <div className="text-center py-8 text-base-content/50">
              <HiOutlineSwatch size={48} className="mx-auto mb-2 opacity-50" />
              <p>No variants yet. Click "Add Variant" to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductVariants;