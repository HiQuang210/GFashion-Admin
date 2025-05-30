import React from 'react';

interface SummaryStatisticsProps {
  totalProducts: number;
  totalVariants: number;
  totalStock: number;
}

const SummaryStatistics: React.FC<SummaryStatisticsProps> = ({
  totalProducts,
  totalVariants,
  totalStock
}) => (
  <div className="grid grid-cols-3 gap-4 mb-4">
    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
      <div className="text-2xl font-bold text-blue-600">{totalProducts}</div>
      <div className="text-sm text-blue-800">Products</div>
    </div>
    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
      <div className="text-2xl font-bold text-green-600">{totalVariants}</div>
      <div className="text-sm text-green-800">Variants</div>
    </div>
    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
      <div className="text-2xl font-bold text-orange-600">{totalStock}</div>
      <div className="text-sm text-orange-800">Total Stock</div>
    </div>
  </div>
);

export default SummaryStatistics;