import {
  HiOutlineHome,
  HiOutlineUsers,
  HiOutlineCube,
  HiOutlineClipboardDocumentList,
  HiOutlineStar,
  HiOutlineChartBar
} from 'react-icons/hi2';
import { IoSettingsOutline } from 'react-icons/io5';

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
        url: '/reviews',
        icon: HiOutlineStar,
        label: 'reviews',
      },
      {
        isLink: true,
        url: '/revenue',
        icon: HiOutlineChartBar,
        label: 'report',
      },
    ],
  },
];

export const settingsMenuItem = {
  listItems: [
    {
      isLink: true,
      url: '/settings',
      icon: IoSettingsOutline,
      label: 'settings',
    },
  ],
};