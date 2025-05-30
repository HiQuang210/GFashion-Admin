import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import { fetchAdminProducts } from '../api/ApiCollection';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import AddProductData from '../components/forms/AddProductData';
import VariantDetailsModal from '../components/products/VariantDetailsModal';
import SummaryStatistics from '../components/products/SummaryStatistics';
import { createProductColumns } from '../components/products/ProductColumns';
import { getTotalStock, getTotalVariants } from '../utils/productHelper';

const Products: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductWithIndex | null>(null);
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  
  const queryParams = {
    page: 1,
    limitItem: 50,
    sort: '',
    filter: '',
    searchQuery: '',
  };

  const { isLoading, isError, isSuccess, data: response } = useQuery({
    queryKey: ['adminProducts', queryParams],
    queryFn: ({ queryKey }) => {
      const [, params] = queryKey as [string, Parameters<typeof fetchAdminProducts>[0]];
      return fetchAdminProducts(params);
    },
  });

  const handleViewVariantDetails = (product: ProductWithIndex) => {
    setSelectedProduct(product);
    setIsVariantModalOpen(true);
  };

  const handleCloseVariantModal = () => {
    setIsVariantModalOpen(false);
    setSelectedProduct(null);
  };

  const columns = createProductColumns(handleViewVariantDetails);

  useEffect(() => {
    if (isLoading) {
      toast.loading('Loading...', { id: 'promiseProducts' });
    } else if (isError) {
      toast.error('Error while getting the data!', { id: 'promiseProducts' });
    } else if (isSuccess) {
      toast.success('Got the data successfully!', { id: 'promiseProducts' });
    }
  }, [isError, isLoading, isSuccess]);

  const rowsWithIndex: ProductWithIndex[] = response?.data
    ? [...response.data]
        .sort((a: Product, b: Product) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
        .map((item: Product, index: number) => ({
          ...item,
          id: item._id, 
          index: index + 1,
        }))
    : [];

  // Calculate summary statistics
  const totalProducts = rowsWithIndex.length;
  const totalVariants = getTotalVariants(rowsWithIndex);
  const totalStock = rowsWithIndex.reduce((total: number, product: ProductWithIndex) => 
    total + getTotalStock(product.variants), 0
  );

  return (
    <div className="w-full p-0 m-0">
      <div className="w-full flex flex-col items-stretch gap-3">
        {/* Header */}
        <div className="w-full flex justify-between xl:mb-5">
          <div className="flex gap-1 justify-start flex-col items-start">
            <h2 className="font-bold text-2xl xl:text-4xl mt-0 pt-0 text-base-content dark:text-neutral-200">
              Products
            </h2>
            {rowsWithIndex.length > 0 && (
              <span className="text-neutral dark:text-neutral-content font-medium text-base">
                {rowsWithIndex.length} Products Found
              </span>
            )}
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className={`btn ${isLoading ? 'btn-disabled' : 'btn-primary'}`}
          >
            Add New Product +
          </button>
        </div>

        {/* Summary Statistics */}
        {rowsWithIndex.length > 0 && (
          <SummaryStatistics
            totalProducts={totalProducts}
            totalVariants={totalVariants}
            totalStock={totalStock}
          />
        )}

        {/* Data Table */}
        <DataTable
          slug="products"
          columns={columns}
          rows={rowsWithIndex}
          includeActionColumn={true}
        />

        {/* Variant Details Modal */}
        <VariantDetailsModal
          product={selectedProduct}
          isOpen={isVariantModalOpen}
          onClose={handleCloseVariantModal}
        />

        {/* Add Product Modal */}
        {isOpen && (
          <AddProductData
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        )}
      </div>
    </div>
  );
};

export default Products;