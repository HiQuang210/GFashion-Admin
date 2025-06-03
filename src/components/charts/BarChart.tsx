import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { BaseChartProps, ChartDataPoint } from '@type/Chart';

interface BarChartProps extends BaseChartProps {
  color?: string;
  dataKey?: string;
  chartData?: ChartDataPoint[];
}

const BarChart: React.FC<BarChartProps> = ({
  title,
  color,
  dataKey,
  chartData,
}) => {
  return (
    <div className="w-full h-full p-0 m-0 flex flex-col items-start 3xl:justify-between gap-3 xl:gap-4">
      <span className="text-2xl xl:text-2xl 2xl:text-4xl font-bold">
        {title || 'No title'}
      </span>
      <div className="w-full min-h-40 xl:min-h-[150px] 2xl:min-h-[180px] 3xl:min-h-[250px]">
        {chartData ? (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={chartData}>
              <Bar dataKey={dataKey || ''} fill={color || ''} />
              <XAxis dataKey="name" />
              <Tooltip
                contentStyle={{
                  background: color,
                  borderRadius: '5px',
                }}
                itemStyle={{ color: 'white' }}
                labelStyle={{ display: 'none' }}
                cursor={{ fill: 'none' }}
              />
            </RechartsBarChart>
          </ResponsiveContainer>
        ) : (
          <span>No data</span>
        )}
      </div>
    </div>
  );
};

export default BarChart;