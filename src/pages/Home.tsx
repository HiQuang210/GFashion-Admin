import TopSpendingBox from '@components/dashboard/TopSpendingBox';
import ChartBox from '@components/charts/ChartBox';
import BestSellerBox from '@components/BestSellerBox'; 
import { useQuery } from '@tanstack/react-query';
import {
  MdGroup,
  MdInventory2,
  MdSwapHorizontalCircle,
  MdShoppingCart,
} from 'react-icons/md';
import {
  fetchMonthlyUsers,
  fetchUserStats,
  fetchMonthlyProducts,
  fetchProductStats,
  fetchTotalRevenueStats,
  fetchMonthlyRevenue,
  fetchMonthlyOrders,
  fetchOrderStats,
  fetchTopSellingProducts
} from '@api/ApiCollection';
import {
  usersChartData,
  productsChartData,
  ordersChartData,
  mockPreviousData,
  chartColors,
  transformRevenueDataToChart,
  calculateRevenuePercentageChange,
  formatRevenue,
  transformProductsToPieChart,
  transformUsersDataToChart,
  calculateUsersPercentageChange,
  transformProductsDataToChart,
  calculateProductsPercentageChange,
  transformOrdersDataToChart,
  calculateOrdersPercentageChange
} from '@components/charts/data';

const Home = () => {
  const currentYear = new Date().getFullYear().toString();

  const queryGetMonthlyUsers = useQuery({
    queryKey: ['monthly-users', currentYear],
    queryFn: () => fetchMonthlyUsers(currentYear),
  });

  const queryGetUserStats = useQuery({
    queryKey: ['user-stats', currentYear],
    queryFn: () => fetchUserStats(currentYear),
  });

  const queryGetMonthlyProducts = useQuery({
    queryKey: ['monthly-products', currentYear],
    queryFn: () => fetchMonthlyProducts(currentYear),
  });

  const queryGetProductStats = useQuery({
    queryKey: ['product-stats', currentYear],
    queryFn: () => fetchProductStats(currentYear),
  });

  const queryGetMonthlyOrders = useQuery({
    queryKey: ['monthly-orders', currentYear],
    queryFn: () => fetchMonthlyOrders(currentYear),
  });

  const queryGetOrderStats = useQuery({
    queryKey: ['order-stats', currentYear],
    queryFn: () => fetchOrderStats(currentYear),
  });

  const queryGetTotalRevenueStats = useQuery({
    queryKey: ['revenue-stats', currentYear],
    queryFn: () => fetchTotalRevenueStats(currentYear),
  });

  const queryGetMonthlyRevenue = useQuery({
    queryKey: ['monthly-revenue', currentYear],
    queryFn: () => fetchMonthlyRevenue(currentYear),
  });

  const queryGetTopProducts = useQuery({
    queryKey: ['top-products'],
    queryFn: fetchTopSellingProducts,
  });

  // Transform users data using real API data
  const transformUsersData = () => {
    if (!queryGetMonthlyUsers.data?.data || !queryGetUserStats.data?.data) {
      return {
        number: 0,
        percentage: 0,
        chartData: usersChartData
      };
    }

    const monthlyData = queryGetMonthlyUsers.data.data;
    const statsData = queryGetUserStats.data.data;
    
    // Transform monthly data to chart format
    const chartData = transformUsersDataToChart(monthlyData);
    
    // Calculate percentage change using real data
    const percentage = calculateUsersPercentageChange(monthlyData, mockPreviousData.users);
    
    // Use total users from stats
    const totalUsers = statsData.totalUsers;

    return {
      number: totalUsers,
      percentage: percentage,
      chartData: chartData
    };
  };

  // Transform products data using real API data
  const transformProductsData = () => {
    if (!queryGetMonthlyProducts.data?.data || !queryGetProductStats.data?.data) {
      return {
        number: 0,
        percentage: 0,
        chartData: productsChartData,
        dataKey: 'value'
      };
    }

    const monthlyData = queryGetMonthlyProducts.data.data;
    const statsData = queryGetProductStats.data.data;
    
    // Transform monthly data to chart format
    const chartData = transformProductsDataToChart(monthlyData);
    
    // Calculate percentage change using real data
    const percentage = calculateProductsPercentageChange(monthlyData, mockPreviousData.products);
    
    // Use total products from stats
    const totalProducts = statsData.totalProducts;

    return {
      number: totalProducts,
      percentage: percentage,
      chartData: chartData,
      dataKey: 'value'
    };
  };

  // Transform orders data using real API data
  const transformOrdersData = () => {
    if (!queryGetMonthlyOrders.data?.data || !queryGetOrderStats.data?.data) {
      return {
        number: 0,
        percentage: 0,
        chartData: ordersChartData
      };
    }

    const monthlyData = queryGetMonthlyOrders.data.data;
    const statsData = queryGetOrderStats.data.data;
    
    // Transform monthly data to chart format
    const chartData = transformOrdersDataToChart(monthlyData);
    
    // Calculate percentage change using real data
    const percentage = calculateOrdersPercentageChange(monthlyData, mockPreviousData.orders);
    
    // Use total orders from stats
    const totalOrders = statsData.totalOrders;

    return {
      number: totalOrders,
      percentage: percentage,
      chartData: chartData
    };
  };

  // Transform revenue data using real API data
  const transformRevenueData = () => {
    if (!queryGetTotalRevenueStats.data?.data || !queryGetMonthlyRevenue.data?.data) {
      return {
        number: "0M VND",
        percentage: 0
      };
    }

    const revenueStats = queryGetTotalRevenueStats.data.data;
    const monthlyData = queryGetMonthlyRevenue.data.data;

    // Transform monthly data to chart format
    const chartData = transformRevenueDataToChart(monthlyData);

    // Calculate percentage change
    const percentage = calculateRevenuePercentageChange(monthlyData, mockPreviousData.revenue);

    // Format total revenue for display
    const formattedRevenue = formatRevenue(revenueStats.totalRevenueInMillions);

    return {
      number: formattedRevenue,
      percentage: percentage,
      chartData: chartData
    };
  };

  const transformTopProductsData = () => {
    if (!queryGetTopProducts.data?.data?.products) {
      return { pieData: [] };
    }
    
    const products = queryGetTopProducts.data.data.products;
    const pieData = transformProductsToPieChart(products);
    
    return { pieData };
  };
  
  const usersData = transformUsersData();
  const productsData = transformProductsData();
  const ordersData = transformOrdersData();
  const revenueData = transformRevenueData();
  const topProductsData = transformTopProductsData();

  return (
    // screen
    <div className="home w-full p-0 m-0">
      {/* grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 grid-flow-dense auto-rows-[minmax(200px,auto)] xl:auto-rows-[minmax(150px,auto)] gap-3 xl:gap-3 px-0">
        <div className="box col-span-full sm:col-span-1 xl:col-span-1 row-span-3 3xl:row-span-5">
          <TopSpendingBox />
        </div>
        <div className="box col-span-full sm:col-span-1 xl:col-span-1 3xl:row-span-2">
          <ChartBox
            chartType={'line'}
            color={chartColors.users}
            IconBox={MdGroup}
            title="Total Users"
            dataKey="value"
            number={usersData.number}
            percentage={usersData.percentage}
            chartData={usersData.chartData}
            isLoading={queryGetMonthlyUsers.isLoading || queryGetUserStats.isLoading}
            isSuccess={queryGetMonthlyUsers.isSuccess && queryGetUserStats.isSuccess}
          />
        </div>
        <div className="box col-span-full sm:col-span-1 xl:col-span-1 3xl:row-span-2">
          <ChartBox
            chartType={'line'}
            color={chartColors.products}
            IconBox={MdInventory2}
            title="Total Products"
            dataKey={productsData.dataKey}
            number={productsData.number}
            percentage={productsData.percentage}
            chartData={productsData.chartData}
            isLoading={queryGetMonthlyProducts.isLoading || queryGetProductStats.isLoading}
            isSuccess={queryGetMonthlyProducts.isSuccess && queryGetProductStats.isSuccess}
          />
        </div>
        <div className="box row-span-3 col-span-full sm:col-span-1 xl:col-span-1 3xl:row-span-5">
          <ChartBox
            chartType={'pie'}
            title="Top Products Sold"
            chartPieData={topProductsData.pieData}
            isLoading={queryGetTopProducts.isLoading}
            isSuccess={queryGetTopProducts.isSuccess}
          />
        </div>
        <div className="box col-span-full sm:col-span-1 xl:col-span-1 3xl:row-span-2">
          <ChartBox
            chartType={'line'}
            color={(chartColors as any).secondary || chartColors.users}
            IconBox={MdShoppingCart}
            title="Total Orders"
            dataKey="value"
            number={ordersData.number}
            percentage={ordersData.percentage}
            chartData={ordersData.chartData}
            isLoading={queryGetMonthlyOrders.isLoading || queryGetOrderStats.isLoading}
            isSuccess={queryGetMonthlyOrders.isSuccess && queryGetOrderStats.isSuccess}
          />
        </div>
        <div className="box col-span-full sm:col-span-1 xl:col-span-1 3xl:row-span-2">
          <ChartBox
            chartType={'line'}
            color={chartColors.revenue}
            IconBox={MdSwapHorizontalCircle}
            title="Total Revenue"
            dataKey="value"
            number={revenueData.number}
            percentage={revenueData.percentage}
            chartData={revenueData.chartData}
            isLoading={queryGetTotalRevenueStats.isLoading || queryGetMonthlyRevenue.isLoading}
            isSuccess={queryGetTotalRevenueStats.isSuccess && queryGetMonthlyRevenue.isSuccess}
          />
        </div>
        <div className="box col-span-1 xl:col-span-2 row-span-1 3xl:row-span-2">
          <BestSellerBox
            topProductsData={topProductsData}
            productsData={queryGetTopProducts.data?.data?.products}
            isLoading={queryGetTopProducts.isLoading}
            isSuccess={queryGetTopProducts.isSuccess}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;