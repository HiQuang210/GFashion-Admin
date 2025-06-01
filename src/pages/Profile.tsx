import React from 'react';
import { HiOutlinePencil } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ChangePassword from '../components/forms/ChangePassword';
import IntegrationSection from '../components/IntegrationSection';

const Profile = () => {
  const modalDelete = React.useRef<HTMLDialogElement>(null);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = React.useState(false);
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, user, navigate]);

  if (loading || !user) {
    return (
      <div className="w-full flex justify-center items-center py-20">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const getDisplayName = () => {
    if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
    if (user.firstName) return user.firstName;
    if (user.lastName) return user.lastName;
    return user.email.split('@')[0];
  };

  return (
    <div className="w-full p-0 m-0">
      <div className="w-full flex flex-col items-stretch gap-10 xl:gap-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <h2 className="font-bold text-2xl xl:text-4xl text-base-content dark:text-neutral-200">
            My Profile
          </h2>
          <button
            onClick={() => navigate('/profile/edit')}
            className="btn text-xs xl:text-sm dark:btn-neutral"
          >
            <HiOutlinePencil className="text-lg" />
            Edit My Profile
          </button>
        </div>

        {/* Avatar & Name */}
        <div className="flex items-center gap-3 xl:gap-8 xl:mb-4">
          <div className="avatar">
            <div className="w-24 xl:w-36 2xl:w-48 rounded-full">
              <img src={user.img || '/Portrait_Placeholder.png'} alt="profile-avatar" />
            </div>
          </div>
          <div className="flex flex-col items-start gap-1">
            <h3 className="font-semibold text-xl xl:text-3xl">{getDisplayName()}</h3>
            <span className="text-neutral-500">Administrator</span>
          </div>
        </div>

        {/* Basic Info */}
        <div className="w-full flex flex-col items-stretch gap-3 xl:gap-7">
          <div className="flex items-center w-full gap-3 xl:gap-5">
            <h4 className="font-semibold text-lg xl:text-2xl whitespace-nowrap">
              Basic Information
            </h4>
            <div className="w-full h-[2px] bg-base-300 dark:bg-slate-700 mt-1"></div>
          </div>

          <div className="w-full grid grid-cols-1 xl:grid-cols-3 gap-5 xl:gap-5 xl:text-base">
            {/* Column 1 */}
            <div className="grid grid-cols-3 xl:flex gap-5 xl:gap-8">
              <div className="col-span-1 flex flex-col xl:gap-5">
                <span>First Name</span>
                <span>Last Name</span>
                <span>User ID</span>
              </div>
              <div className="col-span-2 flex flex-col xl:gap-5">
                <span className="font-semibold">{user.firstName || 'Not provided'}</span>
                <span className="font-semibold">{user.lastName || 'Not provided'}</span>
                <span className="font-semibold text-sm text-neutral-500">{user._id}</span>
              </div>
            </div>

            {/* Column 2 */}
            <div className="grid grid-cols-3 xl:flex gap-5 xl:gap-8">
              <div className="col-span-1 flex flex-col xl:gap-5">
                <span>Email*</span>
                <span>Phone</span>
                <span>Member Since</span>
              </div>
              <div className="col-span-2 flex flex-col xl:gap-5">
                <span className="font-semibold">{user.email}</span>
                <span className="font-semibold">{user.phone || 'Not provided'}</span>
                <span className="font-semibold text-sm">
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {/* Column 3 */}
            <div className="grid grid-cols-3 xl:flex gap-5 xl:gap-8">
              <div className="col-span-1 flex flex-col xl:gap-5">
                <span>Password</span>
                <span>Account Status</span>
              </div>
              <div className="col-span-2 flex flex-col xl:gap-5">
                <span
                  className="link link-primary font-semibold cursor-pointer"
                  onClick={() => setIsChangePasswordOpen(true)}
                >
                  Change Password
                </span>
                <span className={`font-semibold ${user.isActive ? 'text-success' : 'text-error'}`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <ChangePassword
              isOpen={isChangePasswordOpen}
              setIsOpen={setIsChangePasswordOpen}
              userId={user._id} 
            />
          </div>
        </div>
        <IntegrationSection modalRef={modalDelete} />
      </div>
    </div>
  );
};

export default Profile;