import React, { useState } from 'react';
import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridRowSelectionModel,
} from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import DeleteConfirmationModal from './DeleteConfirmation';

export interface ActionConfig {
  showEdit?: boolean;
  showDelete?: boolean;
  editRoute?: (id: string) => string;
  onDelete?: (id: string) => Promise<void>; 
  getItemName?: (row: any) => string; 
}

interface DataTableProps {
  columns: GridColDef[];
  rows: object[]; 
  slug: string;
  includeActionColumn?: boolean;
  actionConfig?: ActionConfig;
  onSelectionChange?: (selectedIds: string[]) => void;
  checkboxSelection?: boolean;
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  rows,
  slug,
  includeActionColumn = false,
  actionConfig = {},
  onSelectionChange,
  checkboxSelection = false,
}) => {
  const navigate = useNavigate();
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetName, setDeleteTargetName] = useState<string>('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);

  const {
    showEdit = true,
    showDelete = true,
    editRoute = (id: string) => `/${slug}/${id}`,
    onDelete,
    getItemName = (row: any) => row.name || row.firstName || 'Item'
  } = actionConfig;

  const handleSelectionChange = (newSelection: GridRowSelectionModel) => {
    setRowSelectionModel(newSelection);
    const selectedIds = newSelection.map(id => String(id));
    onSelectionChange?.(selectedIds);
  };

  const handleDelete = async () => {
    if (!deleteTargetId || !onDelete) return;

    setIsDeleting(true);
    console.log('Attempting to delete item with ID:', deleteTargetId);

    try {
      await onDelete(deleteTargetId);
      toast.success(`${deleteTargetName} deleted successfully!`);
      handleCloseModal();
      window.location.reload(); 
    } catch (error: any) {
      console.error('Delete API error details:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete item';
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
    sortable: false,
    filterable: false,
    renderCell: (params) => {
      const itemId = params.row._id || params.row.id;
      const itemName = getItemName(params.row);
      
      return (
        <div className="flex items-center gap-1">
          {showEdit && (
            <button
              onClick={() => navigate(editRoute(itemId))}
              className="btn btn-square btn-ghost btn-sm"
              title="Edit"
            >
              <HiOutlinePencilSquare className="w-4 h-4" />
            </button>
          )}
          {showDelete && onDelete && (
            <button
              onClick={() => {
                console.log('Delete button clicked - Item ID:', itemId, 'Name:', itemName);
                setDeleteTargetId(itemId);
                setDeleteTargetName(itemName);
                setIsConfirmOpen(true);
              }}
              className="btn btn-square btn-ghost btn-sm text-error hover:bg-error hover:text-error-content"
              title="Delete"
              disabled={isDeleting}
            >
              <HiOutlineTrash className="w-4 h-4" />
            </button>
          )}
        </div>
      );
    },
  };

  const finalColumns = includeActionColumn ? [...columns, actionColumn] : columns;

  return (
    <div className="w-full bg-base-100 text-base-content">
      <DataGrid
        className="dataGrid p-0 xl:p-3 w-full bg-base-100 text-white"
        rows={rows}
        columns={finalColumns}
        getRowHeight={() => 'auto'}
        getRowId={(row) => {
          const id = row._id || row.id;
          if (!id) {
            console.warn('DataGrid row missing ID:', row);
          }
          return id || Math.random().toString(); 
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
        pageSizeOptions={[5, 10, 25, 50]}
        checkboxSelection={checkboxSelection}
        disableRowSelectionOnClick
        disableColumnFilter
        disableDensitySelector
        disableColumnSelector
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={handleSelectionChange}
      />

      {/* Delete Confirmation Modal */}
      {showDelete && onDelete && (
        <DeleteConfirmationModal
          isOpen={isConfirmOpen}
          onClose={handleCloseModal}
          onConfirm={handleDelete}
          isDeleting={isDeleting}
          itemName={deleteTargetName}
          itemId={deleteTargetId || undefined}
          confirmButtonText={`Delete ${deleteTargetName}`}
        />
      )}
    </div>
  );
};

export default DataTable;