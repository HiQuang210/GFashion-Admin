import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchUsers } from '@api/ApiCollection';
import { User } from '@type/User';

const TopSpendingBox = () => {
  const navigate = useNavigate();
  const tempTotalEntries = [1, 2, 3, 4, 5];

  const { isLoading, isSuccess, data, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const sortedUsers = data?.data
    ? [...data.data].sort((a: User, b: User) => b.totalSpent - a.totalSpent)
    : [];

  const handleUserClick = (userId: string) => {
    navigate(`/user/${userId}`);
  };

  return (
    <div className="w-full p-0 m-0 flex flex-col items-stretch gap-6 xl:gap-4 2xl:gap-9">
      <span className="text-2xl xl:text-2xl 2xl:text-4xl font-bold">
        Top Spent Users
      </span>
      <div className="w-full flex flex-col items-stretch gap-3">
        {isLoading &&
          tempTotalEntries.map((_item, index) => (
            <div
              key={index}
              className="w-full flex justify-between items-center h-auto px-1 py-2"
            >
              <div className="flex gap-3 2xl:gap-4 items-center">
                <div className="skeleton w-10 h-10 xl:w-8 xl:h-8 2xl:w-16 2xl:h-16 rounded-full"></div>
                <div className="flex flex-col items-start gap-1">
                  <div className="skeleton h-4 w-24"></div>
                  <div className="skeleton h-4 w-20"></div>
                </div>
              </div>
              <div className="skeleton h-7 w-14"></div>
            </div>
          ))}
        
        {error && (
          <div className="text-center text-red-500 py-4">
            Failed to load users. Please try again.
          </div>
        )}
        
        {isSuccess && sortedUsers.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            No users found.
          </div>
        )}
        
        {isSuccess &&
          sortedUsers.map((user: User) => (
            <button
              onClick={() => handleUserClick(user._id)}
              key={user._id}
              className="w-full flex items-center h-auto btn btn-ghost px-1 py-2 hover:bg-gray-100 transition-colors"
            >
              <div className="flex gap-3 2xl:gap-4 items-center w-full">
                <div className="flex flex-col items-center gap-1">
                  <div className="avatar">
                    <div className="w-11 xl:w-8 2xl:w-16 3xl:w-20 rounded-full">
                      <img 
                        src={user.img || '/Portrait_Placeholder.png'} 
                        alt={`${user.firstName} ${user.lastName}`}
                        onError={(e) => {
                          e.currentTarget.src = '/Portrait_Placeholder.png';
                        }}
                      />
                    </div>
                  </div>
                  <span className="font-semibold text-xs xl:text-[10px] 2xl:text-sm 3xl:text-base text-green-600">
                    ₫{user.totalSpent.toLocaleString('vi-VN')}
                  </span>
                </div>
                <div className="flex flex-col items-start gap-1">
                  <span className="text-sm xl:text-[13px] 2xl:text-lg 3xl:text-xl m-0 p-0">
                    {user.firstName || 'N/A'} {user.lastName || ''}
                  </span>
                  <span className="text-xs xl:text-[10px] 2xl:text-sm 3xl:text-base text-gray-500">
                    {user.email}
                  </span>
                </div>
              </div>
            </button>
          ))}
      </div>
    </div>
  );
};

export default TopSpendingBox;