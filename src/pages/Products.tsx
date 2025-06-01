import React, { useState } from 'react';
import DataTable, { ActionConfig } from '../components/DataTable';
import { fetchAdminProducts, deleteProduct, deleteMultipleProducts } from '../api/ApiCollection';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import VariantDetailsModal from '../components/products/VariantDetailsModal';
import SummaryStatistics from '../components/products/SummaryStatistics';
import { createProductColumns } from '../components/products/ProductColumns';
import { getTotalStock, getTotalVariants } from '../utils/productHelper';
import { useNavigate } from 'react-router-dom';
import { HiOutlineTrash } from 'react-icons/hi2';
import DeleteConfirmationModal from '../components/DeleteConfirmation';

const Products: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<ProductWithIndex | null>(null);
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const navigate = useNavigate();
  
  const queryParams = {
    page: 1,
    limitItem: 50,
    sort: '',
    filter: '',
    searchQuery: '',
  };

  const { isLoading, data: response } = useQuery({
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

  const handleSelectionChange = (selectedIds: string[]) => {
    setSelectedProductIds(selectedIds);
  };

  const handleBulkDelete = async () => {
    if (selectedProductIds.length === 0) return;

    setIsBulkDeleting(true);
    console.log('Attempting to delete products with IDs:', selectedProductIds);

    try {
      const response = await deleteMultipleProducts(selectedProductIds);
      console.log('Bulk delete API response:', response);
      toast.success(`${selectedProductIds.length} product(s) deleted successfully!`);
      handleCloseBulkDeleteModal();
      window.location.reload();
    } catch (error: any) {
      console.error('Bulk delete API error details:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete products';
      toast.error(`Bulk delete failed: ${errorMessage}`);
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handleCloseBulkDeleteModal = () => {
    setIsBulkDeleteModalOpen(false);
  };

  const getSelectedProductNames = () => {
    if (!rowsWithIndex.length || !selectedProductIds.length) return '';
    
    const selectedProducts = rowsWithIndex.filter(product => 
      selectedProductIds.includes(product._id || product.id)
    );
    
    if (selectedProducts.length <= 3) {
      return selectedProducts.map(p => p.name).join(', ');
    } else {
      return `${selectedProducts.slice(0, 2).map(p => p.name).join(', ')} and ${selectedProducts.length - 2} more`;
    }
  };

  const columns = createProductColumns(handleViewVariantDetails);

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

  const totalProducts = rowsWithIndex.length;
  const totalVariants = getTotalVariants(rowsWithIndex);
  const totalStock = rowsWithIndex.reduce((total: number, product: ProductWithIndex) => 
    total + getTotalStock(product.variants), 0
  );

  const actionConfig: ActionConfig = {
    showEdit: true,
    showDelete: true,
    editRoute: (id: string) => `/product/${id}`,
    onDelete: async (id: string) => {
      await deleteProduct(id);
    },
    getItemName: (row: any) => row.name || 'Product'
  };

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
          <div className="flex gap-2">
            {selectedProductIds.length > 0 && (
              <button
                onClick={() => setIsBulkDeleteModalOpen(true)}
                className="btn btn-error"
                disabled={isBulkDeleting}
              >
                <HiOutlineTrash />
                Delete Selected ({selectedProductIds.length})
              </button>
            )}
            <button
              onClick={() => navigate('/product/add')}
              className={`btn ${isLoading ? 'btn-disabled' : 'btn-primary'}`}
            >
              Add New Product +
            </button>
          </div>
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
          actionConfig={actionConfig}
          onSelectionChange={handleSelectionChange}
          checkboxSelection={true}
        />

        {/* Variant Details Modal */}
        <VariantDetailsModal
          product={selectedProduct}
          isOpen={isVariantModalOpen}
          onClose={handleCloseVariantModal}
        />

        {/* Bulk Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={isBulkDeleteModalOpen}
          onClose={handleCloseBulkDeleteModal}
          onConfirm={handleBulkDelete}
          isDeleting={isBulkDeleting}
          itemName={getSelectedProductNames()}
          title="Delete Multiple Products"
          description={`Are you sure you want to delete ${selectedProductIds.length} selected product(s)? This action cannot be undone.`}
          confirmButtonText={`Delete ${selectedProductIds.length} Product(s)`}
        />
      </div>
    </div>
  );
};

export default Products;