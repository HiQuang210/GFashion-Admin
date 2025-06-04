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

export interface TopProductDataPoint {
  name: string;
  value: number;
  color: string;
  type: string;
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

export const topProductColors = [
  '#3b82f6', // Blue
  '#10b981', // Green
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#8b5cf6', // Purple
  '#06b6d4', // Cyan
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

export const transformProductsToPieChart = (products: any[]): TopProductDataPoint[] => {
  if (!products || products.length === 0) {
    return [];
  }

  // Group products by type and sum their sold quantities
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

  // Convert to array and sort by total sold descending
  const sortedTypes = Object.values(typeGroups)
    .sort((a: any, b: any) => b.totalSold - a.totalSold)
    .slice(0, 6); // Take top 6 types

  // Transform to pie chart format with colors
  return sortedTypes.map((typeGroup: any, index) => ({
    name: typeGroup.name, // This will be the product type name (e.g., "Sweater", "Shoes")
    value: typeGroup.totalSold, // Total sold for this type
    color: topProductColors[index % topProductColors.length],
    type: typeGroup.name // Keep type for reference
  }));
};

// Calculate total products sold
export const calculateTotalProductsSold = (products: any[]): number => {
  if (!products || products.length === 0) return 0;
  return products.reduce((total, product) => total + product.sold, 0);
};

// Get top product by sales
export const getTopSellingProduct = (products: any[]): string => {
  if (!products || products.length === 0) return 'No data';
  const topProduct = products.reduce((prev, current) => 
    (prev.sold > current.sold) ? prev : current
  );
  return `${topProduct.name} (${topProduct.sold} sold)`;
};

export const transformRevenueDataToChart = (revenueData: any[]): RevenueChartDataPoint[] => {
  const monthMapping: { [key: string]: number } = {
    'January': 1, 'February': 2, 'March': 3, 'April': 4,
    'May': 5, 'June': 6, 'July': 7, 'August': 8,
    'September': 9, 'October': 10, 'November': 11, 'December': 12
  };

  return revenueData.map(item => ({
    name: item.month.substring(0, 3),
    value: Math.round(item.revenue * 100) / 100,
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
export const mockPreviousRevenueTotal = 2.5;

export const formatVND = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const getCurrentMonth = (): string => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return months[new Date().getMonth()];
};

export const getCurrentYear = (): string => {
  return new Date().getFullYear().toString();
};