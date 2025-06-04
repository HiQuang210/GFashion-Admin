// import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  ScrollRestoration,
} from 'react-router-dom';
import Home from './pages/Home';
import Users from './pages/Users';
import Products from './pages/Products';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Menu from './components/menu/Menu';
import Error from './pages/Error';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Notes from './pages/Notes';
import Charts from './pages/Charts';
import Logs from './pages/Logs';
import ToasterProvider from './components/ToasterProvider';
import EditProfile from './pages/EditProfile';
import User from './pages/User';
import Product from './pages/Product';
import Login from './pages/Login';
import Settings from './pages/Setting';
import ProtectedRoute from './components/ProtectedRoute';
import AddProduct from './pages/AddProduct';
import Order from './pages/Order';
import ForgotPassword from '@pages/ForgotPassword';
import ResetPassword from '@pages/ResetPassword';

function App() {
  const Layout = () => {
    return (
      <div
        id="rootContainer"
        className="w-full p-0 m-0 overflow-visible min-h-screen flex flex-col justify-between"
      >
        <ToasterProvider />
        <ScrollRestoration />
        <Menu />
        <Navbar />
        <div className="pt-20 xl:pt-[96px] 2xl:pt-[112px] mb-auto pl-0 xl:pl-[260px]">
          <div className="w-full px-4 xl:px-4 2xl:px-5 xl:py-2 overflow-clip">
            <Outlet />
          </div>
        </div>
        <Footer />
      </div>
    );
  };

  const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/', element: <Home /> },
      { path: '/profile', element: <Profile /> },
      { path: '/profile/edit', element: <EditProfile /> },
      { path: '/settings', element: <Settings /> }, 
      { path: '/users', element: <Users /> },
      { path: '/user/:id', element: <User /> },
      { path: '/products', element: <Products /> },
      { path: '/product/:id', element: <Product /> },
      { path: '/product/add', element: <AddProduct/> },
      { path: '/orders', element: <Orders /> },
      { path: '/order/:id', element: <Order /> },
      { path: '/notes', element: <Notes /> },
      { path: '/charts', element: <Charts /> },
      { path: '/logs', element: <Logs /> },
      ],
      errorElement: <Error />,
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/forgot-password',
      element: <ForgotPassword />,
    },
    {
      path: '/reset-password',
      element: <ResetPassword />,
    },
  ]);

    return <RouterProvider router={router} />;
  }

export default App;
