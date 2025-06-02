import { AdminOrder } from '@type/Order';
import React from 'react';
import { HiUser } from 'react-icons/hi2';

interface CustomerInfoProps {
  order: AdminOrder;
}

const CustomerInfo: React.FC<CustomerInfoProps> = ({ order }) => {
  return (
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
  );
};

export default CustomerInfo;