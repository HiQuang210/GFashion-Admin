import { GridColDef } from '@mui/x-data-grid';
import { Package } from 'lucide-react';
import { formatDate, formatPrice, getTotalStock } from '@utils/productHelper';
import VariantSummaryCell from './VariantSummaryCell';

export const createProductColumns = (
  handleViewVariantDetails: (product: ProductWithIndex) => void
): GridColDef[] => [
  {
    field: 'index',
    headerName: 'ID',
    width: 70,
    sortable: false,
    filterable: false,
  },
  {
    field: 'name',
    headerName: 'Product',
    minWidth: 300,
    flex: 1,
    renderCell: (params) => (
      <div className="flex gap-3 items-center py-2">
        <div className="w-8 xl:w-12 h-8 xl:h-12 overflow-hidden flex justify-center items-center rounded-md">
          <img
            src={params.row.images?.[0] || '/corrugated-box.jpg'}
            alt="product-picture"
            className="object-cover w-full h-full"
          />
        </div>
        <span className="mb-0 pb-0 leading-none">{params.row.name}</span>
      </div>
    ),
  },
  {
    field: 'type',
    type: 'string',
    headerName: 'Type',
    minWidth: 100,
    flex: 1,
  },
  {
    field: 'price',
    type: 'string',
    headerName: 'Price',
    minWidth: 100,
    flex: 1,
    renderCell: (params) => formatPrice(params.row.price),
  },
  {
    field: 'producer',
    headerName: 'Producer',
    type: 'string',
    minWidth: 150,
    flex: 1,
  },
  {
    field: 'variants',
    headerName: 'Variants',
    minWidth: 180,
    flex: 1,
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <VariantSummaryCell
        product={params.row}
        onViewDetails={() => handleViewVariantDetails(params.row)}
      />
    ),
  },
  {
    field: 'createdAt',
    headerName: 'Created At',
    minWidth: 140,
    flex: 1,
    valueFormatter: ({ value }) => formatDate(value),
  },
  {
    field: 'inStock',
    headerName: 'Total Stock',
    minWidth: 120,
    flex: 1,
    sortable: false,
    filterable: false,
    renderCell: (params) => {
      const totalStock = getTotalStock(params.row.variants || []);
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          totalStock > 0 
            ? 'bg-accent/10 text-green-800' 
            : 'bg-primary/10 text-red-800'
        }`}>
          <Package className="w-3 h-3 mr-1" />
          {totalStock}
        </span>
      );
    },
  },
];