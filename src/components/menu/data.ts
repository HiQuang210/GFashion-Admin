import toast from 'react-hot-toast';
import {
  HiOutlineHome,
  HiOutlineUser,
  HiOutlineUsers,
  HiOutlineCube,
  HiOutlineClipboardDocumentList,
  HiOutlineDocumentChartBar,
  HiOutlinePencilSquare,
  HiOutlinePresentationChartBar,
  HiOutlineArrowLeftOnRectangle,
} from 'react-icons/hi2';
import { IoSettingsOutline } from 'react-icons/io5';

export const handleSignOut = (logout: () => void) => {
  toast.success('Logged out successfully!');
  logout();
};

export const menu = [
  {
    catalog: 'main',
    listItems: [
      {
        isLink: true,
        url: '/',
        icon: HiOutlineHome,
        label: 'homepage',
      },
      {
        isLink: true,
        url: '/users',
        icon: HiOutlineUsers,
        label: 'users',
      },
      {
        isLink: true,
        url: '/products',
        icon: HiOutlineCube,
        label: 'products',
      },
      {
        isLink: true,
        url: '/orders',
        icon: HiOutlineClipboardDocumentList,
        label: 'orders',
      },
      {
        isLink: true,
        url: '/posts',
        icon: HiOutlineDocumentChartBar,
        label: 'posts',
      },
    ],
  },
  {
    catalog: 'analytics',
    listItems: [
      {
        isLink: true,
        url: '/notes',
        icon: HiOutlinePencilSquare,
        label: 'notes',
      },
      {
        isLink: true,
        url: '/charts',
        icon: HiOutlinePresentationChartBar,
        label: 'charts',
      },
    ],
  },
  {
    catalog: 'miscellaneous',
    listItems: [
      {
        isLink: true,
        url: '/profile',
        icon: HiOutlineUser,
        label: 'profile',
      },
      {
        isLink: true,
        url: '/settings',
        icon: IoSettingsOutline,
        label: 'settings',
      },
      {
        isLink: false, 
        url: '/login',
        icon: HiOutlineArrowLeftOnRectangle,
        label: 'Sign Out',
        onClick: handleSignOut, 
      },
    ],
  },
];