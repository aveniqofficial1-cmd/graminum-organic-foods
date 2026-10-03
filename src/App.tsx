import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Outlet, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { StoreSettingsProvider } from './context/StoreSettingsContext';

// Common Components
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { AdminLayout } from './components/admin/AdminLayout';

// Customer Pages (Screens 1 to 11)
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { CustomerAccountPage } from './pages/CustomerAccountPage';
import { AboutPage } from './pages/AboutPage';
import { FAQPage } from './pages/FAQPage';
import { ContactPage } from './pages/ContactPage';

// Admin Pages (Screens 12 to 17)
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminPaymentVerificationPage } from './pages/admin/AdminPaymentVerificationPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';

// Scroll to top helper on route navigation
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Customer Layout with Sticky Header & Footer
const CustomerLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FBF8EF] text-[#18251B]">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// Protected Admin Route Guard
const ProtectedAdminRoute: React.FC = () => {
  const { isAdminAuthenticated } = useAuth();
  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return <AdminLayout />;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <StoreSettingsProvider>
            <ProductProvider>
              <WishlistProvider>
                <CartProvider>
                  <OrderProvider>
                    <ScrollToTop />
                    <Routes>
                      {/* Customer Storefront Routes */}
                      <Route element={<CustomerLayout />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/shop" element={<ShopPage />} />
                        <Route path="/product/:slug" element={<ProductDetailPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route
                          path="/order-confirmation/:orderId"
                          element={<OrderConfirmationPage />}
                        />
                        <Route path="/track-order" element={<OrderTrackingPage />} />
                        <Route path="/track-order/:orderId" element={<OrderTrackingPage />} />
                        <Route path="/account" element={<CustomerAccountPage />} />
                        <Route path="/login" element={<CustomerAccountPage initialAuthMode="login" />} />
                        <Route path="/signup" element={<CustomerAccountPage initialAuthMode="signup" />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/faq" element={<FAQPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                      </Route>

                      {/* Admin Authentication */}
                      <Route path="/admin/login" element={<AdminLoginPage />} />

                      {/* Protected Admin Console Routes */}
                      <Route path="/admin" element={<ProtectedAdminRoute />}>
                        <Route index element={<AdminDashboardPage />} />
                        <Route path="products" element={<AdminProductsPage />} />
                        <Route path="orders" element={<AdminOrdersPage />} />
                        <Route path="payments" element={<AdminPaymentVerificationPage />} />
                        <Route path="users" element={<AdminUsersPage />} />
                      </Route>

                      {/* Fallback redirect */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </OrderProvider>
                </CartProvider>
              </WishlistProvider>
            </ProductProvider>
          </StoreSettingsProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;
