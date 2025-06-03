export interface BaseChartProps {
  title?: string;
  isLoading?: boolean;
  isSuccess?: boolean;
}

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