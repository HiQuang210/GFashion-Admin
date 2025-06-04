import TopSpendingBox from '@components/dashboard/TopSpendingBox';
import ChartBox from '@components/charts/ChartBox';
import { useQuery } from '@tanstack/react-query';
import {
  MdGroup,
  MdInventory2,
  MdSwapHorizontalCircle,
  MdShoppingCart,
} from 'react-icons/md';
import {
  fetchUsers, 
  fetchAdminProducts,
  fetchTotalRevenueStats,
  fetchMonthlyRevenue,
  fetchTotalSource,
  fetchOrders,
  fetchTotalRevenueByProducts} from '@api/ApiCollection';
import {
  usersChartData,
  productsChartData,
  revenueChartData,
  leadsSourceData,
  revenueByProductsData,
  ordersChartData,
  calculatePercentageChange,
  mockPreviousData,
  chartColors,
  transformRevenueDataToChart,
  calculateRevenuePercentageChange,
  formatRevenue,
  mockPreviousRevenueTotal
} from '@components/charts/data';

const Home = () => {
  const currentYear = new Date().getFullYear().toString();

  const queryGetUsers = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const queryGetTotalProducts = useQuery({
    queryKey: ['products'],
    queryFn: () => fetchAdminProducts(),
  });

  const queryGetTotalRevenueStats = useQuery({
    queryKey: ['revenue-stats', currentYear],
    queryFn: () => fetchTotalRevenueStats(currentYear),
  });

  const queryGetMonthlyRevenue = useQuery({
    queryKey: ['monthly-revenue', currentYear],
    queryFn: () => fetchMonthlyRevenue(currentYear),
  });

  const queryGetTotalSource = useQuery({
    queryKey: ['totalsource'],
    queryFn: fetchTotalSource,
  });

  const queryGetTotalRevenueByProducts = useQuery({
    queryKey: ['totalrevenue-by-products'],
    queryFn: fetchTotalRevenueByProducts,
  });

  const queryGetTotalOrders = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
  });

  // Transform users data to match ChartBox expected format
  const transformUsersData = () => {
    if (!queryGetUsers.data || !queryGetUsers.data.data) {
      return {
        number: 0,
        percentage: 0,
        chartData: usersChartData
      };
    }

    const responseData = queryGetUsers.data;
    const totalUsers = responseData.totalUser;

    // Calculate percentage change using real data
    const percentage = calculatePercentageChange(totalUsers, mockPreviousData.users);

    // Update the last data point with actual current users
    const updatedChartData = [...usersChartData];
    updatedChartData[updatedChartData.length - 1].value = totalUsers;

    return {
      number: totalUsers,
      percentage: percentage,
      chartData: updatedChartData
    };
  };

  // Transform products data to match ChartBox expected format
  const transformProductsData = () => {
    if (!queryGetTotalProducts.data) {
      return {
        number: 0,
        percentage: 0,
        chartData: productsChartData
      };
    }

    const responseData = queryGetTotalProducts.data;
    const totalProducts = responseData.totalProd;

    // Calculate percentage change using real data
    const percentage = calculatePercentageChange(totalProducts, mockPreviousData.products);

    // Update the last data point with actual current products
    const updatedChartData = [...productsChartData];
    updatedChartData[updatedChartData.length - 1].value = totalProducts;

    return {
      number: totalProducts,
      percentage: percentage,
      chartData: updatedChartData,
      dataKey: 'value'
    };
  };

  // Transform orders data to match ChartBox expected format
  const transformOrdersData = () => {
    if (!queryGetTotalOrders.data) {
      return {
        number: 0,
        percentage: 0,
        chartData: ordersChartData
      };
    }

    const responseData = queryGetTotalOrders.data;
    const totalOrders = responseData.totalOrder;

    const percentage = calculatePercentageChange(totalOrders, mockPreviousData.orders);

    // Update the last data point with actual current orders
    const updatedChartData = [...ordersChartData];
    updatedChartData[updatedChartData.length - 1].value = totalOrders;

    return {
      number: totalOrders,
      percentage: percentage,
      chartData: updatedChartData
    };
  };

  // Transform revenue data using real API data
  const transformRevenueData = () => {
    if (!queryGetTotalRevenueStats.data?.data || !queryGetMonthlyRevenue.data?.data) {
      return {
        number: "0M VND",
        percentage: 0,
        chartData: revenueChartData
      };
    }

    const revenueStats = queryGetTotalRevenueStats.data.data;
    const monthlyData = queryGetMonthlyRevenue.data.data;

    // Transform monthly data to chart format
    const chartData = transformRevenueDataToChart(monthlyData);

    // Calculate percentage change
    const percentage = calculateRevenuePercentageChange(monthlyData, mockPreviousRevenueTotal);

    // Format total revenue for display
    const formattedRevenue = formatRevenue(revenueStats.totalRevenueInMillions);

    return {
      number: formattedRevenue,
      percentage: percentage,
      chartData: chartData
    };
  };

  // Handle revenue export
  
  const usersData = transformUsersData();
  const productsData = transformProductsData();
  const ordersData = transformOrdersData();
  const revenueData = transformRevenueData();

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
            isLoading={queryGetUsers.isLoading}
            isSuccess={queryGetUsers.isSuccess}
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
            isLoading={queryGetTotalProducts.isLoading}
            isSuccess={queryGetTotalProducts.isSuccess}
          />
        </div>
        <div className="box row-span-3 col-span-full sm:col-span-1 xl:col-span-1 3xl:row-span-5">
          <ChartBox
            chartType={'pie'}
            title="Leads by Source"
            chartPieData={leadsSourceData}
            isLoading={queryGetTotalSource.isLoading}
            isSuccess={queryGetTotalSource.isSuccess}
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
            isLoading={queryGetTotalOrders.isLoading}
            isSuccess={queryGetTotalOrders.isSuccess}
          />
        </div>
        <div className="box row-span-2 col-span-full xl:col-span-2 3xl:row-span-3">
          <ChartBox
            chartType={'area'}
            title="Revenue by Products"
            chartAreaData={revenueByProductsData}
            isLoading={queryGetTotalRevenueByProducts.isLoading}
            isSuccess={queryGetTotalRevenueByProducts.isSuccess}
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
      </div>
    </div>
  );
};

export default Home;