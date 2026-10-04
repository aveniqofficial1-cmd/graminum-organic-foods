import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  Search,
  Filter,
  KeyRound,
  Lock,
  CheckCircle2,
  AlertCircle,
  X,
  Crown,
  UserCheck,
  UserX,
  Sparkles,
  Mail,
  Phone,
  Calendar,
  Shield,
} from 'lucide-react';
import { useAuth, PRIMARY_ADMIN_EMAIL } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { User, UserRole } from '../../types';

export const AdminUsersPage: React.FC = () => {
  const { registeredUsers, changeUserRole, currentUser, isAdmin, isManager } = useAuth();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'manager' | 'customer'>('all');

  // Password-lock modal state
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedTargetUser, setSelectedTargetUser] = useState<User | null>(null);
  const [targetRoleToAssign, setTargetRoleToAssign] = useState<UserRole>('manager');
  const [securityPasswordInput, setSecurityPasswordInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If user is not an admin (e.g. manager), block access
  if (isManager && !isAdmin) {
    return (
      <div className="bg-white rounded-3xl border border-red-200 p-8 text-center space-y-4 max-w-xl mx-auto my-12 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-red-900 font-serif-title">
          Access Restricted: Administrator Only
        </h2>
        <p className="text-xs text-gray-600 leading-relaxed">
          Store Managers do not have permission to view or manage User Roles & Permissions. Please contact the Primary Administrator ({PRIMARY_ADMIN_EMAIL}) if you require administrative access.
        </p>
      </div>
    );
  }

  // Filter users
  const filteredUsers = registeredUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone && user.phone.includes(searchTerm));

    const matchesRole =
      roleFilter === 'all' ? true : user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handleOpenRoleModal = (user: User, newRole: UserRole) => {
    if (user.email.toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase() && newRole !== 'admin') {
      showToast(`Primary Admin (${PRIMARY_ADMIN_EMAIL}) cannot be demoted.`, 'error');
      return;
    }
    setSelectedTargetUser(user);
    setTargetRoleToAssign(newRole);
    setSecurityPasswordInput('');
    setIsRoleModalOpen(true);
  };

  const handleConfirmRoleChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTargetUser) return;

    if (!securityPasswordInput) {
      showToast('Please enter the Admin Security Password to proceed.', 'error');
      return;
    }

    setIsSubmitting(true);
    const success = changeUserRole(
      selectedTargetUser.id,
      targetRoleToAssign,
      securityPasswordInput
    );
    setIsSubmitting(false);

    if (success) {
      setIsRoleModalOpen(false);
      setSelectedTargetUser(null);
      setSecurityPasswordInput('');
    }
  };

  const adminCount = registeredUsers.filter((u) => u.role === 'admin').length;
  const managerCount = registeredUsers.filter((u) => u.role === 'manager').length;
  const customerCount = registeredUsers.filter((u) => u.role === 'customer').length;

  return (
    <div className="space-y-6">
      {/* Top Header & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E1E9DC] shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#EFF7E9] px-3 py-1 rounded-full text-[11px] font-extrabold text-[#075B2A] border border-[#8CCB55] mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#4D963C]" />
            <span>Role-Based Access Control (RBAC)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#075B2A] font-serif-title">
            User Accounts & Role Delegation
          </h1>
          <p className="text-xs text-[#667267] mt-0.5">
            Assign Admin, Manager, or Customer roles. All role modifications require the Admin Security Password.
          </p>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="bg-[#EFF7E9] px-3.5 py-2 rounded-2xl border border-[#8CCB55] text-center">
            <span className="block text-[9px] text-gray-500 font-bold uppercase">Admins</span>
            <span className="text-base sm:text-lg font-black text-[#075B2A]">{adminCount}</span>
          </div>
          <div className="bg-blue-50 px-3.5 py-2 rounded-2xl border border-blue-200 text-center">
            <span className="block text-[9px] text-blue-600 font-bold uppercase">Managers</span>
            <span className="text-base sm:text-lg font-black text-blue-800">{managerCount}</span>
          </div>
          <div className="bg-[#FBF8EF] px-3.5 py-2 rounded-2xl border border-[#E1E9DC] text-center">
            <span className="block text-[9px] text-gray-500 font-bold uppercase">Customers</span>
            <span className="text-base sm:text-lg font-black text-[#18251B]">{customerCount}</span>
          </div>
        </div>
      </div>

      {/* Super Admin Notice Card */}
      <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900">
        <div className="flex items-center gap-3">
          <Crown className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <span className="font-extrabold block">Primary Administrator:</span>
            <span className="font-mono bg-white/70 px-2 py-0.5 rounded-md border border-amber-300 font-bold">
              {PRIMARY_ADMIN_EMAIL}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-800 bg-amber-100/80 px-3 py-1.5 rounded-xl border border-amber-300">
          <Lock className="w-3.5 h-3.5" />
          <span>Role changes are password protected</span>
        </div>
      </div>

      {/* Search & Role Filter Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#E1E9DC] shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by user name, email, or phone number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#FBF8EF] text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-2xl border border-[#E1E9DC] focus:outline-none focus:border-[#075B2A]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <button
            onClick={() => setRoleFilter('all')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              roleFilter === 'all'
                ? 'bg-[#075B2A] text-white shadow-xs'
                : 'bg-[#FBF8EF] text-gray-600 hover:bg-[#EFF7E9]'
            }`}
          >
            All ({registeredUsers.length})
          </button>
          <button
            onClick={() => setRoleFilter('admin')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              roleFilter === 'admin'
                ? 'bg-[#075B2A] text-white shadow-xs'
                : 'bg-[#FBF8EF] text-gray-600 hover:bg-[#EFF7E9]'
            }`}
          >
            Admins ({adminCount})
          </button>
          <button
            onClick={() => setRoleFilter('manager')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              roleFilter === 'manager'
                ? 'bg-[#075B2A] text-white shadow-xs'
                : 'bg-[#FBF8EF] text-gray-600 hover:bg-[#EFF7E9]'
            }`}
          >
            Managers ({managerCount})
          </button>
          <button
            onClick={() => setRoleFilter('customer')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              roleFilter === 'customer'
                ? 'bg-[#075B2A] text-white shadow-xs'
                : 'bg-[#FBF8EF] text-gray-600 hover:bg-[#EFF7E9]'
            }`}
          >
            Customers ({customerCount})
          </button>
        </div>
      </div>

      {/* Users Table / List */}
      <div className="bg-white rounded-3xl border border-[#E1E9DC] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FBF8EF] border-b border-[#E1E9DC] text-gray-500 font-extrabold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-5">User Details</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4">Auth Method</th>
                <th className="py-3.5 px-4">Assigned Role</th>
                <th className="py-3.5 px-5 text-right">Role Actions (Locked)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E1E9DC]/60">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  const isSuperAdmin =
                    user.email.toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase();

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-[#EFF7E9]/30 transition-colors"
                    >
                      {/* User Column */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          {user.photoURL ? (
                            <img
                              src={user.photoURL}
                              alt={user.name}
                              className="w-10 h-10 rounded-2xl object-cover border border-[#8CCB55] shadow-xs"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-2xl bg-[#075B2A] text-white flex items-center justify-center text-sm font-black font-serif-title shadow-xs">
                              {user.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .toUpperCase() || 'U'}
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-[#18251B] text-sm">
                                {user.name}
                              </span>
                              {isSuperAdmin && (
                                <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-300">
                                  Primary Super Admin
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-gray-400">
                              ID: {user.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="py-4 px-4 text-gray-600">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-xs text-[#18251B] font-medium">
                            <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span>{user.email}</span>
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                              <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                              <span>{user.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Auth Method */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-xl border ${
                            user.authProvider === 'google'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-gray-100 text-gray-700 border-gray-200'
                          }`}
                        >
                          {user.authProvider === 'google' ? 'Google OAuth' : 'Password Auth'}
                        </span>
                      </td>

                      {/* Role Badge */}
                      <td className="py-4 px-4">
                        {user.role === 'admin' ? (
                          <span className="inline-flex items-center gap-1 bg-[#EFF7E9] text-[#075B2A] font-extrabold px-3 py-1 rounded-full border border-[#8CCB55] text-xs">
                            <Crown className="w-3.5 h-3.5 text-amber-500" />
                            <span>Administrator</span>
                          </span>
                        ) : user.role === 'manager' ? (
                          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 font-extrabold px-3 py-1 rounded-full border border-blue-300 text-xs">
                            <Shield className="w-3.5 h-3.5 text-blue-600" />
                            <span>Store Manager</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 font-bold px-3 py-1 rounded-full border border-gray-200 text-xs">
                            <span>Customer</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        {isSuperAdmin ? (
                          <span className="text-[11px] text-gray-400 font-medium italic">
                            Protected Super Admin
                          </span>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            {user.role !== 'admin' && (
                              <button
                                type="button"
                                onClick={() => handleOpenRoleModal(user, 'admin')}
                                className="inline-flex items-center gap-1 bg-[#EFF7E9] hover:bg-[#075B2A] text-[#075B2A] hover:text-white border border-[#8CCB55] px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer text-[11px]"
                                title="Promote to Admin (Full Access)"
                              >
                                <Crown className="w-3 h-3 text-amber-500" />
                                <span>Admin</span>
                              </button>
                            )}
                            {user.role !== 'manager' && (
                              <button
                                type="button"
                                onClick={() => handleOpenRoleModal(user, 'manager')}
                                className="inline-flex items-center gap-1 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer text-[11px]"
                                title="Assign Manager (Catalog, Orders, Payments; No RBAC/Scanner)"
                              >
                                <Shield className="w-3 h-3" />
                                <span>Manager</span>
                              </button>
                            )}
                            {user.role !== 'customer' && (
                              <button
                                type="button"
                                onClick={() => handleOpenRoleModal(user, 'customer')}
                                className="inline-flex items-center gap-1 bg-red-50 hover:bg-red-600 text-red-700 hover:text-white border border-red-200 px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer text-[11px]"
                                title="Demote to Regular Customer"
                              >
                                <span>Customer</span>
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    <Users className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                    <p className="font-bold text-[#18251B]">No matching users found</p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Try adjusting your search criteria or role filters.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= PASSWORD-LOCKED ROLE CONFIRMATION MODAL ================= */}
      {isRoleModalOpen && selectedTargetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsRoleModalOpen(false)}
          ></div>

          <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full z-10 shadow-2xl space-y-5 border border-[#E1E9DC]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E1E9DC]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                  <Lock className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#075B2A] font-serif-title">
                  Security Lock: Modify User Role
                </h3>
              </div>
              <button
                onClick={() => setIsRoleModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#FBF8EF] p-4 rounded-2xl border border-[#E1E9DC] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Target User:</span>
                <span className="font-bold text-[#18251B]">{selectedTargetUser.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Email:</span>
                <span className="font-bold text-[#18251B]">{selectedTargetUser.email}</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-[#E1E9DC]">
                <span className="text-gray-500 font-medium">Current Role:</span>
                <span className="font-bold uppercase text-gray-700">{selectedTargetUser.role}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-gray-500 font-medium">New Role Assignment:</span>
                <span
                  className={`font-black px-2.5 py-0.5 rounded-lg text-xs ${
                    targetRoleToAssign === 'admin'
                      ? 'bg-[#EFF7E9] text-[#075B2A] border border-[#8CCB55]'
                      : targetRoleToAssign === 'manager'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {targetRoleToAssign.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="text-xs text-[#667267] space-y-1.5 bg-gray-50 p-3 rounded-xl border border-gray-200">
              <p className="font-bold text-[#18251B]">Role Permissions Summary:</p>
              {targetRoleToAssign === 'admin' && (
                <p className="text-emerald-800">
                  • <strong>Admin:</strong> Full access to Dashboard, Catalog, Orders, Payments, RBAC User Roles, and Scanner & WhatsApp configuration.
                </p>
              )}
              {targetRoleToAssign === 'manager' && (
                <p className="text-blue-800">
                  • <strong>Manager:</strong> Access to Dashboard, Products Catalog, Orders Workflow, and Payment Verification. Restricted from User Roles & Scanner/WhatsApp settings.
                </p>
              )}
              {targetRoleToAssign === 'customer' && (
                <p className="text-gray-600">
                  • <strong>Customer:</strong> Standard storefront shopping, order tracking, and address book only.
                </p>
              )}
            </div>

            <form onSubmit={handleConfirmRoleChange} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#18251B] mb-1.5">
                  Admin Security Password *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="Enter security password"
                    value={securityPasswordInput}
                    onChange={(e) => setSecurityPasswordInput(e.target.value)}
                    className="w-full bg-[#FBF8EF] text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-[#E1E9DC] focus:outline-none focus:border-[#075B2A]"
                    autoFocus
                  />
                  <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRoleModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer ${
                    targetRoleToAssign === 'admin'
                      ? 'bg-[#075B2A] hover:bg-[#06451F]'
                      : targetRoleToAssign === 'manager'
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? 'Applying Role...'
                      : `Confirm & Assign ${targetRoleToAssign.toUpperCase()}`}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
