import React, { useState } from 'react';
import { HiCalendar } from 'react-icons/hi2';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { AdminOrder } from 'types/Order';
import { formatCurrency, formatDate, getShippingCost, getSubtotal } from '@utils/orderHelper';
import { getStatusBadge } from './Status';
import { updateOrderStatus } from '@api/ApiCollection';
import StatusUpdateModal from './UpdateModal';

interface OrderSummaryProps {
  order: AdminOrder;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ order }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const subtotal = getSubtotal(order.products);
  const shippingCost = getShippingCost(order.delivery);

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      updateOrderStatus(orderId, status),
    onSuccess: () => {
      toast.success('Order status updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['order', order.id] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || error.message || 'Failed to update order status';
      toast.error(message);
    },
  });

  const handleUpdateStatus = async (newStatus: string): Promise<void> => {
    await updateStatusMutation.mutateAsync({
      orderId: order.id,
      status: newStatus,
    });
  };

  const handlePrintOrder = () => {
    window.print();
  };

  return (
    <div className="card bg-base-100 shadow-lg sticky top-6">
      <div className="card-body">
        <h2 className="card-title text-xl mb-4">Order Summary</h2>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-base-content/70">
            <HiCalendar className="w-4 h-4" />
            <span className="text-sm">Order Date</span>
          </div>
          <p className="font-medium">{formatDate(order.createdAt)}</p>
        </div>

        <div className="divider"></div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Shipping ({order.delivery})</span>
            <span>{formatCurrency(shippingCost)}</span>
          </div>
          
          <div className="divider"></div>
          
          <div className="flex justify-between text-lg font-bold">
            <span>Total Amount:</span>
            <span className="text-primary">{formatCurrency(order.total)}</span>
          </div>
        </div>

        <div className="divider"></div>

        <div className="text-center">
          <p className="text-sm text-base-content/70 mb-2">Order Status</p>
          {getStatusBadge(order.status)}
        </div>

        <div className="mt-6 space-y-2">
          {order.status.toLowerCase() !== 'completed' && order.status.toLowerCase() !== 'cancelled' && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="btn btn-primary w-full"
              disabled={updateStatusMutation.isPending}
            >
              {updateStatusMutation.isPending ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Updating...
                </>
              ) : (
                'Update Status'
              )}
            </button>
          )}
          <button 
            onClick={handlePrintOrder}
            className="btn btn-outline btn-secondary w-full"
          >
            Print Order
          </button>
        </div>
      </div>

      <StatusUpdateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentStatus={order.status}
        orderId={order.id}
        onUpdateStatus={handleUpdateStatus}
        isUpdating={updateStatusMutation.isPending}
      />
    </div>
  );
};

export default OrderSummary;