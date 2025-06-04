export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface PieChartDataPoint {
  name: string;
  value: number;
  color: string;
}

export interface AreaChartDataPoint {
  name: string;
  smartphones: number;
  consoles: number;
  laptops: number;
  others: number;
}

export interface RevenueChartDataPoint {
  name: string;
  value: number;
  month: number;
}

// Sample data for Users line chart
export const usersChartData: ChartDataPoint[] = [
  { name: 'Jan', value: 4 },
  { name: 'Feb', value: 5 },
  { name: 'Mar', value: 7 },
  { name: 'Apr', value: 6 },
  { name: 'May', value: 4 },
  { name: 'Jun', value: 8 },
];

// Sample data for Products line chart
export const productsChartData: ChartDataPoint[] = [
  { name: 'Jan', value: 5 },
  { name: 'Feb', value: 7 },
  { name: 'Mar', value: 4 },
  { name: 'Apr', value: 6 },
  { name: 'May', value: 9 },
  { name: 'Jun', value: 12 },
];

// Sample data for Orders line chart
export const ordersChartData: ChartDataPoint[] = [
  { name: 'Jan', value: 4 },
  { name: 'Feb', value: 3 },
  { name: 'Mar', value: 2 },
  { name: 'Apr', value: 6 },
  { name: 'May', value: 8 },
  { name: 'Jun', value: 10 },
];

// Sample data for Revenue line chart (fallback)
export const revenueChartData: ChartDataPoint[] = [
  { name: 'Jan', value: 4200 },
  { name: 'Feb', value: 5100 },
  { name: 'Mar', value: 3800 },
  { name: 'Apr', value: 6300 },
  { name: 'May', value: 5900 },
  { name: 'Jun', value: 7200 },
];

// Sample data for Leads by Source pie chart
export const leadsSourceData: PieChartDataPoint[] = [
  { name: 'Google Ads', value: 35, color: '#3b82f6' },
  { name: 'Facebook', value: 28, color: '#10b981' },
  { name: 'Instagram', value: 20, color: '#f59e0b' },
  { name: 'Direct', value: 12, color: '#ef4444' },
  { name: 'Others', value: 5, color: '#8b5cf6' },
];

// Sample data for Revenue by Products area chart
export const revenueByProductsData: AreaChartDataPoint[] = [
  { name: 'Jan', smartphones: 1200, consoles: 800, laptops: 600, others: 400 },
  { name: 'Feb', smartphones: 1400, consoles: 900, laptops: 700, others: 500 },
  { name: 'Mar', smartphones: 1100, consoles: 700, laptops: 550, others: 350 },
  { name: 'Apr', smartphones: 1600, consoles: 1100, laptops: 800, others: 600 },
  { name: 'May', smartphones: 1500, consoles: 1000, laptops: 750, others: 550 },
  { name: 'Jun', smartphones: 1800, consoles: 1200, laptops: 900, others: 700 },
];

// Helper functions to calculate percentages
export const calculatePercentageChange = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
};

// Mock previous period data for percentage calculations
export const mockPreviousData = {
  users: 4, // Previous month users
  products: 3, // Previous month products
  orders: 5, // Previous month orders
  revenue: 6800, // Previous month revenue
  profit: 190, // Previous quarter profit
};

// Color palette for consistent theming
export const chartColors = {
  users: '#3b82f6',      // Blue
  products: '#10b981',   // Green
  revenue: '#f59e0b',    // Amber
  profit: '#ef4444',     // Red
  secondary: '#8b5cf6',  // Purple
  tertiary: '#06b6d4',   // Cyan
};

// ===== REVENUE INTEGRATION FUNCTIONS =====

// Transform monthly revenue data to chart format
export const transformRevenueDataToChart = (revenueData: any[]): RevenueChartDataPoint[] => {
  const monthMapping: { [key: string]: number } = {
    'January': 1, 'February': 2, 'March': 3, 'April': 4,
    'May': 5, 'June': 6, 'July': 7, 'August': 8,
    'September': 9, 'October': 10, 'November': 11, 'December': 12
  };

  return revenueData.map(item => ({
    name: item.month.substring(0, 3), // "Jan", "Feb", etc.
    value: Math.round(item.revenue * 100) / 100, // Round to 2 decimal places
    month: monthMapping[item.month] || 0
  })).sort((a, b) => a.month - b.month);
};

// Calculate revenue percentage change
export const calculateRevenuePercentageChange = (currentData: any[], previousYearTotal?: number): number => {
  const currentTotal = currentData.reduce((sum, item) => sum + item.revenue, 0);
  
  if (!previousYearTotal || previousYearTotal === 0) {
    return currentTotal > 0 ? 100 : 0; // If no previous data, show 100% growth if current > 0
  }
  
  return Math.round(((currentTotal - previousYearTotal) / previousYearTotal) * 100);
};

// Format revenue for display
export const formatRevenue = (amount: number): string => {
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}B VND`; // Billions
  } else if (amount >= 1) {
    return `${amount.toFixed(1)}M VND`; // Millions
  } else {
    return `${(amount * 1000).toFixed(0)}K VND`; // Thousands
  }
};

// Mock previous year data for percentage calculation (2.5 billion VND in millions)
export const mockPreviousRevenueTotal = 2500;

// Format currency for Vietnamese Dong
export const formatVND = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Get current month name
export const getCurrentMonth = (): string => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return months[new Date().getMonth()];
};

// Get current year
export const getCurrentYear = (): string => {
  return new Date().getFullYear().toString();
};