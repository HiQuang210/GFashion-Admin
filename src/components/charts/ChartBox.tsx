import React from 'react';
import { IconType } from 'react-icons';
import LoadingSkeleton from './LoadingSkeleton';
import LineChart from './LineChart';
import BarChart from './BarChart';
import PieChart from './PieChart';
import AreaChart from './AreaChart';
import {
  ChartDataPoint,
  PieChartDataPoint,
  AreaChartDataPoint,
} from '@type/Chart';

interface ChartBoxProps {
  chartType: 'line' | 'bar' | 'area' | 'pie';
  color?: string;
  IconBox?: IconType;
  title?: string;
  dataKey?: string;
  number?: number | string;
  percentage?: number;
  chartData?: ChartDataPoint[];
  chartPieData?: PieChartDataPoint[];
  chartAreaData?: AreaChartDataPoint[];
  isLoading?: boolean;
  isSuccess?: boolean;
}

const ChartBox: React.FC<ChartBoxProps> = ({
  chartType,
  color,
  IconBox,
  title,
  dataKey,
  number,
  percentage,
  chartData,
  chartPieData,
  chartAreaData,
  isLoading,
  isSuccess,
}) => {
  if (isLoading) {
    return <LoadingSkeleton type={chartType} title={title} />;
  }

  if (!isSuccess) {
    return null;
  }

  const chartProps = {
    title,
    isLoading,
    isSuccess,
  };

  switch (chartType) {
    case 'line':
      return (
        <LineChart
          {...chartProps}
          color={color}
          IconBox={IconBox}
          dataKey={dataKey}
          number={number}
          percentage={percentage}
          chartData={chartData}
        />
      );
    case 'bar':
      return (
        <BarChart
          {...chartProps}
          color={color}
          dataKey={dataKey}
          chartData={chartData}
        />
      );
    case 'pie':
      return (
        <PieChart
          {...chartProps}
          chartPieData={chartPieData}
        />
      );
    case 'area':
      return (
        <AreaChart
          {...chartProps}
          chartAreaData={chartAreaData}
        />
      );
    default:
      return null;
  }
};

export default ChartBox;