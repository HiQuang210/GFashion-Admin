import { 
  HiCheckCircle,
  HiClock,
  HiTruck,
  HiXCircle,
  HiExclamationCircle
} from 'react-icons/hi2';

export const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return <HiCheckCircle className="w-4 h-4 text-success" />;
    case 'pending':
      return <HiClock className="w-4 h-4 text-warning" />;
    case 'processing':
      return <HiTruck className="w-4 h-4 text-info" />;
    case 'shipping':
      return <HiTruck className="w-4 h-4 text-primary" />;
    case 'cancelled':
      return <HiXCircle className="w-4 h-4 text-error" />;
    default:
      return <HiExclamationCircle className="w-4 h-4 text-neutral" />;
  }
};

export const getStatusBadge = (status: string) => {
  const statusConfig = {
    pending: 'badge-warning',
    completed: 'badge-success',
    processing: 'badge-info',
    shipping: 'badge-primary',
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