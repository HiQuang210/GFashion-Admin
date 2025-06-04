import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { MdFileDownload, MdTrendingUp, MdCalendarToday, MdCurrencyExchange } from 'react-icons/md';
import { FaCoins } from 'react-icons/fa';
import {
  fetchTotalRevenueStats,
  fetchMonthlyRevenue,
  exportRevenueReport
} from '@api/ApiCollection';
import {
  transformRevenueDataToChart,
  calculateRevenuePercentageChange,
  formatRevenue,
  mockPreviousRevenueTotal
} from '@components/charts/data';

const Revenue: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [isExporting, setIsExporting] = useState(false);

  const queryGetTotalRevenueStats = useQuery({
    queryKey: ['revenue-stats', selectedYear],
    queryFn: () => fetchTotalRevenueStats(selectedYear),
  });

  const queryGetMonthlyRevenue = useQuery({
    queryKey: ['monthly-revenue', selectedYear],
    queryFn: () => fetchMonthlyRevenue(selectedYear),
  });

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await exportRevenueReport(selectedYear);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(event.target.value);
  };

  const transformRevenueData = () => {
    if (!queryGetTotalRevenueStats.data?.data || !queryGetMonthlyRevenue.data?.data) {
      return {
        totalRevenue: "0M VND",
        percentage: 0,
        chartData: []
      };
    }

    const revenueStats = queryGetTotalRevenueStats.data.data;
    const monthlyData = queryGetMonthlyRevenue.data.data;

    const chartData = transformRevenueDataToChart(monthlyData);

    const percentage = calculateRevenuePercentageChange(monthlyData, mockPreviousRevenueTotal);

    const formattedRevenue = formatRevenue(revenueStats.totalRevenueInMillions);

    return {
      totalRevenue: formattedRevenue,
      percentage: percentage,
      chartData: chartData
    };
  };

  const revenueData = transformRevenueData();
  const isLoading = queryGetTotalRevenueStats.isLoading || queryGetMonthlyRevenue.isLoading;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      return (
        <div className="bg-base-100 border border-base-300 rounded-lg px-4 py-3 shadow-lg">
          <p className="font-semibold text-base-content">{`Month: ${label}`}</p>
          <p className="text-primary font-bold">{`Revenue: ${value.toFixed(1)}M VND`}</p>
        </div>
      );
    }
    return null;
  };

  // Generate year options (current year and 4 years back)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-base-content">Revenue Analytics</h1>
          <p className="text-base-content/70 mt-1">Detailed revenue analysis and trends</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Year Selector */}
          <div className="flex items-center gap-2">
            <MdCalendarToday className="text-base-content/70" />
            <select
              value={selectedYear}
              onChange={handleYearChange}
              className="select select-bordered select-sm w-24"
              disabled={isLoading}
            >
              {yearOptions.map((year) => (
                <option key={year} value={year.toString()}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          
          {/* Export Button */}
          <button
            onClick={handleExport}
            disabled={isExporting || isLoading}
            className="btn btn-primary btn-sm gap-2"
          >
            <MdFileDownload />
            {isExporting ? 'Exporting...' : 'Export Report'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Revenue Card */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-base-content/70">Total Revenue</h3>
                <p className="text-2xl font-bold text-base-content">
                  {isLoading ? (
                    <span className="loading loading-dots loading-sm"></span>
                  ) : (
                    revenueData.totalRevenue
                  )}
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <FaCoins className="text-2xl text-primary" />
              </div>
            </div>
          </div>
        </div>

        {/* Growth Rate Card */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-base-content/70">Growth Rate</h3>
                <p className={`text-2xl font-bold ${
                  revenueData.percentage > 0 ? 'text-success' : 'text-error'
                }`}>
                  {isLoading ? (
                    <span className="loading loading-dots loading-sm"></span>
                  ) : (
                    `${revenueData.percentage > 0 ? '+' : ''}${revenueData.percentage}%`
                  )}
                </p>
              </div>
              <div className={`p-3 rounded-full ${
                revenueData.percentage > 0 ? 'bg-success/10' : 'bg-error/10'
              }`}>
                <MdTrendingUp className={`text-2xl ${
                  revenueData.percentage > 0 ? 'text-success' : 'text-error'
                }`} />
              </div>
            </div>
          </div>
        </div>

        {/* Average Monthly Revenue Card */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-base-content/70">Avg Monthly</h3>
                <p className="text-2xl font-bold text-base-content">
                  {isLoading ? (
                    <span className="loading loading-dots loading-sm"></span>
                  ) : (
                    revenueData.chartData.length > 0 
                      ? `${(revenueData.chartData.reduce((sum, item) => sum + item.value, 0) / revenueData.chartData.length).toFixed(1)}M VND`
                      : '0M VND'
                  )}
                </p>
              </div>
              <div className="p-3 bg-info/10 rounded-full">
                <MdCurrencyExchange className="text-2xl text-info" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Monthly Revenue Trend ({selectedYear})</h2>
            <div className="text-sm text-base-content/70">
              All values in Vietnamese Dong (VND)
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-96">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart
                  data={revenueData.chartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#666"
                    fontSize={12}
                    tick={{ fill: '#666' }}
                  />
                  <YAxis 
                    stroke="#666"
                    fontSize={12}
                    tick={{ fill: '#666' }}
                    tickFormatter={(value) => `${value}M`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7, fill: '#3b82f6' }}
                    name="Revenue (Millions VND)"
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Additional Info */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h3 className="text-lg font-semibold mb-4">Revenue Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-base-content/80 mb-2">Highest Month</h4>
              <p className="text-base-content">
                {isLoading ? (
                  <span className="loading loading-dots loading-sm"></span>
                ) : (
                  revenueData.chartData.length > 0 
                    ? (() => {
                        const maxMonth = revenueData.chartData.reduce((prev, current) => 
                          prev.value > current.value ? prev : current
                        );
                        return `${maxMonth.name}: ${maxMonth.value.toFixed(1)}M VND`;
                      })()
                    : 'No data available'
                )}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-base-content/80 mb-2">Lowest Month</h4>
              <p className="text-base-content">
                {isLoading ? (
                  <span className="loading loading-dots loading-sm"></span>
                ) : (
                  revenueData.chartData.length > 0 
                    ? (() => {
                        const minMonth = revenueData.chartData.reduce((prev, current) => 
                          prev.value < current.value ? prev : current
                        );
                        return `${minMonth.name}: ${minMonth.value.toFixed(1)}M VND`;
                      })()
                    : 'No data available'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Revenue;