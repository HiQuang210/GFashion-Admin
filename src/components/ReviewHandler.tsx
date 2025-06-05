import { MdStar, MdStarBorder } from 'react-icons/md';
import React from 'react';

export const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md', showRating: boolean = true) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <div key={star}>
          {star <= rating ? (
            <MdStar className={`${sizeClasses[size]} text-yellow-400`} />
          ) : (
            <MdStarBorder className={`${sizeClasses[size]} text-gray-300 dark:text-gray-600`} />
          )}
        </div>
      ))}
      {showRating && (
        <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
          ({rating})
        </span>
      )}
    </div>
  );
};

export const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

export const formatDetailedDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

export const UserAvatar = ({ userImg }: { userImg?: string | null }) => {
  const [imgError, setImgError] = React.useState(false);

  return (
    <img
      src={!imgError && userImg ? userImg : '/Portrait_Placeholder.png'}
      alt="User avatar"
      className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
      onError={() => setImgError(true)}
    />
  );
};

export const generatePagination = (
  current: number,
  totalPages: number,
  onPageChange: (page: number) => void
) => {
  const pages: React.ReactNode[] = [];

  pages.push(
    <button
      key="prev"
      onClick={() => onPageChange(current - 1)}
      disabled={current === 1}
      className="px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
    >
      Previous
    </button>
  );

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= current - 1 && i <= current + 1)) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-2 rounded-lg ${
            current === i
              ? 'bg-blue-500 text-white'
              : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          {i}
        </button>
      );
    } else if (i === current - 2 || i === current + 2) {
      pages.push(<span key={`dots-${i}`} className="px-2 text-gray-500">...</span>);
    }
  }

  pages.push(
    <button
      key="next"
      onClick={() => onPageChange(current + 1)}
      disabled={current === totalPages}
      className="px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
    >
      Next
    </button>
  );

  return pages;
};