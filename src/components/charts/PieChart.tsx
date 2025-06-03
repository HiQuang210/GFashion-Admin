import React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { BaseChartProps, PieChartDataPoint } from '@type/Chart';

interface PieChartProps extends BaseChartProps {
  chartPieData?: PieChartDataPoint[];
}

const PieChart: React.FC<PieChartProps> = ({ title, chartPieData }) => {
  return (
    <div className="w-full h-full p-0 m-0 flex flex-col items-start justify-between gap-3 xl:gap-4">
      <span className="text-2xl xl:text-2xl 2xl:text-4xl font-bold">
        {title || 'no title'}
      </span>
      <div className="w-full min-h-[300px] 2xl:min-h-[360px] 3xl:min-h-[420px]">
        {chartPieData ? (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Tooltip
                contentStyle={{
                  background: 'white',
                  borderRadius: '5px',
                }}
              />
              <Pie
                data={chartPieData}
                innerRadius={'70%'}
                outerRadius={'90%'}
                paddingAngle={3}
                dataKey="value"
              >
                {chartPieData?.map((item) => (
                  <Cell key={item.name} fill={item.color} />
                ))}
              </Pie>
            </RechartsPieChart>
          </ResponsiveContainer>
        ) : (
          'no data'
        )}
      </div>
      <div className="w-full flex flex-col 2xl:flex-row justify-between gap-2 items-start 2xl:items-center 2xl:flex-wrap">
        {chartPieData?.map((item) => (
          <div
            className="flex flex-row 2xl:flex-col gap-2 items-center"
            key={item.name}
          >
            <div className="flex flex-row gap-2 items-center">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span>{item.name}</span>
            </div>
            <span>({item.value})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieChart;