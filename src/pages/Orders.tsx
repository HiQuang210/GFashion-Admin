import React from 'react';
import { GridColDef } from '@mui/x-data-grid';
import DataTable, { ActionConfig } from '@components/DataTable';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { fetchOrders } from '@api/ApiCollection';
import { AdminOrder } from '@type/Order'; 

const Orders = () => {
  const { isLoading, isError, isSuccess, data } = useQuery({
    queryKey: ['allorders'],
    queryFn: fetchOrders,
  });

  const columns: GridColDef[] = [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 80,
      renderCell: (params) => {
        const rowIndex = params.api.getRowIndexRelativeToVisibleRows(params.id);
        return typeof rowIndex === 'number' && !isNaN(rowIndex) ? rowIndex + 1 : '-';
      }
    },
    {
      field: 'recipient',
      headerName: 'Recipient',
      minWidth: 250,
      flex: 1.5,
      valueGetter: (params) => {
        const order = params.row as AdminOrder;
        return order.recipient || 'No recipient name';
      }
    },
    {
      field: 'address',
      type: 'string',
      headerName: 'Address',
      minWidth: 400,
      flex: 2,
      valueGetter: (params) => {
        return params.row.address || 'No address provided';
      }
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      minWidth: 140,
      flex: 1,
      valueGetter: (params) => {
        const date = new Date(params.row.createdAt);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }
    },
    {
      field: 'total',
      headerName: 'Total',
      minWidth: 150,
      flex: 1,
      valueGetter: (params) => {
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND'
        }).format(params.row.total);
      }
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 120,
      flex: 1,
      renderCell: (params) => {
        const status = params.row.status?.toLowerCase() || 'unknown';
        
        const getStatusConfig = (status: string) => {
          switch (status) {
            case 'pending':
              return {
                dotColor: 'bg-yellow-500',
                textColor: 'text-warning-content',
                bgColor: 'bg-warning/20',
                label: 'Pending'
              };
            case 'processing':
              return {
                dotColor: 'bg-blue-500',
                textColor: 'text-info-content',
                bgColor: 'bg-info/20',
                label: 'Processing'
              };
            case 'shipping':
              return {
                dotColor: 'bg-purple-500',
                textColor: 'text-primary-content',
                bgColor: 'bg-primary/20',
                label: 'Shipping'
              };
            case 'completed':
              return {
                dotColor: 'bg-green-500',
                textColor: 'text-success-content',
                bgColor: 'bg-success/20',
                label: 'Completed'
              };
            case 'cancelled':
              return {
                dotColor: 'bg-red-500',
                textColor: 'text-error-content',
                bgColor: 'bg-error/20',
                label: 'Cancelled'
              };
            default:
              return {
                dotColor: 'bg-gray-500',
                textColor: 'text-base-content',
                bgColor: 'bg-base-200',
                label: 'Unknown'
              };
          }
        };

        const config = getStatusConfig(status);
        
        return (
          <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-full ${config.bgColor}`}>
            <div className={`w-2 h-2 rounded-full ${config.dotColor}`}></div>
            <span className={`text-xs font-medium ${config.textColor} capitalize`}>
              {config.label}
            </span>
          </div>
        );
      },
    },
  ];

  const actionConfig: ActionConfig = {
    showEdit: true,
    showDelete: false, 
    editRoute: (id: string) => `/order/${id}`,
    getItemName: (row: any) => `Order #${row.id}` || 'Order'
  };

  React.useEffect(() => {
    if (isLoading) {
      toast.loading('Loading orders...', { id: 'promiseOrders' });
    }
    if (isError) {
      toast.error('Error while getting the orders!', {
        id: 'promiseOrders',
      });
    }
  }, [isError, isLoading, isSuccess]);

  return (
    <div className="w-full p-0 m-0">
      <div className="w-full flex flex-col items-stretch gap-3">
        <div className="w-full flex justify-between mb-5">
          <div className="flex gap-1 justify-start flex-col items-start">
            <h2 className="font-bold text-2xl xl:text-4xl mt-0 pt-0 text-base-content dark:text-neutral-200">
              Orders
            </h2>
            {data?.data?.length > 0 && (
              <span className="text-neutral dark:text-neutral-content font-medium text-base">
                {data.data.length} Orders Found
              </span>
            )}
          </div>
        </div>

        <DataTable
          slug="orders"
          columns={columns}
          rows={isSuccess ? data?.data || [] : []}
          includeActionColumn={true}
          actionConfig={actionConfig}
        />

        {isError && !isLoading && (
          <div className="w-full flex justify-center text-error">
            Error while getting the orders data!
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;