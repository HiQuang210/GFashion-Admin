import React from 'react';
import { Package } from 'lucide-react';
import { formatPrice, getTotalStock } from '@utils/productHelper';
import { useModalTransition } from '@hooks/useModalTransition';

interface VariantDetailsModalProps {
  product: ProductWithIndex | null;
  isOpen: boolean;
  onClose: () => void;
}

const VariantDetailsModal: React.FC<VariantDetailsModalProps> = ({
  product,
  isOpen,
  onClose
}) => {
  const { showModal, handleClose } = useModalTransition({
    isOpen,
    onClose,
    transitionDuration: 300
  });

  if (!product || !isOpen) return null;

  const getTotalProductVariants = (variants: Variant[]) => {
    return variants.reduce((total, variant) => total + variant.sizes.length, 0);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`bg-base-100 text-base-content rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden transition-all duration-300 ${
          showModal
            ? 'translate-y-0 opacity-100 scale-100'
            : 'translate-y-8 opacity-0 scale-95'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-base-300">
          <div className="flex items-center gap-4">
            <img
              src={product.images?.[0] || '/corrugated-box.jpg'}
              alt={product.name}
              className="w-12 h-12 object-cover rounded-lg"
            />
            <div>
              <h3 className="text-xl font-semibold">{product.name}</h3>
              <p className="text-sm text-muted">{formatPrice(product.price)} • {product.type}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-xl text-base-content hover:text-error transition-colors"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="mb-4">
            <h4 className="text-lg font-medium mb-3 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Variants ({product.variants.length} color)
            </h4>
          </div>

          <div className="space-y-4">
            {product.variants.map((variant: Variant) => (
              <div key={variant._id} className="bg-base-200 border border-base-300 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-full border-2"
                      style={{ backgroundColor: variant.color.toLowerCase() }}
                      title={variant.color}
                    />
                    <span className="font-medium text-base-content text-lg">
                      {variant.color}
                    </span>
                  </div>
                  <span className="text-sm bg-base-100 border border-base-300 px-3 py-1 rounded-full text-base-content">
                    {variant.sizes.length} available size
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {variant.sizes.map((sizeItem: Size) => (
                    <div
                      key={sizeItem._id}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-colors ${
                        sizeItem.stock > 0
                          ? 'border-green-300 bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100'
                          : 'border-red-300 bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100'
                      }`}
                    >
                      <span className="font-bold text-lg">{sizeItem.size}</span>
                      <span className="text-sm">
                        {sizeItem.stock > 0 ? `${sizeItem.stock} available` : 'Out of stock'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-6 bg-base-200 border border-base-300 rounded-lg p-4">
            <h5 className="font-medium mb-2">Summary</h5>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{product.variants.length}</div>
                <div className="text-sm text-base-content">Colors</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {getTotalProductVariants(product.variants)}
                </div>
                <div className="text-sm text-base-content">Product Variants</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {getTotalStock(product.variants)}
                </div>
                <div className="text-sm text-base-content">Total Stock</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VariantDetailsModal;
