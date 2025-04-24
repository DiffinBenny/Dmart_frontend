import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Main, Navigator, Product, Sidebar } from "./layout/index";
import { useGlobalContext } from "./context/context";
import Collections from "./pages/Collections";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SearchResults from "./components/SearchResults";
import Fashion from "./pages/Fashion";
import Accessories from "./pages/Accessories";
import Beauty from "./pages/Beauty";
import CollectionsNavbar from "./components/CollectionsNavbar";
import Order from "./pages/Order";
import Wishlist from "./pages/Wishlist";
import VendorNavbar from "./components/VendorNavbar";
import VendorHome from "./pages/Vendor/VendorHome";
import Report from "./pages/Vendor/Report";
import Footer from "./components/Footer";
import UserProfile from "./components/UserProfile";
import CollectionsHome from "./pages/CollectionsHome";
import VendorProfilePage from "./pages/Vendor/VendorProfilePage";
import AdminDashboard from "./components/AdminDashboard";
import Payment from "./pages/Payment";
import AddProduct from "./pages/Vendor/AddProduct";
import EditProduct from "./pages/Vendor/EditProduct";
import ForgotPassword from "./pages/ForgotPassword";
import VendorRegister from "./pages/VendorRegister";
import Checkout from "./pages/Checkout";
import Chat from "./pages/Chat";
import VendorChat from "./pages/Vendor/Vendorchat";
import OrderList from "./pages/Vendor/OrderList";
import ResetPassword from "./pages/ResetPassword";

function App() {
  const { state } = useGlobalContext();
  const location = useLocation();

  // Define vendor-based routes
  const vendorRoutes = [
    "/vendorhome",
    "/vendor/add-product",
    "/vendor/edit-product",
    "/vendor/order-list",
    "/vendor/report",
    "/vendor/profile",
    "/vendor/vendorchat",
    "/vendor/chat"  // Added vendorchat route
  ];

  // Check if the current page is a vendor-based page
  const isVendorPage = vendorRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  // Check if the current page is the profile page
  const isProfilePage = location.pathname === "/profile";

  // Check if the current page is the admin dashboard
  const isAdminDashboard = location.pathname === "/admin/dashboard";

  // Check if the current page is the checkout page
  const isCheckoutPage = location.pathname === "/checkout";

  console.log(isVendorPage, isProfilePage, isAdminDashboard);

  return (
    <div className="App">
      {/* Render VendorNavbar only for vendor-based pages */}
      {isVendorPage && <VendorNavbar />}

      {/* Render other navigation components for non-vendor, non-admin, non-profile, and non-checkout pages */}
      {!isVendorPage && !isProfilePage && !isAdminDashboard && !isCheckoutPage && (
        <>
          {location.pathname.startsWith("/collections") ? (
            <CollectionsNavbar />
          ) : (
            <Navigator />
          )}
        </>
      )}

      {/* Sidebar - Render only for non-vendor, non-admin, non-profile, and non-checkout pages */}
      {!isVendorPage && !isProfilePage && !isAdminDashboard && !isCheckoutPage && (
        <Sidebar isShowing={state.showSidebar} />
      )}

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collections" element={<Collections />}>
          <Route path="collectionshome" element={<CollectionsHome />} />
          <Route path="fashion" element={<Fashion />} />
          <Route path="accessories" element={<Accessories />} />
          <Route path="beauty" element={<Beauty />} />
        </Route>
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/collections/order" element={<Order />} />
        <Route path="/collections/wishlist" element={<Wishlist />} />
        <Route path="/login" element={<Login />} />
        <Route path="/vendor-register" element={<VendorRegister />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/collections/product/:productId" element={<Product />} />
        <Route path="/collections/payment/:id" element={<Payment />} />
        <Route path="/collections/checkout" element={<Checkout />} />
        <Route path="/collections/chat/:vendorId/:userId" element={<Chat />} />

        {/* Vendor Routes */}
        <Route path="/vendorhome" element={<VendorHome />} />
        <Route path="/vendor/add-product" element={<AddProduct />} />
        <Route path="/vendor/edit-product" element={<EditProduct />} />
        <Route path="/vendor/order-list" element={<OrderList />} />
        <Route path="/vendor/report" element={<Report />} />
        <Route path="/vendor/vendorchat" element={<VendorChat />} />
        <Route path="/vendor/chat/:vendorId/:userId" element={<Chat />} />
        
        <Route path="/vendor/profile" element={<VendorProfilePage />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>

      {/* Footer - Render only for non-admin and non-checkout pages */}
      {!isAdminDashboard && !isCheckoutPage && <Footer />}
    </div>
  );
}

export default App;