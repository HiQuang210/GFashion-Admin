import React from 'react';
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { BaseChartProps, AreaChartDataPoint } from '@type/Chart';

interface AreaChartProps extends BaseChartProps {
  chartAreaData?: AreaChartDataPoint[];
}

const AreaChart: React.FC<AreaChartProps> = ({ title, chartAreaData }) => {
  return (
    <div className="w-full h-full p-0 m-0 flex flex-col items-start gap-4 xl:gap-7 justify-between">
      <span className="text-2xl xl:text-2xl 2xl:text-4xl font-bold">
        {title || 'no title'}
      </span>
      <div className="w-full min-h-[300px] 2xl:min-h-[360px] 3xl:min-h-[420px]">
        {chartAreaData ? (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsAreaChart data={chartAreaData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="smartphones"
                stackId="1"
                stroke="#8884d8"
                fill="#8884d8"
              />
              <Area
                type="monotone"
                dataKey="consoles"
                stackId="1"
                stroke="#82ca9d"
                fill="#82ca9d"
              />
              <Area
                type="monotone"
                dataKey="laptops"
                stackId="1"
                stroke="#ffc658"
                fill="#ffc658"
              />
              <Area
                type="monotone"
                dataKey="others"
                stackId="1"
                stroke="#969595"
                fill="#969595"
              />
            </RechartsAreaChart>
          </ResponsiveContainer>
        ) : (
          'no data'
        )}
      </div>
    </div>
  );
};

export default AreaChart;