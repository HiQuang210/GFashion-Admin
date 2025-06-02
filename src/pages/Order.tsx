import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { HiArrowLeft, HiExclamationCircle } from 'react-icons/hi2';
import { fetchOrderById } from '@api/ApiCollection';
import { getStatusBadge } from '@components/order-details/Status';
import CustomerInfo from '@components/order-details/CustomerInfo';
import DeliveryInfo from '@components/order-details/DeliveryInfo';
import OrderSummary from '@components/order-details/Summary';
import OrderItems from '@components/order-details/Itemslist';

const Order = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { isLoading, isError, data: order } = useQuery({
    queryKey: ['order', id],
    queryFn: () => fetchOrderById(id!),
    enabled: !!id,
  });

  React.useEffect(() => {
    if (isLoading) {
      toast.loading('Loading order details...', { id: 'orderDetail' });
    }
    if (isError) {
      toast.error('Error loading order details!', { id: 'orderDetail' });
    }
    if (order) {
      toast.success('Order details loaded!', { id: 'orderDetail' });
    }
  }, [isError, isLoading, order]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-error text-6xl">
          <HiExclamationCircle />
        </div>
        <h2 className="text-2xl font-bold text-error">Order Not Found</h2>
        <p className="text-base-content/70">The order you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={() => navigate('/orders')}
          className="btn btn-primary"
        >
          <HiArrowLeft className="w-4 h-4" />
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="w-full p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/orders')}
            className="btn btn-ghost btn-circle"
          >
            <HiArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-base-content">Order Details</h1>
            <p className="text-base-content/70">Order ID: #{order.id}</p>
          </div>
        </div>
        {getStatusBadge(order.status)}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Customer & Order Info */}
        <div className="xl:col-span-2 space-y-6">
          <CustomerInfo order={order} />
          <DeliveryInfo order={order} />
          <OrderItems products={order.products} />
        </div>

        {/* Right Column - Order Summary */}
        <div className="space-y-6">
          <OrderSummary order={order} />
        </div>
      </div>
    </div>
  );
};

export default Order;