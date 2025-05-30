import React from 'react';
import { ChevronRight, Palette, Ruler } from 'lucide-react';

interface VariantSummaryCellProps {
  product: ProductWithIndex;
  onViewDetails: () => void;
}

const VariantSummaryCell: React.FC<VariantSummaryCellProps> = ({ 
  product, 
  onViewDetails 
}) => (
  <div className="flex flex-col gap-1 mt-1">
    <div className="flex items-center gap-2">
      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1">
        <Palette className="w-3 h-3" />
        {product.variants.length} color(s)
      </span>
      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded flex items-center gap-1">
        <Ruler className="w-3 h-3" />
        {product.variants.reduce((total, variant) => total + variant.sizes.length, 0)} size
      </span>
    </div>
    <button
      onClick={onViewDetails}
      className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-1"
    >
      <ChevronRight className="w-3 h-3" />
      View detail
    </button>
  </div>
);

export default VariantSummaryCell;