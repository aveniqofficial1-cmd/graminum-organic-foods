import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  SlidersHorizontal,
  Search,
  X,
  Filter,
  ArrowUpDown,
  RotateCcw,
  PackageX,
  Check,
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { ProductCategory, Product } from '../types';
import { ProductCard } from '../components/common/ProductCard';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { useWishlist } from '../context/WishlistContext';

export const ShopPage: React.FC = () => {
  const { products } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const { wishlistIds } = useWishlist();

  // URL query params
  const categoryParam = searchParams.get('category') as ProductCategory | null;
  const searchParam = searchParams.get('search') || '';
  const filterParam = searchParams.get('filter') || '';

  // State
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'All');
  const [searchQuery, setSearchQuery] = useState<string>(searchParam);
  const [priceRange, setPriceRange] = useState<number>(2000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [bestsellerOnly, setBestsellerOnly] = useState<boolean>(filterParam === 'bestseller');
  const [wishlistOnly, setWishlistOnly] = useState<boolean>(filterParam === 'wishlist');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Sync state when URL search params change
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory('All');
    }
    if (searchParam) {
      setSearchQuery(searchParam);
    }
    if (filterParam === 'bestseller') {
      setBestsellerOnly(true);
    } else if (filterParam === 'wishlist') {
      setWishlistOnly(true);
    }
  }, [categoryParam, searchParam, filterParam]);

  const categories: string[] = [
    'All',
    'Personal Care',
    'Herbal Oils',
    'Natural Foods',
    'Herbal Wellness',
    'Pooja Essentials',
    'Fragrances',
  ];

  // Filtering & Sorting Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.teluguName && p.teluguName.toLowerCase().includes(q)) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.ingredients.some((ing) => ing.toLowerCase().includes(q))
      );
    }

    // Price slider filter
    result = result.filter((p) => p.price <= priceRange);

    // In stock filter
    if (inStockOnly) {
      result = result.filter((p) => p.stock > 0);
    }

    // Bestseller filter
    if (bestsellerOnly) {
      result = result.filter((p) => p.isBestseller);
    }

    // Wishlist only filter
    if (wishlistOnly) {
      result = result.filter((p) => wishlistIds.includes(p.id));
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return result;
  }, [
    products,
    selectedCategory,
    searchQuery,
    priceRange,
    inStockOnly,
    bestsellerOnly,
    wishlistOnly,
    sortBy,
    wishlistIds,
  ]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setPriceRange(2000);
    setInStockOnly(false);
    setBestsellerOnly(false);
    setWishlistOnly(false);
    setSortBy('featured');
    setSearchParams({});
  };

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    searchQuery !== '' ||
    priceRange < 2000 ||
    inStockOnly ||
    bestsellerOnly ||
    wishlistOnly;

  return (
    <div className="w-full bg-[#FBF8EF] min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Breadcrumb items={[{ label: 'Shop Natural Products' }]} />
          <p className="text-xs text-[#667267] font-medium">
            Showing <strong className="text-[#075B2A]">{filteredProducts.length}</strong> authentic natural items
          </p>
        </div>

        {/* Layout Grid: Left Sidebar & Right Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ================= DESKTOP SIDEBAR FILTERS ================= */}
          <aside className="hidden lg:block lg:col-span-3 bg-white p-6 rounded-3xl border border-[#E1E9DC] shadow-sm sticky top-28 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E1E9DC]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#075B2A]" />
                <h2 className="text-sm font-bold text-[#18251B] uppercase tracking-wider">
                  Filters
                </h2>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="text-xs font-bold text-[#18251B] uppercase tracking-wider mb-3">
                Categories
              </h3>
              <div className="space-y-1">
                {categories.map((cat) => {
                  const count =
                    cat === 'All'
                      ? products.length
                      : products.filter((p) => p.category === cat).length;
                  const isSelected = selectedCategory === cat;

                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        if (cat === 'All') {
                          searchParams.delete('category');
                        } else {
                          searchParams.set('category', cat);
                        }
                        setSearchParams(searchParams);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#075B2A] text-white shadow-xs font-bold'
                          : 'text-[#18251B] hover:bg-[#EFF7E9] hover:text-[#075B2A]'
                      }`}
                    >
                      <span>{cat}</span>
                      <span
                        className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Range Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-[#18251B] uppercase tracking-wider">
                  Max Price
                </h3>
                <span className="text-xs font-extrabold text-[#075B2A]">₹{priceRange}</span>
              </div>
              <input
                type="range"
                min="100"
                max="2000"
                step="50"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#075B2A] cursor-pointer"
              />
              <div className="flex items-center justify-between text-[11px] text-gray-400 mt-1">
                <span>₹100</span>
                <span>₹2000+</span>
              </div>
            </div>

            {/* Special Checkbox Toggles */}
            <div className="pt-2 border-t border-[#E1E9DC] space-y-2.5">
              <h3 className="text-xs font-bold text-[#18251B] uppercase tracking-wider mb-2">
                Preferences
              </h3>

              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-[#18251B]">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-[#E1E9DC] text-[#075B2A] focus:ring-[#8CCB55] w-4 h-4"
                />
                <span>In-Stock Items Only</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-[#18251B]">
                <input
                  type="checkbox"
                  checked={bestsellerOnly}
                  onChange={(e) => setBestsellerOnly(e.target.checked)}
                  className="rounded border-[#E1E9DC] text-[#075B2A] focus:ring-[#8CCB55] w-4 h-4"
                />
                <span>Bestsellers Only ⭐</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-[#18251B]">
                <input
                  type="checkbox"
                  checked={wishlistOnly}
                  onChange={(e) => setWishlistOnly(e.target.checked)}
                  className="rounded border-[#E1E9DC] text-[#075B2A] focus:ring-[#8CCB55] w-4 h-4"
                />
                <span>My Wishlist Items ❤️ ({wishlistIds.length})</span>
              </label>
            </div>
          </aside>

          {/* ================= RIGHT MAIN PRODUCTS LISTING ================= */}
          <main className="lg:col-span-9 space-y-6">
            {/* Top Toolbar: Search, Mobile Filter Button, Sorting */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#E1E9DC] shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search products by grain, herb, or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#FBF8EF] text-[#18251B] text-xs sm:text-sm pl-9 pr-8 py-2.5 rounded-2xl border border-[#E1E9DC] focus:outline-none focus:border-[#075B2A]"
                />
                <Search className="w-4 h-4 text-[#667267] absolute left-3 top-1/2 -translate-y-1/2" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Mobile Filter Button & Desktop Sort Dropdown */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden flex items-center justify-center gap-2 bg-[#EFF7E9] border border-[#8CCB55] text-[#075B2A] px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                  {hasActiveFilters && (
                    <span className="w-2 h-2 rounded-full bg-[#075B2A]"></span>
                  )}
                </button>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2 bg-[#FBF8EF] border border-[#E1E9DC] px-3 py-1.5 rounded-2xl shrink-0">
                  <ArrowUpDown className="w-3.5 h-3.5 text-gray-500 hidden sm:inline" />
                  <span className="text-xs text-gray-500 font-semibold hidden md:inline">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-xs font-bold text-[#18251B] focus:outline-none cursor-pointer py-1"
                  >
                    <option value="featured">Featured First</option>
                    <option value="newest">Newest Harvest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Active Filters Tag Pills */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="text-gray-500 font-medium">Active filters:</span>
                {selectedCategory !== 'All' && (
                  <span className="inline-flex items-center gap-1 bg-[#EFF7E9] text-[#075B2A] font-bold px-2.5 py-1 rounded-full border border-[#8CCB55]">
                    Category: {selectedCategory}
                    <button
                      onClick={() => setSelectedCategory('All')}
                      className="hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 bg-[#EFF7E9] text-[#075B2A] font-bold px-2.5 py-1 rounded-full border border-[#8CCB55]">
                    "{searchQuery}"
                    <button onClick={() => setSearchQuery('')} className="hover:text-red-600">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {priceRange < 2000 && (
                  <span className="inline-flex items-center gap-1 bg-[#EFF7E9] text-[#075B2A] font-bold px-2.5 py-1 rounded-full border border-[#8CCB55]">
                    Under ₹{priceRange}
                    <button onClick={() => setPriceRange(2000)} className="hover:text-red-600">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {bestsellerOnly && (
                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 font-bold px-2.5 py-1 rounded-full border border-amber-200">
                    Bestsellers
                    <button onClick={() => setBestsellerOnly(false)} className="hover:text-red-600">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {wishlistOnly && (
                  <span className="inline-flex items-center gap-1 bg-red-50 text-red-800 font-bold px-2.5 py-1 rounded-full border border-red-200">
                    Wishlist Only
                    <button onClick={() => setWishlistOnly(false)} className="hover:text-red-600">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-red-600 hover:underline font-semibold ml-1 cursor-pointer"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Product Grid or Empty State */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-[#E1E9DC] p-12 text-center space-y-4 shadow-sm">
                <div className="w-16 h-16 bg-[#EFF7E9] text-[#075B2A] rounded-full flex items-center justify-center mx-auto text-3xl">
                  🌾
                </div>
                <h3 className="text-xl font-bold text-[#18251B] font-serif-title">
                  No Natural Products Found
                </h3>
                <p className="text-xs sm:text-sm text-[#667267] max-w-md mx-auto">
                  We couldn't find any products matching your current filters. Try changing your search query, increasing price limit, or clearing category selections.
                </p>
                <div>
                  <button
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-2 bg-[#075B2A] text-white text-xs font-bold px-6 py-2.5 rounded-xl hover:bg-[#06451F] transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset All Filters</span>
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ================= MOBILE FILTER DRAWER ================= */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsMobileFilterOpen(false)}
          ></div>

          <div className="relative ml-auto w-4/5 max-w-xs bg-white h-full shadow-2xl p-6 z-10 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#E1E9DC]">
                <h2 className="text-sm font-bold text-[#18251B] uppercase tracking-wider">
                  Filter Products
                </h2>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1.5 text-gray-500 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-xs font-bold text-[#18251B] uppercase tracking-wider mb-2">
                  Category
                </h3>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold ${
                        selectedCategory === cat
                          ? 'bg-[#075B2A] text-white font-bold'
                          : 'text-[#18251B] hover:bg-[#EFF7E9]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Slider */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xs font-bold text-[#18251B] uppercase tracking-wider">
                    Max Price
                  </h3>
                  <span className="text-xs font-bold text-[#075B2A]">₹{priceRange}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="50"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#075B2A]"
                />
              </div>

              {/* Toggles */}
              <div className="space-y-2 pt-2 border-t border-[#E1E9DC]">
                <label className="flex items-center gap-2 text-xs font-medium">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded text-[#075B2A]"
                  />
                  <span>In-Stock Only</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-medium">
                  <input
                    type="checkbox"
                    checked={bestsellerOnly}
                    onChange={(e) => setBestsellerOnly(e.target.checked)}
                    className="rounded text-[#075B2A]"
                  />
                  <span>Bestsellers ⭐</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-medium">
                  <input
                    type="checkbox"
                    checked={wishlistOnly}
                    onChange={(e) => setWishlistOnly(e.target.checked)}
                    className="rounded text-[#075B2A]"
                  />
                  <span>Wishlist Items ❤️</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E1E9DC] space-y-2">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full bg-[#075B2A] text-white py-2.5 rounded-xl text-xs font-bold shadow-md cursor-pointer"
              >
                Apply Filters ({filteredProducts.length})
              </button>
              <button
                onClick={handleResetFilters}
                className="w-full bg-gray-100 text-gray-700 py-2 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
