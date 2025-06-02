import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { 
  HiArrowLeft, 
  HiCube,
  HiUser, 
  HiMapPin, 
  HiTruck, 
  HiCreditCard,
  HiCalendar,
  HiCheckCircle,
  HiClock,
  HiXCircle,
  HiExclamationCircle,
  HiPhone
} from 'react-icons/hi2';
import { AdminOrder, OrderProduct } from '@type/Order';
import { fetchOrderById } from '@api/ApiCollection'; 

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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <HiCheckCircle className="w-5 h-5 text-success" />;
      case 'pending':
        return <HiClock className="w-5 h-5 text-warning" />;
      case 'processing':
        return <HiTruck className="w-5 h-5 text-info" />;
      case 'cancelled':
        return <HiXCircle className="w-5 h-5 text-error" />;
      default:
        return <HiExclamationCircle className="w-5 h-5 text-neutral" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: 'badge-warning',
      completed: 'badge-success',
      processing: 'badge-info',
      cancelled: 'badge-error',
    };
    
    const badgeClass = statusConfig[status.toLowerCase() as keyof typeof statusConfig] || 'badge-neutral';
    
    return (
      <div className={`badge ${badgeClass} gap-2 p-3`}>
        {getStatusIcon(status)}
        <span className="capitalize font-medium">{status}</span>
      </div>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate shipping cost based on delivery type
  const getShippingCost = (deliveryType: string) => {
    return deliveryType.toLowerCase() === 'standard' ? 20000 : 50000;
  };

  // Calculate subtotal
  const getSubtotal = (products: AdminOrder['products']) => {
    return products.reduce((acc, p) => acc + (p.price * p.quantity), 0);
  };

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

  const subtotal = getSubtotal(order.products);
  const shippingCost = getShippingCost(order.delivery);

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
          {/* Customer Information */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-xl mb-4 flex items-center gap-2">
                <HiUser className="w-5 h-5" />
                Customer Information
              </h2>
              
              <div className="flex items-center gap-4 p-4 bg-base-200 rounded-lg">
                <div className="avatar">
                  <div className="w-16 h-16 rounded-full">
                    {order.user?.img ? (
                      <img 
                        src={order.user.img} 
                        alt="Customer Avatar"
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-avatar.png';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-base-300 flex items-center justify-center">
                        <HiUser className="w-8 h-8 text-base-content/50" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">
                    {order.user?.fullName || `User #${order.userId}`}
                  </h3>
                  <p className="text-base-content/70">Customer ID: {order.userId}</p>
                  {order.user?.email && (
                    <p className="text-sm text-base-content/60">{order.user.email}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-xl mb-4 flex items-center gap-2">
                <HiMapPin className="w-5 h-5" />
                Delivery Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-base-content/70">Recipient</label>
                    <p className="text-base font-medium">{order.recipient}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-base-content/70">Phone Number</label>
                    <div className="flex items-center gap-2 mt-1">
                      <HiPhone className="w-4 h-4" />
                      <span className="text-base font-medium">
                        {order.user?.phone || 'Not provided'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-base-content/70">Delivery Type</label>
                    <div className="flex items-center gap-2 mt-1">
                      <HiTruck className="w-4 h-4" />
                      <span className="capitalize">{order.delivery}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-base-content/70">Delivery Address</label>
                    <p className="text-base">{order.address}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-base-content/70">Payment Method</label>
                    <div className="flex items-center gap-2 mt-1">
                      <HiCreditCard className="w-4 h-4" />
                      <span className="capitalize">{order.payment}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-xl mb-4">
                <HiCube className="w-5 h-5" />
                Order Items
              </h2>
              
              <div className="space-y-4">
                {order.products.map((product: OrderProduct, index: number) => (
                  <div key={`${product.productId}-${index}`} className="flex items-center gap-4 p-4 border border-base-300 rounded-lg">
                    <div className="avatar">
                      <div className="w-16 h-16 rounded">
                        <img 
                          src={product.image || '/placeholder-product.png'} 
                          alt={product.name}
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-product.png';
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <div className="text-sm text-base-content/70 space-y-1">
                        <p><span className="font-medium">Producer:</span> {product.producer}</p>
                        <p><span className="font-medium">Type:</span> {product.type}</p>
                        <p><span className="font-medium">Material:</span> {product.material}</p>
                        <div className="flex gap-4">
                          <span><span className="font-medium">Color:</span> {product.color}</span>
                          <span><span className="font-medium">Size:</span> {product.size}</span>
                        </div>
                        {product.description && (
                          <p><span className="font-medium">Description:</span> {product.description}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-lg font-semibold">{formatCurrency(product.price)}</p>
                      <p className="text-sm text-base-content/70">Qty: {product.quantity}</p>
                      <p className="text-sm font-medium text-primary">
                        Total: {formatCurrency(product.price * product.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="space-y-6">
          {/* Order Summary */}
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
                {/* Subtotal */}
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                
                {/* Shipping */}
                <div className="flex justify-between">
                  <span>Shipping ({order.delivery})</span>
                  <span>{formatCurrency(shippingCost)}</span>
                </div>
                
                <div className="divider"></div>
                
                {/* Total */}
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount:</span>
                  <span className="text-primary">{formatCurrency(order.total)}</span>
                </div>
              </div>

              <div className="divider"></div>

              {/* Status */}
              <div className="text-center">
                <p className="text-sm text-base-content/70 mb-2">Order Status</p>
                {getStatusBadge(order.status)}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-2">
                <button className="btn btn-primary w-full">
                  Update Status
                </button>
                <button className="btn btn-outline btn-secondary w-full">
                  Print Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;