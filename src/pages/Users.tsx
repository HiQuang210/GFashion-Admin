import React from 'react';
import { GridColDef } from '@mui/x-data-grid';
import DataTable, { ActionConfig } from '../components/DataTable';
import { fetchUsers } from '../api/ApiCollection';
import { useQuery } from '@tanstack/react-query';
//import toast from 'react-hot-toast';
import AddUserData from '../components/forms/AddUserData';
import { HiCheck, HiX } from 'react-icons/hi';
import { User } from '../types/User';
import { useAuth } from '../hooks/useAuth';

const Users = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user: currentUser } = useAuth(); 
  
  const { isLoading, isError, isSuccess, data } = useQuery({
    queryKey: ['allusers'],
    queryFn: fetchUsers,
  });

  const users = React.useMemo(() => {
    if (!data?.data) return [];
 
    const filteredUsers = data.data.filter((user: User) => 
      currentUser ? user._id !== currentUser._id : true
    );
    
    return filteredUsers
      .sort((a: User, b: User) => a._id.localeCompare(b._id))
      .map((user: User, index: number) => ({ 
        ...user, 
        id: user._id, 
        sequentialId: index + 1 
      }));
  }, [data, currentUser]);

  const columns: GridColDef[] = [
    { 
      field: 'sequentialId',
      headerName: 'ID', 
      width: 90,
    },
    {
      field: 'firstName',
      headerName: 'Name',
      minWidth: 220,
      flex: 1,
      renderCell: ({ row }) => (
        <div className="flex gap-3 items-center py-2">
          <div className="avatar">
            <div className="w-8 xl:w-10 rounded-full">
              <img src={row.img || '/Portrait_Placeholder.png'} alt="user" />
            </div>
          </div>
          <span>{row.firstName} {row.lastName}</span>
        </div>
      ),
    },
    {
      field: 'email',
      headerName: 'Email',
      minWidth: 200,
      flex: 1,
    },
    {
      field: 'phone',
      headerName: 'Phone',
      minWidth: 120,
      flex: 1,
      renderCell: ({ value }) => <span>{value || 'N/A'}</span>,
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      minWidth: 100,
      flex: 1,
      renderCell: ({ value }) => <span>{new Date(value).toLocaleDateString()}</span>,
    },
    {
      field: 'isActive',
      headerName: 'Status',
      width: 80,
      flex: 1,
      renderCell: ({ value }) => (
        <div className="flex justify-center items-center">
          {value ? (
            <HiCheck className="text-green-500 text-xl" />
          ) : (
            <HiX className="text-red-500 text-xl" />
          )}
        </div>
      ),
    },
  ];

  const actionConfig: ActionConfig = {
    showEdit: true,
    showDelete: false, 
    editRoute: (id: string) => `/user/${id}`,
    getItemName: (row: any) => `${row.firstName} ${row.lastName}` || 'User'
  };

  // React.useEffect(() => {
  //   const toastId = 'promiseUsers';
  //   if (isLoading) toast.loading('Loading...', { id: toastId });
  //   else if (isError) toast.error('Error while getting the data!', { id: toastId });
  //   else if (isSuccess) toast.success('Got the data successfully!', { id: toastId });
  // }, [isError, isLoading, isSuccess]);

  return (
    <div className="w-full p-0 m-0">
      <div className="w-full flex flex-col items-stretch gap-3">
        <div className="w-full flex justify-between mb-5">
          <div className="flex gap-1 justify-start flex-col items-start">
            <h2 className="font-bold text-2xl xl:text-4xl mt-0 pt-0 text-base-content dark:text-neutral-200">
              Users
            </h2>
            {data?.totalUser && (
              <span className="text-neutral dark:text-neutral-content font-medium text-base">
                {data.totalUser} Users Found
              </span>
            )}
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className={`btn ${isLoading ? 'btn-disabled' : 'btn-primary'}`}
          >
            Add New User +
          </button>
        </div>

        <DataTable
          slug="users"
          columns={columns}
          rows={isSuccess ? users : []}
          includeActionColumn={true}
          actionConfig={actionConfig}
        />

        {isError && !isLoading && (
          <div className="w-full flex justify-center text-error">
            Error while getting the data!
          </div>
        )}

        {isOpen && (
          <AddUserData isOpen={isOpen} setIsOpen={setIsOpen} />
        )}
      </div>
    </div>
  );
};

export default Users;