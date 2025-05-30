import React from 'react';

interface SummaryStatisticsProps {
  totalProducts: number;
  totalVariants: number;
  totalStock: number;
}

const SummaryStatistics: React.FC<SummaryStatisticsProps> = ({
  totalProducts,
  totalVariants,
  totalStock,
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
    <div className="bg-primary/10 p-4 rounded-lg border border-base-300">
      <div className="text-2xl font-bold text-blue-500">{totalProducts}</div>
      <div className="text-sm text-base-content/70">Products</div>
    </div>
    <div className="bg-accent/10 p-4 rounded-lg border border-base-300">
      <div className="text-2xl font-bold text-green-500">{totalVariants}</div>
      <div className="text-sm text-base-content/70">Variants</div>
    </div>
    <div className="bg-secondary/10 p-4 rounded-lg border border-base-300">
      <div className="text-2xl font-bold text-pink-500">{totalStock}</div>
      <div className="text-sm text-base-content/70"><strong>Total Stock</strong></div>
    </div>
  </div>
);

export default SummaryStatistics;
