import TopSpendingBox from '@components/dashboard/TopSpendingBox';
import ChartBox from '@components/charts/ChartBox';
import { useQuery } from '@tanstack/react-query';
import {
  MdGroup,
  MdInventory2,
  MdSwapHorizontalCircle,
} from 'react-icons/md';
import {
  fetchUsers, // Updated import
  fetchTotalProducts,
  fetchTotalProfit,
  fetchTotalRevenue,
  fetchTotalRevenueByProducts,
  fetchTotalSource
} from '@api/ApiCollection';

const Home = () => {
  // Updated query to use fetchUsers instead of fetchTotalUsers
  const queryGetUsers = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const queryGetTotalProducts = useQuery({
    queryKey: ['totalproducts'],
    queryFn: fetchTotalProducts,
  });

  const queryGetTotalRevenue = useQuery({
    queryKey: ['totalrevenue'],
    queryFn: fetchTotalRevenue,
  });

  const queryGetTotalSource = useQuery({
    queryKey: ['totalsource'],
    queryFn: fetchTotalSource,
  });

  const queryGetTotalRevenueByProducts = useQuery({
    queryKey: ['totalrevenue-by-products'],
    queryFn: fetchTotalRevenueByProducts,
  });

  const queryGetTotalProfit = useQuery({
    queryKey: ['totalprofit'],
    queryFn: fetchTotalProfit,
  });

  // Transform users data to match ChartBox expected format
  const transformUsersData = () => {
    if (!queryGetUsers.data || !queryGetUsers.data.data) {
      return {
        number: 0,
        percentage: 0,
        chartData: []
      };
    }

    const responseData = queryGetUsers.data;
    const users = responseData.data; // Access the nested data array
    const totalUsers = responseData.totalUser; // Use the totalUser field from API

    // Create sample chart data based on user registration dates or other metrics
    // You can modify this based on your actual data structure
    const chartData = users.map((index: number) => ({
      name: `User ${index + 1}`,
      value: 1 // You can replace this with actual user metrics
    }));

    // Calculate percentage growth (you can implement your own logic here)
    // For example, comparing with previous period or target
    const percentage = totalUsers > 0 ? 10 : 0; // Placeholder percentage

    return {
      number: totalUsers,
      percentage: percentage,
      chartData: chartData
    };
  };

  const usersData = transformUsersData();

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
            IconBox={MdGroup}
            title="Total Users"
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
            IconBox={MdInventory2}
            title="Total Products"
            {...queryGetTotalProducts.data}
            isLoading={queryGetTotalProducts.isLoading}
            isSuccess={queryGetTotalProducts.isSuccess}
          />
        </div>
        <div className="box row-span-3 col-span-full sm:col-span-1 xl:col-span-1 3xl:row-span-5">
          <ChartBox
            chartType={'pie'}
            title="Leads by Source"
            {...queryGetTotalSource.data}
            isLoading={queryGetTotalSource.isLoading}
            isSuccess={queryGetTotalSource.isSuccess}
          />
        </div>
        <div className="box col-span-full sm:col-span-1 xl:col-span-1 3xl:row-span-2">
          <ChartBox
            chartType={'line'}
            IconBox={MdSwapHorizontalCircle}
            title="Total Revenue"
            {...queryGetTotalRevenue.data}
            isLoading={queryGetTotalRevenue.isLoading}
            isSuccess={queryGetTotalRevenue.isSuccess}
          />
        </div>
        <div className="box row-span-2 col-span-full xl:col-span-2 3xl:row-span-3">
          <ChartBox
            chartType={'area'}
            title="Revenue by Products"
            {...queryGetTotalRevenueByProducts.data}
            isLoading={queryGetTotalRevenueByProducts.isLoading}
            isSuccess={queryGetTotalRevenueByProducts.isSuccess}
          />
        </div>
        <div className="box col-span-full sm:col-span-1 xl:col-span-1 3xl:row-span-2">
          <ChartBox
            chartType={'bar'}
            title="Total Profit"
            {...queryGetTotalProfit.data}
            isLoading={queryGetTotalProfit.isLoading}
            isSuccess={queryGetTotalProfit.isSuccess}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;