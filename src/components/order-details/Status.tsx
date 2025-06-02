import { 
  HiCheckCircle,
  HiClock,
  HiCube,
  HiTruck,
  HiXCircle,
  HiExclamationCircle
} from 'react-icons/hi2';

export const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return <HiCheckCircle className="w-4 h-4 text-black-content" />;
    case 'pending':
      return <HiClock className="w-4 h-4 text-black-content" />;
    case 'processing':
      return <HiCube className="w-4 h-4 text-black-content" />;
    case 'shipping':
      return <HiTruck className="w-4 h-4 text-black-content" />;
    case 'cancelled':
      return <HiXCircle className="w-4 h-4 text-black-content" />;
    default:
      return <HiExclamationCircle className="w-4 h-4 text-black-content" />;
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