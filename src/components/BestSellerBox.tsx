import React from 'react';
import { MdTrendingUp, MdShoppingBag, MdStar } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

interface BestSellerBoxProps {
  topProductsData?: {
    pieData: any[];
  };
  productsData?: Product[];
  isLoading: boolean;
  isSuccess: boolean;
}

const BestSellerBox: React.FC<BestSellerBoxProps> = ({ isLoading, isSuccess, productsData }) => {
  const navigate = useNavigate();
  // Find the product with the highest sold count
  const getBestSellerProduct = (): Product | null => {
    if (!productsData || productsData.length === 0) {
      return null;
    }
    
    // Find the product with the highest sold count
    const bestSeller = productsData.reduce((prev: Product, current: Product) => {
      return (prev.sold > current.sold) ? prev : current;
    });
    
    return bestSeller;
  };

  const bestSeller = getBestSellerProduct();

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full h-full bg-base-200 rounded-lg p-4 flex items-center justify-center">
        <div className="loading loading-spinner loading-md text-primary"></div>
      </div>
    );
  }

  // No data state
  if (!isSuccess || !bestSeller) {
    return (
      <div className="w-full h-full bg-base-200 rounded-lg p-4 flex flex-row items-center justify-center">
        <MdShoppingBag className="text-3xl text-base-content/50 mr-2" />
        <p className="text-sm text-base-content/70">No product data available</p>
      </div>
    );
  }

  // Format the sold count
  const formatSoldCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  // Generate star rating display
  const renderStarRating = (rating: number): JSX.Element[] => {
    const stars: JSX.Element[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <MdStar key={`full-${i}`} className="text-warning text-sm" />
      );
    }
    
    // Half star
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <MdStar className="text-base-content/30 text-sm" />
          <div className="absolute top-0 left-0 overflow-hidden" style={{ width: '50%' }}>
            <MdStar className="text-warning text-sm" />
          </div>
        </div>
      );
    }
    
    // Empty stars
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <MdStar key={`empty-${i}`} className="text-base-content/30 text-sm" />
      );
    }
    
    return stars;
  };

  // Format price in VND
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="w-full h-full bg-base-100 rounded-lg p-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base-content text-base font-semibold">Best Seller</h3>
        <div className="flex items-center text-success">
          <MdTrendingUp className="text-lg mr-1" />
          <span className="text-xs font-medium">Top Product</span>
        </div>
      </div>

      {/* Main Content - Landscape Layout */}
      <div className="flex flex-row items-center gap-4">
        {/* Product Image - Larger */}
        <div className="w-24 h-24 rounded-lg overflow-hidden bg-base-200 flex-shrink-0">
          {bestSeller.images && bestSeller.images.length > 0 ? (
            <img 
              src={bestSeller.images[0]} 
              alt={bestSeller.name}
              className="w-full h-full object-cover"
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const nextSibling = target.nextSibling as HTMLElement;
                if (nextSibling) {
                  nextSibling.style.display = 'flex';
                }
              }}
            />
          ) : null}
          <div className="w-full h-full flex items-center justify-center" style={{ display: bestSeller.images && bestSeller.images.length > 0 ? 'none' : 'flex' }}>
            <MdShoppingBag className="text-2xl text-base-content/50" />
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          {/* Product Name */}
          <h4 className="text-base-content text-lg font-bold mb-2 line-clamp-2 leading-tight">
            {bestSeller.name}
          </h4>

          {/* Price and Sales in same row */}
          <div className="flex items-center justify-between mb-2">
            <div className="text-success text-sm font-semibold">
              {formatPrice(bestSeller.price)}
            </div>
            <div className="text-right">
              <div className="text-primary text-lg font-bold">
                {formatSoldCount(bestSeller.sold)}
              </div>
              <div className="text-xs text-base-content/70">Units Sold</div>
            </div>
          </div>

          {/* Rating and Category */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center mr-2">
                {renderStarRating(bestSeller.rating)}
              </div>
              <span className="text-base-content text-sm font-medium">{bestSeller.rating}</span>
              <span className="text-base-content/70 text-xs ml-1">/5.0</span>
            </div>
            
            <div className="badge badge-primary badge-sm">
              {bestSeller.type}
            </div>
          </div>
        </div>
      </div>

      {/* View Details Button */}
      <button 
        className="btn btn-primary btn-sm w-full mt-auto"
        onClick={() => navigate(`/product/${bestSeller._id}`)}
        >
        View Details
      </button>
    </div>
  );
};

export default BestSellerBox;