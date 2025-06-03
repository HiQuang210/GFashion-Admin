import React from 'react';

interface LoadingSkeletonProps {
  type: 'line' | 'bar' | 'pie' | 'area';
  title?: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ type, title }) => {
  if (type === 'line') {
    return (
      <div className="w-full h-full flex justify-between items-end xl:gap-5">
        <div className="flex h-full flex-col justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="skeleton w-8 h-8"></div>
            <span className="w-[88px] xl:w-[60px] 2xl:w-[82px] m-0 p-0 text-[16px] xl:text-[15px] 2xl:text-[20px] leading-[1.15] 2xl:leading-tight font-semibold">
              {title}
            </span>
          </div>
          <div className="skeleton w-16 h-6"></div>
          <div className="skeleton w-12 h-4"></div>
        </div>
        <div className="flex h-full grow flex-col justify-between items-end">
          <div className="skeleton w-20 h-10"></div>
          <div className="skeleton w-16 h-6"></div>
        </div>
      </div>
    );
  }

  if (type === 'bar') {
    return (
      <div className="w-full h-full p-0 m-0 flex flex-col items-start gap-3 xl:gap-4">
        <span className="text-2xl xl:text-2xl 2xl:text-4xl font-bold">
          {title || 'No title'}
        </span>
        <div className="w-full min-h-40 xl:min-h-[150px] skeleton"></div>
      </div>
    );
  }

  if (type === 'pie') {
    return (
      <div className="w-full h-full p-0 m-0 flex flex-col items-start justify-between gap-3 xl:gap-4">
        <span className="text-2xl xl:text-2xl 2xl:text-4xl font-bold">
          {title || 'no title'}
        </span>
        <div className="w-full min-h-[300px] skeleton"></div>
        <div className="w-full flex flex-col 2xl:flex-row justify-between gap-2 items-start 2xl:items-center 2xl:flex-wrap">
          <div className="skeleton w-full h-5"></div>
          <div className="skeleton w-full h-5"></div>
          <div className="skeleton w-full h-5"></div>
          <div className="skeleton w-full h-5"></div>
        </div>
      </div>
    );
  }

  if (type === 'area') {
    return (
      <div className="w-full h-full p-0 m-0 flex flex-col items-start gap-4 xl:gap-7 justify-between">
        <span className="text-2xl xl:text-2xl 2xl:text-4xl font-bold">
          {title || 'no title'}
        </span>
        <div className="w-full min-h-[300px] skeleton"></div>
      </div>
    );
  }

  return null;
};

export default LoadingSkeleton;