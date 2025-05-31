import React, { useState } from 'react';
import {
  DataGrid,
  GridColDef,
  GridToolbar
} from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { deleteProduct } from '../api/ApiCollection';
import DeleteConfirmationModal from './DeleteConfirmation';

interface DataTableProps {
  columns: GridColDef[];
  rows: object[]; 
  slug: string;
  includeActionColumn: boolean;
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  rows,
  slug,
  includeActionColumn,
}) => {
  const navigate = useNavigate();
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetName, setDeleteTargetName] = useState<string>('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteTargetId) return;

    setIsDeleting(true);
    console.log('Attempting to delete product with ID:', deleteTargetId);

    try {
      // Use single product delete (string parameter triggers the single delete endpoint)
      const response = await deleteProduct(deleteTargetId); 
      console.log('Delete API response:', response);
      toast.success('Product deleted successfully!');
      handleCloseModal();
      
      // Refresh the page to update the product list
      window.location.reload(); 
    } catch (error: any) {
      console.error('Delete API error details:', error);
      console.error('Error response:', error?.response?.data);
      console.error('Error status:', error?.response?.status);
      
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete product';
      toast.error(`Delete failed: ${errorMessage}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseModal = () => {
    setIsConfirmOpen(false);
    setDeleteTargetId(null);
    setDeleteTargetName('');
  };

  const actionColumn: GridColDef = {
    field: 'action',
    headerName: 'Action',
    minWidth: 100,
    flex: 1,
    renderCell: (params) => {
      const productId = params.row._id || params.row.id;
      const productName = params.row.name || 'Unknown Product';
      
      console.log('Action cell - Product ID:', productId, 'Name:', productName);
      
      return (
        <div className="flex items-center">
          <button
            onClick={() => {
              console.log('Edit navigation - Product ID:', productId);
              navigate(`/${slug}/${productId}`);
            }}
            className="btn btn-square btn-ghost"
            title="Edit Product"
          >
            <HiOutlinePencilSquare />
          </button>
          <button
            onClick={() => {
              console.log('Delete button clicked - Product ID:', productId, 'Name:', productName);
              setDeleteTargetId(productId);
              setDeleteTargetName(productName);
              setIsConfirmOpen(true);
            }}
            className="btn btn-square btn-ghost"
            title="Delete Product"
            disabled={isDeleting}
          >
            <HiOutlineTrash />
          </button>
        </div>
      );
    },
  };

  return (
    <div className="w-full bg-base-100 text-base-content">
      <DataGrid
        className="dataGrid p-0 xl:p-3 w-full bg-base-100 text-white"
        rows={rows}
        columns={includeActionColumn ? [...columns, actionColumn] : columns}
        getRowHeight={() => 'auto'}
        getRowId={(row) => {
          const id = row._id || row.id;
          console.log('DataGrid getRowId - using ID:', id);
          return id;
        }}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
        disableColumnFilter
        disableDensitySelector
        disableColumnSelector
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isConfirmOpen}
        onClose={handleCloseModal}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        itemName={deleteTargetName}
        itemId={deleteTargetId || undefined}
        confirmButtonText="Delete Product"
      />
    </div>
  );
};

export default DataTable;