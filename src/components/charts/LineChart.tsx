import React from 'react';
import { IconType } from 'react-icons';
import { useNavigate } from 'react-router-dom';
import {
  LineChart as RechartsLineChart,
  Line,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { BaseChartProps, ChartDataPoint } from '@type/Chart';

interface LineChartProps extends BaseChartProps {
  color?: string;
  IconBox?: IconType;
  dataKey?: string;
  number?: number | string;
  percentage?: number;
  chartData?: ChartDataPoint[];
}

const LineChart: React.FC<LineChartProps> = ({
  color,
  IconBox,
  title,
  dataKey,
  number,
  percentage,
  chartData,
}) => {
  const navigate = useNavigate();

  // Function to determine the redirect path based on chart title
  const getRedirectPath = (chartTitle: string): string => {
    const titleLower = chartTitle.toLowerCase();
    
    if (titleLower.includes('user')) {
      return '/users';
    } else if (titleLower.includes('product')) {
      return '/products';
    } else if (titleLower.includes('order')) {
      return '/orders';
    } else if (titleLower.includes('revenue')) {
      return '/revenue'; // You might want to create this route
    }
    
    // Default fallback - you can customize this
    return '/dashboard';
  };

  const handleViewAllClick = () => {
    if (!title) {
      console.warn('Chart title is undefined, cannot navigate');
      return;
    }
    const redirectPath = getRedirectPath(title);
    navigate(redirectPath);
  };

  // Check if this is a revenue chart to conditionally show the View All button
  const isRevenueChart = title?.toLowerCase().includes('revenue') || false;

  return (
    <div className="w-full h-full flex justify-between items-end xl:gap-5">
      <div className="flex h-full flex-col justify-between items-start">
        <div className="flex items-center gap-2">
          {IconBox && (
            <IconBox className="m-0 p-0 text-[24px] xl:text-[30px] 2xl:text-[42px] 3xl:text-[48px] leading-none" />
          )}
          <span className="w-[88px] xl:w-[60px] 2xl:w-[82px] 3xl:w-[140px] m-0 p-0 text-[16px] xl:text-[15px] 2xl:text-[20px] 3xl:text-[24px] leading-[1.15] 2xl:leading-tight font-semibold">
            {title}
          </span>
        </div>
        <span className="font-bold text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl m-0 p-0">
          {number}
        </span>
        {!isRevenueChart && (
          <button
            onClick={handleViewAllClick}
            className="px-0 py-0 min-h-0 max-h-5 btn btn-link font-medium text-base-content no-underline m-0 hover:text-primary transition-colors"
          >
            View All
          </button>
        )}
      </div>
      <div className="flex h-full grow flex-col justify-between items-end">
        <div className="w-full h-full xl:h-[60%]">
          <ResponsiveContainer width="99%" height="100%">
            <RechartsLineChart width={300} height={100} data={chartData}>
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2}
                dot={false}
              />
              <Tooltip
                contentStyle={{
                  background: color,
                  border: 'none',
                  color: 'white',
                  borderRadius: '8px',
                  paddingTop: '0px',
                  paddingBottom: '0px',
                }}
                itemStyle={{ color: 'white' }}
                labelStyle={{ display: 'none' }}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex xl:flex-col 2xl:flex-row gap-2 xl:gap-2 items-end xl:items-end 2xl:items-center">
          <span
            className={`${
              percentage && percentage > 0 ? 'text-success' : 'text-error'
            } text-2xl xl:text-xl 2xl:text-3xl font-bold`}
          >
            {percentage || ''}%
          </span>
          <span className="font-medium xl:text-sm 2xl:text-base">
            this month
          </span>
        </div>
      </div>
    </div>
  );
};

export default LineChart;