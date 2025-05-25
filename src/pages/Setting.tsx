import { useNavigate } from 'react-router-dom';
import { HiOutlinePencil } from 'react-icons/hi2';

const Settings = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full p-0 m-0">
      <div className="w-full flex flex-col items-stretch gap-10 xl:gap-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <h2 className="font-bold text-2xl xl:text-4xl mt-0 pt-0 text-base-content dark:text-neutral-200">
            Settings
          </h2>
        </div>

        {/* Block: Account Settings */}
        <div className="w-full flex flex-col items-stretch gap-6 xl:gap-7">
          <div className="flex flex-col gap-2">
            <div className="flex items-center w-full gap-3 xl:gap-5">
              <h4 className="font-semibold text-lg xl:text-2xl whitespace-nowrap">
                Account Settings
              </h4>
              <div className="w-full h-[2px] bg-base-300 dark:bg-slate-700 mt-1"></div>
            </div>
            <p className="text-sm xl:text-base text-neutral-500 dark:text-neutral-content">
              View or edit your account information and preferences.
            </p>
            <button
              onClick={() => navigate('/profile')}
              className="btn w-fit text-xs xl:text-sm dark:btn-neutral"
            >
              <HiOutlinePencil className="text-lg" /> Go to Profile
            </button>
          </div>
        </div>

        {/* Block: Software Info */}
        <div className="w-full flex flex-col items-stretch gap-6 xl:gap-7">
          <div className="flex flex-col gap-2">
            <div className="flex items-center w-full gap-3 xl:gap-5">
              <h4 className="font-semibold text-lg xl:text-2xl whitespace-nowrap">
                Software Information
              </h4>
              <div className="w-full h-[2px] bg-base-300 dark:bg-slate-700 mt-1"></div>
            </div>
            <div className="text-sm xl:text-base dark:text-neutral-content">
              <p><strong>GFashion Admin</strong> version 1.0.0</p>
              <p>Developed by HTNTeam</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
