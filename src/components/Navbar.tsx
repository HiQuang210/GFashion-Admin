import React from 'react';
import { Link } from 'react-router-dom';
import { HiBars3CenterLeft } from 'react-icons/hi2';
import { DiReact } from 'react-icons/di';
import { HiOutlineBell } from 'react-icons/hi';
import ChangeThemes from './ChangesThemes';
import toast from 'react-hot-toast';
import { menu, settingsMenuItem } from './menu/data'; 
import MenuItem from './menu/MenuItem';
import FullscreenToggle from './FullscreenToggle';
import { useAuth } from '@hooks/useAuth';

const Navbar: React.FC = () => {
  const [isDrawerOpen, setDrawerOpen] = React.useState(false);
  const toggleDrawer = () => setDrawerOpen(!isDrawerOpen);
  const { user, logout } = useAuth();
  const handleLogout = () => {
    logout(); 
  };
  const [isDropdownOpen, setDropdownOpen] = React.useState(false);
  const avatarRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed z-[3] top-0 left-0 right-0 bg-base-100 w-full flex justify-between px-3 xl:px-4 py-3 xl:py-5 gap-4 xl:gap-0">
      <div className="flex gap-3 items-center">
        <div className="drawer w-auto p-0 mr-1 xl:hidden">
          <input
            id="drawer-navbar-mobile"
            type="checkbox"
            className="drawer-toggle"
            checked={isDrawerOpen}
            onChange={toggleDrawer}
          />
          <div className="p-0 w-auto drawer-content">
            <label
              htmlFor="drawer-navbar-mobile"
              className="p-0 btn btn-ghost drawer-button"
            >
              <HiBars3CenterLeft className="text-2xl" />
            </label>
          </div>
          <div className="drawer-side z-[99]">
            <label
              htmlFor="drawer-navbar-mobile"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <div className="menu p-4 w-auto min-h-full bg-base-200 text-base-content flex flex-col">
              
              <div className="flex items-center gap-2 mb-4">
                <button onClick={toggleDrawer} className="btn btn-ghost p-2 rotate-180">
                  <HiBars3CenterLeft className="text-2xl" />
                </button>
                <span className="text-lg font-semibold text-base-content">Menu</span>
              </div>

              <div className="flex-1">
                {menu.map((item, index) => (
                  <MenuItem
                    onClick={toggleDrawer}
                    key={index}
                    catalog={item.catalog}
                    listItems={
                      item.listItems.map((listItem: any) => ({
                        ...listItem,
                        onClick: listItem.onClick
                          ? () => listItem.onClick(logout)
                          : undefined,
                      }))
                    }
                  />
                ))}
              </div>

              <div className="mt-auto pt-4 border-t border-white dark:border-gray-600">
                <MenuItem
                  onClick={toggleDrawer}
                  listItems={settingsMenuItem.listItems.map((listItem: any) => ({
                    ...listItem,
                    onClick: listItem.onClick
                      ? () => listItem.onClick(logout)
                      : undefined,
                  }))}
                  catalog={''}
                />
              </div>
            </div>
          </div>
        </div>

        {/* navbar logo */}
        <Link to={'/'} className="flex items-center gap-1 xl:gap-2">
          <DiReact className="text-3xl sm:text-4xl xl:text-4xl 2xl:text-6xl text-primary animate-spin-slow" />
          <span className="text-[16px] leading-[1.2] sm:text-lg xl:text-xl 2xl:text-2xl font-semibold text-base-content dark:text-neutral-200">
            GFashion Dashboard
          </span>
        </Link>
      </div>

      {/* navbar items to right */}
      <div className="flex items-center gap-0 xl:gap-1 2xl:gap-2 3xl:gap-5">

        <FullscreenToggle />

        {/* notification */}
        <button
          onClick={() =>
            toast('No notification!')
          }
          className="px-0 xl:px-auto btn btn-circle btn-ghost"
        >
          <HiOutlineBell className="text-xl 2xl:text-2xl 3xl:text-3xl" />
        </button>

        {/* theme */}
        <div className="px-0 xl:px-auto btn btn-circle btn-ghost xl:mr-1">
          <ChangeThemes />
        </div>

        {/* avatar dropdown */}
        <div className="relative" ref={avatarRef}>
        <button
          onClick={() => setDropdownOpen(prev => !prev)}
          className="btn btn-ghost btn-circle avatar"
        >
          <div className="w-9 rounded-full">
            <img
              src={user?.img || '/Portrait_Placeholder.png'}
              alt={user ? `${user.firstName} ${user.lastName}` : 'User'}
            />
          </div>
        </button>

        {isDropdownOpen && (
          <ul className="absolute right-0 mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-40">
            {user && (
              <li className="py-2 text-xs text-gray-400 border-b border-gray-200">
                <span className="font-medium">
                  Hi {user.firstName} {user.lastName}
                </span>
              </li>
            )}
            <Link to={'/profile'}>
              <li>
                <a className="justify-between">My Profile</a>
              </li>
            </Link>
            <li onClick={handleLogout}>
              <a className="text-red-600 hover:bg-red-50">Sign Out</a>
            </li>
          </ul>
        )}
      </div>
      </div>
    </div>
  );
};

export default Navbar;