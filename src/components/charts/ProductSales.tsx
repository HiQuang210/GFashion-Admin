// components/ProductSalesChart.tsx
import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { HiOutlineChartBar, HiOutlineChartPie } from 'react-icons/hi2';

interface ProductSalesChartProps {
  productId: string;
}

interface SalesData {
  day: string;
  date: string;
  sold: number;
  revenue: number;
}

const SalesChart: React.FC<ProductSalesChartProps> = ({ productId }) => {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Generate mock sales data for the current week
    const generateWeeklySalesData = (): SalesData[] => {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const currentDate = new Date();
      const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1));
      
      return days.map((day, index) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + index);
        
        // Generate realistic sales data with some variation
        const baseSales = Math.floor(Math.random() * 20) + 5; // 5-25 units
        const variation = Math.floor(Math.random() * 10) - 5; // -5 to +5
        const sold = Math.max(0, baseSales + variation);
        const avgPrice = 50; // Assuming average price of $50
        
        return {
          day,
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          sold,
          revenue: sold * avgPrice,
        };
      });
    };

    // Simulate API call delay
    setTimeout(() => {
      setSalesData(generateWeeklySalesData());
      setIsLoading(false);
    }, 500);
  }, [productId]);

  const totalWeeklySales = salesData.reduce((sum, data) => sum + data.sold, 0);
  const totalWeeklyRevenue = salesData.reduce((sum, data) => sum + data.revenue, 0);
  const averageDailySales = totalWeeklySales / 7;

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-base-100 border border-base-300 rounded-lg p-3 shadow-lg">
          <p className="font-semibold">{`${label} (${data.date})`}</p>
          <p className="text-primary">{`Units Sold: ${data.sold}`}</p>
          <p className="text-secondary">{`Revenue: $${data.revenue}`}</p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-center justify-center h-64">
            <div className="loading loading-spinner loading-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="card-title flex items-center gap-2">
              <HiOutlineChartBar size={20} />
              Weekly Sales Analytics
            </h2>
            <p className="text-base-content/70 text-sm mt-1">
              Sales performance for the current week
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setChartType('line')}
              className={`btn btn-sm ${chartType === 'line' ? 'btn-primary' : 'btn-ghost'}`}
            >
              <HiOutlineChartPie size={16} />
              Line
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`btn btn-sm ${chartType === 'bar' ? 'btn-primary' : 'btn-ghost'}`}
            >
              <HiOutlineChartBar size={16} />
              Bar
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="stat bg-primary/10 rounded-lg p-4">
            <div className="stat-title text-sm">Total Weekly Sales</div>
            <div className="stat-value text-xl text-primary">{totalWeeklySales}</div>
            <div className="stat-desc">units sold</div>
          </div>
          <div className="stat bg-secondary/10 rounded-lg p-4">
            <div className="stat-title text-sm">Weekly Revenue</div>
            <div className="stat-value text-xl text-secondary">${totalWeeklyRevenue}</div>
            <div className="stat-desc">total earnings</div>
          </div>
          <div className="stat bg-accent/10 rounded-lg p-4">
            <div className="stat-title text-sm">Daily Average</div>
            <div className="stat-value text-xl text-accent">{averageDailySales.toFixed(1)}</div>
            <div className="stat-desc">units per day</div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="day" 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                />
                <Tooltip content={customTooltip} />
                <Line
                  type="monotone"
                  dataKey="sold"
                  stroke="hsl(var(--p))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--p))", strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, fill: "hsl(var(--p))" }}
                />
              </LineChart>
            ) : (
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="day" 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                />
                <Tooltip content={customTooltip} />
                <Bar
                  dataKey="sold"
                  fill="hsl(var(--p))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Performance Indicator */}
        <div className="mt-4 p-3 bg-base-200 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-base-content/70">Weekly Performance:</span>
            <div className="flex items-center gap-2">
              {totalWeeklySales > 100 ? (
                <>
                  <div className="badge badge-success">Excellent</div>
                  <span className="text-success">Above target</span>
                </>
              ) : totalWeeklySales > 70 ? (
                <>
                  <div className="badge badge-warning">Good</div>
                  <span className="text-warning">On track</span>
                </>
              ) : (
                <>
                  <div className="badge badge-error">Needs Improvement</div>
                  <span className="text-error">Below target</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Additional Insights */}
        <div className="mt-4 text-xs text-base-content/60">
          <p>
            Data refreshes weekly. Performance targets: 70+ units (Good), 100+ units (Excellent)
          </p>
        </div>
      </div>
    </div>
  );
};

export default SalesChart;