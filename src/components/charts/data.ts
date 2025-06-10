import { ChartDataPoint, OrdersChartDataPoint, ProductsChartDataPoint, TopProductDataPoint, UsersChartDataPoint } from "@type/Chart";
import { RevenueChartDataPoint } from "@type/Revenue";

export const chartColors = {
  users: '#3b82f6',      // Blue
  products: '#10b981',   // Green
  revenue: '#f59e0b',    // Amber
  profit: '#ef4444',     // Red
  secondary: '#8b5cf6',  // Purple
  tertiary: '#06b6d4',   // Cyan
};

export const topProductColors = [
  '#3b82f6', // Blue
  '#10b981', // Green
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#8b5cf6', // Purple
  '#06b6d4', // Cyan
];

const MONTH_MAPPING: { [key: string]: number } = {
  'January': 1, 'February': 2, 'March': 3, 'April': 4,
  'May': 5, 'June': 6, 'July': 7, 'August': 8,
  'September': 9, 'October': 10, 'November': 11, 'December': 12
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const usersChartData: ChartDataPoint[] = [
  { name: 'Jan', value: 4 },
  { name: 'Feb', value: 5 },
  { name: 'Mar', value: 7 },
  { name: 'Apr', value: 6 },
  { name: 'May', value: 4 },
  { name: 'Jun', value: 8 },
];

export const productsChartData: ChartDataPoint[] = [
  { name: 'Jan', value: 5 },
  { name: 'Feb', value: 7 },
  { name: 'Mar', value: 4 },
  { name: 'Apr', value: 6 },
  { name: 'May', value: 9 },
  { name: 'Jun', value: 12 },
];

export const ordersChartData: ChartDataPoint[] = [
  { name: 'Jan', value: 4 },
  { name: 'Feb', value: 3 },
  { name: 'Mar', value: 2 },
  { name: 'Apr', value: 6 },
  { name: 'May', value: 8 },
  { name: 'Jun', value: 10 },
];

export const mockPreviousData = {
  users: 6,
  products: 8,
  orders: 5,
  revenue: 5
};

export const calculatePercentageChange = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};

export const getCurrentMonth = (): string => {
  return MONTH_NAMES[new Date().getMonth()];
};

export const getCurrentYear = (): string => {
  return new Date().getFullYear().toString();
};

export const formatRevenue = (amount: number): string => {
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}B VND`;
  } else if (amount >= 1) {
    return `${amount.toFixed(1)}M VND`;
  } else {
    return `${(amount * 1000).toFixed(0)}K VND`;
  }
};

export const formatVND = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// GENERIC DATA TRANSFORMATION FUNCTIONS
interface MonthlyDataItem {
  month: string;
  [key: string]: any;
}

interface ChartDataPointWithMonth extends ChartDataPoint {
  month: number;
}

const transformMonthlyDataToChart = (
  data: MonthlyDataItem[],
  valueKey: string
): ChartDataPointWithMonth[] => {
  return data.map(item => ({
    name: item.month.substring(0, 3),
    value: item[valueKey] || 0,
    month: MONTH_MAPPING[item.month] || 0
  })).sort((a, b) => a.month - b.month);
};

const calculateTotalFromData = (data: MonthlyDataItem[], valueKey: string): number => {
  return data.reduce((sum, item) => sum + (item[valueKey] || 0), 0);
};

const getCurrentMonthValue = (data: MonthlyDataItem[], valueKey: string): number => {
  const currentMonth = getCurrentMonth();
  const currentMonthData = data.find(item => item.month === currentMonth);
  return currentMonthData ? currentMonthData[valueKey] : 0;
};

const calculatePercentageChangeFromData = (
  currentData: MonthlyDataItem[], 
  valueKey: string, 
  previousYearTotal?: number
): number => {
  const currentTotal = calculateTotalFromData(currentData, valueKey);
  return calculatePercentageChange(currentTotal, previousYearTotal || 0);
};

// USERS DATA 
export const transformUsersDataToChart = (usersData: any[]): UsersChartDataPoint[] => {
  return transformMonthlyDataToChart(usersData, 'userCount') as UsersChartDataPoint[];
};

export const calculateUsersPercentageChange = (
  currentData: any[], 
  previousYearTotal?: number
): number => {
  return calculatePercentageChangeFromData(currentData, 'userCount', previousYearTotal);
};

// PRODUCTS DATA
export const transformProductsDataToChart = (productsData: any[]): ProductsChartDataPoint[] => {
  return transformMonthlyDataToChart(productsData, 'productCount') as ProductsChartDataPoint[];
};

export const calculateProductsPercentageChange = (
  currentData: any[], 
  previousYearTotal?: number
): number => {
  return calculatePercentageChangeFromData(currentData, 'productCount', previousYearTotal);
};

export const getCurrentMonthProductsCount = (productsData: any[]): number => {
  return getCurrentMonthValue(productsData, 'productCount');
};

export const transformProductsToPieChart = (products: any[]): TopProductDataPoint[] => {
  if (!products || products.length === 0) {
    return [];
  }

  const typeGroups = products.reduce((acc, product) => {
    const type = product.type || 'Unknown';
    if (!acc[type]) {
      acc[type] = {
        name: type,
        totalSold: 0,
        products: []
      };
    }
    acc[type].totalSold += product.sold || 0;
    acc[type].products.push(product);
    return acc;
  }, {});

  const sortedTypes = Object.values(typeGroups)
    .sort((a: any, b: any) => b.totalSold - a.totalSold)
    .slice(0, 6);

  return sortedTypes.map((typeGroup: any, index) => ({
    name: typeGroup.name,
    value: typeGroup.totalSold,
    color: topProductColors[index % topProductColors.length],
    type: typeGroup.name
  }));
};

export const calculateTotalProductsSold = (products: any[]): number => {
  if (!products || products.length === 0) return 0;
  return products.reduce((total, product) => total + product.sold, 0);
};

export const getTopSellingProduct = (products: any[]): string => {
  if (!products || products.length === 0) return 'No data';
  const topProduct = products.reduce((prev, current) => 
    (prev.sold > current.sold) ? prev : current
  );
  return `${topProduct.name} (${topProduct.sold} sold)`;
};

// ORDERS DATA
export const transformOrdersDataToChart = (ordersData: any[]): OrdersChartDataPoint[] => {
  return transformMonthlyDataToChart(ordersData, 'orderCount') as OrdersChartDataPoint[];
};

export const calculateOrdersPercentageChange = (
  currentData: any[], 
  previousYearTotal?: number
): number => {
  return calculatePercentageChangeFromData(currentData, 'orderCount', previousYearTotal);
};

export const getCurrentMonthOrdersCount = (ordersData: any[]): number => {
  return getCurrentMonthValue(ordersData, 'orderCount');
};

// REVENUE DATA
export const transformRevenueDataToChart = (revenueData: any[]): RevenueChartDataPoint[] => {
  return revenueData.map(item => ({
    name: item.month.substring(0, 3),
    value: Math.round(item.revenue * 100) / 100,
    month: MONTH_MAPPING[item.month] || 0
  })).sort((a, b) => a.month - b.month);
};

export const calculateRevenuePercentageChange = (
  currentData: any[], 
  previousYearTotal?: number
): number => {
  const currentTotal = currentData.reduce((sum, item) => sum + item.revenue, 0);
  return calculatePercentageChange(currentTotal, previousYearTotal || 0);
};