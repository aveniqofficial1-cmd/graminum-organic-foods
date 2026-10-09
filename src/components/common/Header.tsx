import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  Heart,
  User as UserIcon,
  Menu,
  X,
  Phone,
  MessageCircle,
  ChevronDown,
  ShieldCheck,
  Package,
  MapPin,
  LogOut,
  SlidersHorizontal,
  Crown,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductContext';
import { Product } from '../../types';

export const Header: React.FC = () => {
  const { itemCount, subtotal } = useCart();
  const { wishlistCount } = useWishlist();
  const { currentUser, isAuthenticated, isAdminAuthenticated, isAdmin, isManager, isStaff, logoutCustomer } = useAuth();
  const { products } = useProducts();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const isUserAdmin = currentUser?.role === 'admin';

  // Sticky header shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserDropdownOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Instant live search filter preview
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const q = searchQuery.toLowerCase();
      const results = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.teluguName && p.teluguName.toLowerCase().includes(q)) ||
          p.shortDescription.toLowerCase().includes(q)
      ).slice(0, 5);
      setSearchResults(results);
      setIsSearchOpen(true);
    } else {
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  }, [searchQuery, products]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-xs lg:text-sm font-semibold transition-all px-3 py-1.5 rounded-full ${
      isActive
        ? 'text-[#075B2A] bg-[#EFF7E9] font-bold shadow-xs'
        : 'text-[#18251B] hover:text-[#075B2A] hover:bg-[#EFF7E9]/50'
    }`;

  return (
    <header className="w-full z-40 sticky top-0 transition-all duration-300">
      {/* 1. Top Announcement Bar */}
      <div className="bg-[#075B2A] text-white text-[11px] sm:text-xs py-1.5 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 truncate">
            <span className="bg-[#8CCB55] text-[#06451F] text-[9px] sm:text-[10px] font-extrabold px-1.5 py-0.5 rounded shrink-0">
              100% PURE & TRADITIONAL
            </span>
            <span className="hidden sm:inline font-medium text-emerald-100 truncate">
              Pure & Authentic Natural Products • Traditional Vedic & Chemical-Free Goodness
            </span>
            <span className="sm:hidden font-medium text-emerald-100 truncate text-[10px]">
              100% Pure Vedic Traditional Living
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-emerald-100 shrink-0 text-[11px]">
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1 hover:text-white transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#8CCB55]" />
              <span>WhatsApp: +91 98765 43210</span>
            </a>
            {isAuthenticated && (
              <>
                <span className="hidden md:inline text-emerald-300/40">|</span>
                <Link
                  to="/track-order"
                  className="hover:text-white transition-colors flex items-center gap-1 font-semibold"
                >
                  <Package className="w-3.5 h-3.5 text-[#8CCB55]" />
                  <span>Track Order</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <nav
        className={`bg-white border-b border-[#E1E9DC] transition-all duration-300 ${
          isScrolled ? 'shadow-md py-2' : 'py-2.5 sm:py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Mobile Menu Toggle & Logo */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-1.5 text-[#18251B] hover:text-[#075B2A] hover:bg-[#EFF7E9] rounded-xl transition-colors cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              {/* Official Graminum Logo */}
              <Link to="/" className="flex items-center gap-2 group shrink-0">
                <img
                  src="/assets/graminum-logo.png"
                  alt="Graminum (గ్రామీణం)"
                  className="h-9 sm:h-11 md:h-12 w-auto object-contain transition-transform group-hover:scale-102"
                />
                <div className="hidden xs:flex sm:flex flex-col">
                  <span className="text-base sm:text-xl font-extrabold tracking-tight text-[#075B2A] font-serif-title leading-tight">
                    GRAMINUM
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-[#4D963C] font-telugu font-semibold -mt-1 tracking-wider">
                    గ్రామీణం ఆర్గానిక్స్
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1">
              <NavLink to="/" className={navLinkClass}>
                Home
              </NavLink>
              <NavLink to="/shop" className={navLinkClass}>
                Shop
              </NavLink>
              <NavLink to="/about" className={navLinkClass}>
                About Us
              </NavLink>
              <NavLink to="/faq" className={navLinkClass}>
                FAQ
              </NavLink>
              <NavLink to="/contact" className={navLinkClass}>
                Contact
              </NavLink>
            </div>

            {/* Search Bar with Live Preview (Desktop/Tablet) */}
            <div ref={searchRef} className="hidden md:block relative flex-1 max-w-xs lg:max-w-md">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search millets, oils, mixes, rice..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#FBF8EF] text-[#18251B] placeholder-[#667267] text-xs sm:text-sm pl-9 pr-4 py-2 rounded-full border border-[#E1E9DC] focus:outline-none focus:border-[#075B2A] focus:ring-2 focus:ring-[#8CCB55]/30 transition-all"
                />
                <Search className="w-4 h-4 text-[#667267] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </form>

              {/* Live Search Autocomplete Popup */}
              {isSearchOpen && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-[#E1E9DC] shadow-xl overflow-hidden z-50 p-2">
                  <div className="text-[11px] font-bold text-[#667267] px-3 py-1.5 uppercase tracking-wider">
                    Matching Natural Products
                  </div>
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.slug}`}
                      onClick={() => setIsSearchOpen(false)}
                      className="flex items-center gap-3 p-2 hover:bg-[#EFF7E9] rounded-xl transition-colors"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded-lg shrink-0 border border-gray-100"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#18251B] truncate">{product.name}</p>
                        <p className="text-[11px] text-[#4D963C]">{product.category} • {product.packSize}</p>
                      </div>
                      <span className="text-xs font-bold text-[#075B2A] shrink-0">₹{product.price}</span>
                    </Link>
                  ))}
                  <div className="border-t border-gray-100 mt-1 pt-1 text-center">
                    <button
                      onClick={handleSearchSubmit}
                      className="text-xs font-bold text-[#075B2A] hover:underline py-1 w-full"
                    >
                      View all results for "{searchQuery}" →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Action Controls: Wishlist, User, Cart */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              {/* Wishlist Link */}
              <Link
                to="/shop?filter=wishlist"
                className="relative p-2 text-[#18251B] hover:text-[#075B2A] hover:bg-[#EFF7E9] rounded-xl transition-colors"
                aria-label={`Wishlist (${wishlistCount} items)`}
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-[#D92D20] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* User Account Dropdown */}
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-1 p-2 text-[#18251B] hover:text-[#075B2A] hover:bg-[#EFF7E9] rounded-xl transition-colors cursor-pointer"
                  aria-label="User account menu"
                >
                  <UserIcon className="w-5 h-5" />
                  <span className="hidden xl:inline text-xs font-semibold max-w-[90px] truncate">
                    {isAuthenticated ? currentUser?.name.split(' ')[0] : 'Account'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden xl:inline" />
                </button>

                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-[#E1E9DC] shadow-xl overflow-hidden z-50 py-1.5">
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-2.5 bg-[#EFF7E9] border-b border-[#E1E9DC]">
                          <p className="text-[10px] text-[#667267] uppercase font-bold tracking-wider">Signed in as</p>
                          <p className="text-sm font-bold text-[#075B2A] truncate">
                            {currentUser?.name}
                          </p>
                          <p className="text-[11px] text-[#667267] truncate">{currentUser?.email}</p>
                        </div>
                        <Link
                          to="/account"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#18251B] hover:bg-[#EFF7E9] hover:text-[#075B2A] transition-colors"
                        >
                          <UserIcon className="w-4 h-4 text-[#4D963C]" />
                          <span>My Account</span>
                        </Link>
                        <Link
                          to="/track-order"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#18251B] hover:bg-[#EFF7E9] hover:text-[#075B2A] transition-colors"
                        >
                          <Package className="w-4 h-4 text-[#4D963C]" />
                          <span>Track Live Order</span>
                        </Link>

                        {/* Management Portal is shown if user has admin or manager role */}
                        {isStaff && (
                          <>
                            <div className="border-t border-gray-100 my-1"></div>
                            <Link
                              to="/admin"
                              onClick={() => setIsUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-emerald-900 bg-emerald-50/70 hover:bg-emerald-100 transition-colors"
                            >
                              <Crown className="w-4 h-4 text-amber-500" />
                              <span>{isAdmin ? 'Admin Console' : 'Manager Console'}</span>
                            </Link>
                          </>
                        )}

                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                          onClick={() => {
                            logoutCustomer();
                            setIsUserDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="p-3 text-center space-y-1.5">
                          <p className="text-xs font-bold text-[#18251B]">
                            Welcome to Graminum
                          </p>
                          <div className="flex gap-1.5">
                            <Link
                              to="/login"
                              onClick={() => setIsUserDropdownOpen(false)}
                              className="flex-1 bg-[#075B2A] hover:bg-[#06451F] text-white text-xs font-bold py-1.5 rounded-xl transition-colors text-center"
                            >
                              Sign In
                            </Link>
                            <Link
                              to="/signup"
                              onClick={() => setIsUserDropdownOpen(false)}
                              className="flex-1 bg-[#EFF7E9] hover:bg-[#8CCB55]/30 text-[#075B2A] border border-[#8CCB55] text-xs font-bold py-1.5 rounded-xl transition-colors text-center"
                            >
                              Sign Up
                            </Link>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Shopping Cart Button */}
              <Link
                to="/cart"
                className="flex items-center gap-1.5 sm:gap-2 bg-[#075B2A] hover:bg-[#06451F] text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-xl shadow-sm transition-all active:scale-95 group"
                aria-label={`Shopping cart with ${itemCount} items`}
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-105 transition-transform" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-[#8CCB55] text-[#06451F] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                      {itemCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline font-bold">
                  {subtotal > 0 ? `₹${subtotal}` : 'Cart'}
                </span>
              </Link>
            </div>
          </div>

          {/* Mobile Search Bar (under logo on small screens) */}
          <div className="mt-2 md:hidden">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search natural products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FBF8EF] text-[#18251B] placeholder-[#667267] text-xs pl-8 pr-4 py-2 rounded-xl border border-[#E1E9DC] focus:outline-none focus:border-[#075B2A]"
              />
              <Search className="w-3.5 h-3.5 text-[#667267] absolute left-2.5 top-1/2 -translate-y-1/2" />
            </form>
          </div>
        </div>
      </nav>

      {/* 3. Mobile Navigation Drawer Slide-over */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          {/* Drawer Content */}
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between p-5 sm:p-6 z-10 overflow-y-auto">
            <div>
              {/* Drawer Header with Logo (Navigates to Home / across all roles) */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E1E9DC]">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 group"
                >
                  <img
                    src="/assets/graminum-logo.png"
                    alt="Graminum Logo"
                    className="h-9 w-auto transition-transform group-hover:scale-105"
                  />
                  <div>
                    <span className="text-base font-extrabold text-[#075B2A] font-serif-title block">
                      GRAMINUM
                    </span>
                    <span className="text-[10px] text-[#4D963C] font-telugu font-semibold block -mt-1">
                      గ్రామీణం ఆర్గానిక్స్
                    </span>
                  </div>
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-gray-500 hover:text-gray-800 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="py-4 space-y-1">
                <p className="text-[10px] font-bold text-[#667267] uppercase tracking-wider mb-2">
                  Navigation
                </p>
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-bold text-[#18251B] hover:bg-[#EFF7E9] rounded-xl"
                >
                  Home
                </Link>
                <Link
                  to="/shop"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-bold text-[#18251B] hover:bg-[#EFF7E9] rounded-xl"
                >
                  Shop All Products
                </Link>
                {isAuthenticated && (
                  <Link
                    to="/track-order"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm font-bold text-[#18251B] hover:bg-[#EFF7E9] rounded-xl"
                  >
                    Track Order
                  </Link>
                )}
                <Link
                  to="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-bold text-[#18251B] hover:bg-[#EFF7E9] rounded-xl"
                >
                  About Us
                </Link>
                <Link
                  to="/faq"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-bold text-[#18251B] hover:bg-[#EFF7E9] rounded-xl"
                >
                  FAQ
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-bold text-[#18251B] hover:bg-[#EFF7E9] rounded-xl"
                >
                  Contact Us
                </Link>
              </div>

              {/* Shop Categories Quick Links */}
              <div className="py-3 border-t border-[#E1E9DC]">
                <p className="text-[10px] font-bold text-[#667267] uppercase tracking-wider mb-2">
                  Categories
                </p>
                <div className="grid grid-cols-1 gap-1.5">
                  <Link
                    to="/shop?category=Personal+Care"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-1.5 text-xs text-[#18251B] hover:text-[#075B2A] rounded-lg hover:bg-emerald-50"
                  >
                    <span>🌿 Personal Care</span>
                    <span className="text-[10px] text-gray-400">View →</span>
                  </Link>
                  <Link
                    to="/shop?category=Herbal+Oils"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-1.5 text-xs text-[#18251B] hover:text-[#075B2A] rounded-lg hover:bg-emerald-50"
                  >
                    <span>🪔 Herbal Oils</span>
                    <span className="text-[10px] text-gray-400">View →</span>
                  </Link>
                  <Link
                    to="/shop?category=Natural+Foods"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-1.5 text-xs text-[#18251B] hover:text-[#075B2A] rounded-lg hover:bg-emerald-50"
                  >
                    <span>🍯 Natural Foods</span>
                    <span className="text-[10px] text-gray-400">View →</span>
                  </Link>
                  <Link
                    to="/shop?category=Herbal+Wellness"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-1.5 text-xs text-[#18251B] hover:text-[#075B2A] rounded-lg hover:bg-emerald-50"
                  >
                    <span>🌱 Herbal Wellness</span>
                    <span className="text-[10px] text-gray-400">View →</span>
                  </Link>
                  <Link
                    to="/shop?category=Pooja+Essentials"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-1.5 text-xs text-[#18251B] hover:text-[#075B2A] rounded-lg hover:bg-emerald-50"
                  >
                    <span>🛕 Pooja Essentials</span>
                    <span className="text-[10px] text-gray-400">View →</span>
                  </Link>
                  <Link
                    to="/shop?category=Fragrances"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-1.5 text-xs text-[#18251B] hover:text-[#075B2A] rounded-lg hover:bg-emerald-50"
                  >
                    <span>🌸 Fragrances</span>
                    <span className="text-[10px] text-gray-400">View →</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="pt-4 border-t border-[#E1E9DC] space-y-2">
              <Link
                to="/account"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#EFF7E9] text-[#075B2A] rounded-xl text-xs font-bold"
              >
                <UserIcon className="w-4 h-4" />
                <span>{isAuthenticated ? 'My Account' : 'Sign In / Register'}</span>
              </Link>

              {/* Management Console is displayed if the user has admin or manager role */}
              {isStaff && (
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2 bg-emerald-100 text-emerald-900 font-extrabold rounded-xl text-xs border border-emerald-300"
                >
                  <Crown className="w-4 h-4 text-amber-600" />
                  <span>{isAdmin ? 'Admin Console' : 'Manager Console'}</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
