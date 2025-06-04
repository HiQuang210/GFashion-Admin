export interface MonthlyRevenueData {
  month: string;
  revenue: number;
}

export interface MonthlyRevenueResponse {
  status: string;
  message: string;
  data: MonthlyRevenueData[];
  totalRevenue: number;
  totalRevenueInMillions: number;
  year: string;
  calculatedAt: string;
}

export interface RevenueStatsData {
  year: string;
  totalOrders: number;
  totalRevenue: number;
  totalRevenueInMillions: number;
  averageOrderValue: number;
  currentMonthRevenue: number;
  currentMonthOrders: number;
  calculatedAt: string;
}

export interface RevenueStatsResponse {
  status: string;
  message: string;
  data: RevenueStatsData;
}

export interface RevenueChartDataPoint {
  name: string;
  value: number;
  month: number;
}