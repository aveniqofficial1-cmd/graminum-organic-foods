import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  CreditCard,
  Store,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Bell,
  Search,
  ExternalLink,
  ChevronRight,
  QrCode,
  Lock,
  Settings,
  Users,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import { AdminPaymentSettingsModal } from './AdminPaymentSettingsModal';

interface AdminLayoutProps {
  children?: React.ReactNode;
  pageTitle?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, pageTitle }) => {
  const { logoutAdmin, adminUser, registeredUsers, isAdmin, isManager } = useAuth();
  const { getDashboardStats } = useOrders();
  const { settings } = useStoreSettings();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const stats = getDashboardStats();

  // Inferred title if not explicitly passed
  const getInferredTitle = () => {
    if (pageTitle) return pageTitle;
    if (location.pathname === '/admin/products') return 'Products Catalog';
    if (location.pathname === '/admin/orders') return 'Orders Workflow';
    if (location.pathname === '/admin/payments') return 'Payment Verification';
    if (location.pathname === '/admin/users') return 'User Roles & Admin Delegation';
    return 'Operations Dashboard';
  };

  const currentTitle = getInferredTitle();

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
      isActive
        ? 'bg-[#075B2A] text-white shadow-md'
        : 'text-gray-700 hover:bg-[#EFF7E9] hover:text-[#075B2A]'
    }`;

  return (
    <div className="min-h-screen bg-[#F4F7F3] flex flex-col lg:flex-row">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Admin Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-white border-r border-[#E1E9DC] flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Sidebar Header with Logo (Navigates to Home / across all roles) */}
          <div className="p-5 border-b border-[#E1E9DC] flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5 group" title="Return to Home">
              <img
                src="/assets/graminum-logo.png"
                alt="Graminum"
                className="h-9 w-auto transition-transform group-hover:scale-105"
              />
              <div>
                <span className="text-base font-extrabold text-[#075B2A] font-serif-title block leading-tight">
                  GRAMINUM
                </span>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                  {isAdmin ? 'Admin Console' : 'Manager Console'}
                </span>
              </div>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 text-gray-500 hover:text-gray-800 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Operations
            </div>

            <NavLink to="/admin" end className={navItemClass}>
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                Overview
              </span>
            </NavLink>

            <NavLink to="/admin/products" className={navItemClass}>
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4" />
                <span>Products Catalog</span>
              </div>
              <span className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-bold">
                {stats.totalProducts}
              </span>
            </NavLink>

            <NavLink to="/admin/orders" className={navItemClass}>
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-4 h-4" />
                <span>Orders Workflow</span>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                {stats.totalOrders}
              </span>
            </NavLink>

            <NavLink to="/admin/payments" className={navItemClass}>
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4" />
                <span>Payment Verification</span>
              </div>
              {stats.paymentVerificationPending > 0 && (
                <span className="text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-full font-black animate-pulse">
                  {stats.paymentVerificationPending}
                </span>
              )}
            </NavLink>

            {/* RBAC User Roles is STRICTLY RESTRICTED to Admin (hidden for Manager) */}
            {isAdmin && (
              <NavLink to="/admin/users" className={navItemClass}>
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4" />
                  <span>User Roles (RBAC)</span>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  {registeredUsers.length}
                </span>
              </NavLink>
            )}

            {/* Password-Protected Scanner & WhatsApp Settings is STRICTLY RESTRICTED to Admin */}
            {isAdmin && (
              <div className="pt-3">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Configurations
                </div>
                <button
                  onClick={() => setIsSettingsModalOpen(true)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all text-[#075B2A] bg-[#EFF7E9] hover:bg-[#8CCB55] hover:text-[#06451F] border border-[#8CCB55] mt-1 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <QrCode className="w-4 h-4" />
                    <span>Scanner & WhatsApp</span>
                  </div>
                  <Lock className="w-3.5 h-3.5 text-gray-400" />
                </button>
              </div>
            )}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#E1E9DC] space-y-2">
          {/* Link back to Customer Storefront */}
          <Link
            to="/"
            className="flex items-center justify-between w-full px-3.5 py-2.5 bg-[#EFF7E9] text-[#075B2A] hover:bg-emerald-100 rounded-xl text-xs font-bold transition-colors"
          >
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4" />
              <span>Customer Storefront</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
          </Link>

          {/* Admin User info & Logout */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50 border border-gray-100">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-[#075B2A] text-white flex items-center justify-center font-bold text-xs shrink-0">
                {adminUser?.name[0]?.toUpperCase() || 'A'}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-bold text-gray-900 truncate">
                    {adminUser?.name || (isAdmin ? 'Administrator' : 'Store Manager')}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${isAdmin ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                    {isAdmin ? 'Admin' : 'Manager'}
                  </span>
                  <p className="text-[10px] text-gray-500 truncate">
                    {adminUser?.email || ''}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
              title="Logout from Management Console"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Admin Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Admin Top Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-[#E1E9DC] px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl cursor-pointer"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <span>{isAdmin ? 'Admin' : 'Manager'}</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-gray-600 font-medium">{currentTitle}</span>
              </div>
              <h1 className="text-lg sm:text-xl font-extrabold text-[#18251B] leading-none mt-0.5">
                {currentTitle}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Settings Action Button in Topbar (Admin Only) */}
            {isAdmin && (
              <button
                onClick={() => setIsSettingsModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 bg-[#EFF7E9] hover:bg-[#8CCB55] text-[#075B2A] border border-[#8CCB55] px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                title="Change WhatsApp Number or UPI Scanner (Password Protected)"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>QR & WhatsApp Settings</span>
                <Lock className="w-3 h-3 text-gray-500 ml-0.5" />
              </button>
            )}

            {/* Quick Pending Payment Alert Pill */}
            {stats.paymentVerificationPending > 0 && (
              <Link
                to="/admin/payments"
                className="hidden sm:flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors animate-pulse"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>{stats.paymentVerificationPending} Payment Review Needed</span>
              </Link>
            )}

            {/* Date Pill */}
            <div className="hidden md:block text-xs font-semibold text-gray-500 bg-[#FBF8EF] border border-[#E1E9DC] px-3 py-1.5 rounded-xl">
              📅 {new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          {children || <Outlet />}
        </main>
      </div>

      {/* Password-Protected Payment Scanner & WhatsApp Settings Modal */}
      {isAdmin && (
        <AdminPaymentSettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
        />
      )}
    </div>
  );
};
