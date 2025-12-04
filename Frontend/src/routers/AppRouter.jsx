import { Routes, Route } from "react-router-dom";
import RootLayout from "../components/RootLayout";

import Login from "../pages/Login/Login.jsx";
import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import Checkout from "../pages/Checkout/Checkout";
import Shop from "../pages/Shop/Shop";
import Cart from "../pages/Cart/Cart.jsx";
import UserNotifications from "../components/User/Notifications.jsx";

import AdminDashboard from "../pages/Admin/Dashboard";
import DashboardHome from "../components/Admin/content/DashboardHome.jsx";
import ProductList from "../components/Admin/content/ProductList.jsx";
import AddProduct from "../components/Admin/content/AddProduct.jsx";
import SearchResults from "../components/Admin/Layout/SearchResults.jsx";
import ProtectedRoute from "../pages/Admin/ProtectedRoute";
import AllNotifications from "../components/Admin/content/AllNotifications.jsx";
import AdminProfile from "../components/Admin/content/AdminProfile.jsx";
import AdminSettings from "../components/Admin/content/AdminSettings.jsx";
import EditProduct from "../components/Admin/content/EditProduct.jsx";
import Orders from "../components/Admin/content/Orders.jsx";
import OrderDetail from "../components/Admin/content/OrderDetail.jsx";
import Customers from "../components/Admin/content/Customers.jsx";
import CustomerDetail from "../components/Admin/content/CustomerDetail.jsx";
import Inventory from "../components/Admin/content/Inventory.jsx";
import Coupons from "../components/Admin/content/Coupons.jsx";

import App from "../App";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        {/* Login không dùng layout App */}
        <Route path="/login" element={<Login />} />

        {/* Các route dùng layout App */}
        <Route element={<App />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="shop" element={<Shop />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="cart" element={<Cart />} />
          <Route path="notifications" element={<UserNotifications />} />
        </Route>

        {/* Admin route */}
        <Route
          path="/admin/dashboard/*"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="notifications" element={<AllNotifications />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="products/edit/:productId" element={<EditProduct />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:orderId" element={<OrderDetail />} />
          <Route path="customers" element={<Customers />} />
          <Route path="customers/:customerId" element={<CustomerDetail />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="coupons" element={<Coupons />} />
        </Route>
      </Route>
    </Routes>
  );
}
